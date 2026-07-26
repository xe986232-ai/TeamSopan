"use server";

import { revalidatePath } from "next/cache";
import {
  createServerSupabaseClient,
  createAdminSupabaseClient,
} from "@/lib/supabase/server";
import {
  zonedWallClockToUtcMs,
  wallClockComponentsFromIso,
  FALLBACK_TIME_ZONE,
} from "@/lib/timezone";

// Absen di sesi `roomId`. Alur keamanan sama seperti pola lain di project
// ini (mis. app/profil/actions.js): PERTAMA cek siapa yang lagi login
// lewat cookie sesi (createServerSupabaseClient), verifikasi sesi absensi
// masih dalam jendela waktu aktif, BARU insert catatan kehadiran pakai
// secret key (createAdminSupabaseClient) -- browser tidak pernah bisa
// insert attendance_records secara langsung.
//
// Nama yang tercatat SELALU diambil dari data member yang login (bukan
// input manual dari form) -- sesuai permintaan supaya tidak ada lagi
// input nama bebas di halaman absensi.
export async function checkInToSession(roomId, clientTimeZone) {
  const sessionClient = createServerSupabaseClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    return { unauthenticated: true };
  }

  const { data: member, error: memberError } = await sessionClient
    .from("members")
    .select("id, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (memberError || !member) {
    return { error: "Data member kamu tidak ditemukan. Hubungi admin." };
  }

  const { data: session, error: sessionError } = await sessionClient
    .from("attendance_sessions")
    .select("*")
    .eq("room_id", roomId)
    .maybeSingle();

  if (sessionError || !session) {
    return { error: "Sesi absensi tidak ditemukan atau sudah tidak aktif." };
  }

  // Jam sesi (starts_at/ends_at) tersimpan sebagai jam dinding apa
  // adanya (lihat komentar di app/dashboard/absensi/actions.js), jadi
  // buat dibandingkan adil ke Date.now() (yang absolut), kita hitung
  // ulang jadi instant UTC SESUAI zona waktu device yang lagi absen --
  // bukan patokan 1 zona waktu tetap kayak dulu (WIB). Kalau browser
  // gagal ngasih timezone-nya (jarang, tapi jaga-jaga), fallback ke WIB
  // supaya tetap ada validasi yang masuk akal.
  const timeZone = clientTimeZone || FALLBACK_TIME_ZONE;
  const startComponents = wallClockComponentsFromIso(session.starts_at);
  const endComponents = wallClockComponentsFromIso(session.ends_at);

  const now = Date.now();
  const startsAt = zonedWallClockToUtcMs(
    startComponents.year,
    startComponents.month,
    startComponents.day,
    startComponents.hour,
    startComponents.minute,
    startComponents.second,
    timeZone
  );
  const endsAt = zonedWallClockToUtcMs(
    endComponents.year,
    endComponents.month,
    endComponents.day,
    endComponents.hour,
    endComponents.minute,
    endComponents.second,
    timeZone
  );

  if (now < startsAt) {
    return { error: "Sesi absensi belum dimulai." };
  }
  if (now >= endsAt) {
    return { error: "Sesi absensi sudah berakhir." };
  }

  const { data: existing } = await sessionClient
    .from("attendance_records")
    .select("id")
    .eq("session_id", session.id)
    .eq("member_id", user.id)
    .maybeSingle();

  if (existing) {
    return { success: true, alreadyCheckedIn: true };
  }

  const admin = createAdminSupabaseClient();
  const { data: record, error: insertError } = await admin
    .from("attendance_records")
    .insert({
      session_id: session.id,
      member_id: user.id,
      full_name: member.full_name,
    })
    .select("*")
    .single();

  if (insertError) {
    return { error: `Gagal mencatat absensi: ${insertError.message}` };
  }

  revalidatePath(`/absensi/${roomId}`);

  return { success: true, record };
}

// Kirim pesan/status singkat di sesi `roomId`. Cuma pesan TERAKHIR tiap
// member yang ditampilkan sebagai bubble chat di atas avatar dia (lihat
// query dedupe di app/absensi/[roomId]/page.js) -- jadi kirim pesan baru
// otomatis "menimpa" bubble lama, bukan numpuk semua histori.
export async function sendMessage(roomId, text) {
  const trimmed = (text || "").trim().slice(0, 140);
  if (!trimmed) {
    return { error: "Pesan tidak boleh kosong." };
  }

  const sessionClient = createServerSupabaseClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    return { unauthenticated: true };
  }

  const { data: member, error: memberError } = await sessionClient
    .from("members")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (memberError || !member) {
    return { error: "Data member kamu tidak ditemukan. Hubungi admin." };
  }

  const { data: session, error: sessionError } = await sessionClient
    .from("attendance_sessions")
    .select("id")
    .eq("room_id", roomId)
    .maybeSingle();

  if (sessionError || !session) {
    return { error: "Sesi absensi tidak ditemukan atau sudah tidak aktif." };
  }

  const admin = createAdminSupabaseClient();
  const { data: message, error: insertError } = await admin
    .from("attendance_messages")
    .insert({
      session_id: session.id,
      member_id: user.id,
      message: trimmed,
    })
    .select("id, member_id, message, created_at")
    .single();

  if (insertError) {
    return { error: `Gagal mengirim pesan: ${insertError.message}` };
  }

  revalidatePath(`/absensi/${roomId}`);

  return { success: true, message };
}

// Toggle 1 emoji reaksi ke sebuah pesan -- EXCLUSIVE per member per
// pesan (cuma boleh 1 emoji aktif). Kalau member ini pilih emoji yang
// SAMA dengan yang lagi aktif, tap lagi = hapus (batal reaksi). Kalau
// pilih emoji BEDA, reaksi lama dia di pesan itu otomatis kehapus dulu
// baru yang baru dipasang -- jadi gak numpuk beberapa emoji sekaligus
// dari 1 orang di 1 pesan yang sama.
export async function toggleReaction(roomId, messageId, emoji) {
  const sessionClient = createServerSupabaseClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    return { unauthenticated: true };
  }

  const admin = createAdminSupabaseClient();

  // Reaksi member ini yang lagi aktif di pesan ini (kalau ada) --
  // paling banyak 1 baris karena logika di bawah selalu jaga
  // exclusivity-nya.
  const { data: existing } = await admin
    .from("attendance_reactions")
    .select("id, emoji")
    .eq("message_id", messageId)
    .eq("member_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error: deleteError } = await admin
      .from("attendance_reactions")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      return { error: `Gagal menghapus reaksi: ${deleteError.message}` };
    }

    // Emoji yang di-tap sama dengan yang lagi aktif -> cukup dihapus,
    // selesai (ini toggle "batal reaksi").
    if (existing.emoji === emoji) {
      revalidatePath(`/absensi/${roomId}`);
      return { success: true, removed: true };
    }
  }

  const { data: reaction, error: insertError } = await admin
    .from("attendance_reactions")
    .insert({ message_id: messageId, member_id: user.id, emoji })
    .select("id, message_id, member_id, emoji")
    .single();

  if (insertError) {
    return { error: `Gagal menambah reaksi: ${insertError.message}` };
  }

  revalidatePath(`/absensi/${roomId}`);
  return { success: true, reaction };
}
