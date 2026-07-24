"use server";

import { revalidatePath } from "next/cache";
import {
  createServerSupabaseClient,
  createAdminSupabaseClient,
} from "@/lib/supabase/server";

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
export async function checkInToSession(roomId) {
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

  const now = Date.now();
  const startsAt = new Date(session.starts_at).getTime();
  const endsAt = new Date(session.ends_at).getTime();

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
