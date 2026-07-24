"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { DIVISIONS_ABSENSI, generateRoomId } from "@/lib/absensi";

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

  const startsAt = new Date(`${date}T${startTime}:00`);
  const endsAt = new Date(`${date}T${endTime}:00`);
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
