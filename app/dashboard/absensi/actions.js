"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { DIVISIONS_ABSENSI, generateRoomId } from "@/lib/absensi";
import { zonedWallClockToUtcMs, SESSION_TIME_ZONE } from "@/lib/timezone";
import { getCurrentDashboardRole } from "@/lib/dashboard-role-server";

// Jam yang diketik admin di form (mis. "07:00") SELALU dianggap WIB
// (SESSION_TIME_ZONE) dan dikonversi jadi instant UTC yang tepat --
// hasilnya 1 momen absolut yang sama buat SEMUA orang, di zona waktu
// manapun mereka buka linknya (WIB/WITA/WIT/luar negeri).
//
// PENTING: sebelumnya jam ini sempat disimpan "apa adanya" (trik
// akhiran "Z") lalu ditafsir ULANG sesuai timezone device tiap
// pengunjung pas dibuka -- niatnya biar adil, tapi efeknya malah bikin
// sesi kebuka di MOMEN NYATA yang beda-beda buat orang di zona
// berbeda (ada yang masih nunggu, ada yang udah jalan duluan). Itu
// bug yang lagi diperbaiki di sini: sesi harus mulai BARENG buat
// semua orang, bukan disesuaikan ke jam lokal masing-masing.
function wallClockDateTime(date, time) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const ms = zonedWallClockToUtcMs(
    year,
    month - 1,
    day,
    hour,
    minute,
    0,
    SESSION_TIME_ZONE
  );
  return new Date(ms);
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

  // Admin divisi cuma boleh bikin sesi buat divisinya sendiri -- jangan
  // cuma percaya value `division` dari form (form-nya emang dikunci di
  // UI, tapi request bisa dipalsu langsung tanpa lewat UI).
  const role = await getCurrentDashboardRole();
  if (!role) {
    return { error: "Sesi login tidak valid." };
  }
  if (role.type === "division" && role.division !== division) {
    return { error: "Kamu cuma bisa membuat sesi absensi untuk divisimu sendiri." };
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
  const role = await getCurrentDashboardRole();
  if (!role) {
    return { error: "Sesi login tidak valid." };
  }

  const supabase = createAdminSupabaseClient();

  const { data: session, error: sessionError } = await supabase
    .from("attendance_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { error: "Sesi absensi tidak ditemukan." };
  }

  if (role.type === "division" && role.division !== session.division) {
    return { error: "Kamu tidak punya akses ke sesi absensi divisi lain." };
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
  const role = await getCurrentDashboardRole();
  if (!role) {
    return { error: "Sesi login tidak valid." };
  }

  const supabase = createAdminSupabaseClient();

  if (role.type === "division") {
    const { data: session } = await supabase
      .from("attendance_sessions")
      .select("division")
      .eq("id", id)
      .maybeSingle();

    if (!session || session.division !== role.division) {
      return { error: "Kamu tidak punya akses ke sesi absensi divisi lain." };
    }
  }

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
