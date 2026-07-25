"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { DIVISIONS_ABSENSI, generateRoomId } from "@/lib/absensi";

// Jam yang diketik admin di form (mis. "07:00") disimpan APA ADANYA
// sebagai jam dinding (wall clock) -- BUKAN dipatok ke 1 zona waktu
// tertentu (dulu selalu dianggap WIB, jadi anggota di WITA/WIT baru
// bisa absen 1-2 jam "telat" dari jam yang diketik admin).
//
// Triknya: string tanggal+jam ditulis dengan akhiran "Z" (seolah-olah
// UTC) pas dibikin jadi Date, supaya Node TIDAK menerapkan offset
// timezone apa pun -- angka yang diketik admin (07, 00, dst) tersimpan
// utuh di kolom `timestamptz`, gak peduli server jalan di timezone apa
// (Vercel default-nya UTC, tapi ini sengaja dibuat gak bergantung ke
// itu).
//
// Pas dibaca balik, sisi tampilan (lib/absensi.js -> toLocalWallClock,
// dan lib/timezone.js buat validasi server) baca ulang angka2 itu lewat
// getUTC*() lalu direkonstruksi pakai timezone device masing2 orang.
// Hasilnya: "07:00" yang diketik admin kebaca "07:00" juga di jam siapa
// pun yang buka linknya -- WIB, WITA, WIT, atau zona manapun -- gak ada
// yang telat nunggu digeser offset.
function wallClockDateTime(date, time) {
  return new Date(`${date}T${time}:00Z`);
}

// Dipanggil dari form "Buat Sesi Absensi Baru" di /dashboard/absensi.
// Halaman ini sudah dijaga middleware (cuma admin yang bisa akses), jadi
// server action ini boleh langsung pakai secret key -- tidak perlu cek
// identitas ulang di sini.
export async function createAttendanceSession({
  division,
  date,
  startTime,
  endTime,
}) {
  if (!division || !DIVISIONS_ABSENSI[division]) {
    return { error: "Divisi tidak dikenali." };
  }
  if (!date || !startTime || !endTime) {
    return { error: "Tanggal, jam mulai, dan jam selesai wajib diisi." };
  }

  const startsAt = wallClockDateTime(date, startTime);
  const endsAt = wallClockDateTime(date, endTime);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    return { error: "Tanggal/jam tidak valid." };
  }
  if (endsAt.getTime() <= startsAt.getTime()) {
    return { error: "Jam selesai harus lebih besar dari jam mulai." };
  }

  const supabase = createAdminSupabaseClient();
  const roomId = generateRoomId(division);

  const { data, error } = await supabase
    .from("attendance_sessions")
    .insert({
      room_id: roomId,
      division,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    return { error: `Gagal membuat sesi absensi: ${error.message}` };
  }

  revalidatePath("/dashboard/absensi");

  return { success: true, session: data };
}

// Rekap kehadiran 1 sesi -- dipanggil pas admin klik "Lihat" di
// /dashboard/absensi. Balikin 2 daftar: member yang SUDAH absen (join
// attendance_records, ada jam absennya) dan yang BELUM/TIDAK absen
// (anggota aktif divisi itu yang gak punya baris di attendance_records
// buat sesi ini).
export async function getAttendanceRecap(sessionId) {
  const supabase = createAdminSupabaseClient();

  const { data: session, error: sessionError } = await supabase
    .from("attendance_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { error: "Sesi absensi tidak ditemukan." };
  }

  // Anggota aktif divisi ini -- yang "nonaktif" gak dihitung, sama kayak
  // penghitungan totalMembers di halaman /dashboard/absensi.
  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id, full_name, avatar_url")
    .eq("division", session.division)
    .neq("status", "nonaktif")
    .order("full_name", { ascending: true });

  if (membersError) {
    return { error: `Gagal memuat data anggota: ${membersError.message}` };
  }

  const { data: records, error: recordsError } = await supabase
    .from("attendance_records")
    .select("member_id, full_name, checked_in_at")
    .eq("session_id", sessionId);

  if (recordsError) {
    return { error: `Gagal memuat data absensi: ${recordsError.message}` };
  }

  const recordByMember = new Map(
    (records || []).map((r) => [r.member_id, r])
  );

  const hadir = [];
  const tidakHadir = [];

  (members || []).forEach((m) => {
    const record = recordByMember.get(m.id);
    if (record) {
      hadir.push({
        id: m.id,
        fullName: m.full_name,
        avatarUrl: m.avatar_url,
        checkedInAt: record.checked_in_at,
      });
    } else {
      tidakHadir.push({
        id: m.id,
        fullName: m.full_name,
        avatarUrl: m.avatar_url,
      });
    }
  });

  // Kalau ada baris di attendance_records yang member-nya udah gak ada
  // di tabel members (mis. dihapus/dinonaktifkan setelah absen), tetap
  // ditampilkan di daftar hadir pakai snapshot nama yang tersimpan --
  // biar rekap sesi lama gak kehilangan data.
  const knownMemberIds = new Set((members || []).map((m) => m.id));
  (records || []).forEach((r) => {
    if (!knownMemberIds.has(r.member_id)) {
      hadir.push({
        id: r.member_id,
        fullName: r.full_name,
        avatarUrl: null,
        checkedInAt: r.checked_in_at,
      });
    }
  });

  hadir.sort((a, b) => new Date(a.checkedInAt) - new Date(b.checkedInAt));

  return {
    success: true,
    session,
    hadir,
    tidakHadir,
  };
}

// Hapus sesi (misal sesi salah input / mau dibatalkan). Ikut menghapus
// semua attendance_records terkait (on delete cascade).
export async function deleteAttendanceSession(id) {
  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("attendance_sessions")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: `Gagal menghapus sesi: ${error.message}` };
  }

  revalidatePath("/dashboard/absensi");
  return { success: true };
}
