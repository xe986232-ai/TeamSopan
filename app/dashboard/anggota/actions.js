"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

// Hapus anggota sepenuhnya: akun login (Supabase Auth) DIHAPUS juga,
// bukan cuma baris di tabel `members` -- soalnya kalau cuma baris
// `members` yang dihapus, akun Auth-nya masih hidup dan orang itu masih
// bisa login walau datanya sudah "hilang" dari dashboard. Menghapus baris
// `members` juga otomatis menghapus `activation_tokens` miliknya (cascade).
export async function deleteMember(id) {
  const supabase = createAdminSupabaseClient();

  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  // Kalau akun Auth-nya memang sudah tidak ada (mis. pernah dihapus manual),
  // biarkan lanjut hapus baris `members` -- jangan berhenti di sini.
  if (authError && authError.status !== 404 && authError.code !== "user_not_found") {
    return { error: `Gagal menghapus akun login: ${authError.message}` };
  }

  const { error: memberError } = await supabase.from("members").delete().eq("id", id);

  if (memberError) {
    return { error: `Gagal menghapus data anggota: ${memberError.message}` };
  }

  revalidatePath("/dashboard/anggota");
  revalidatePath("/dashboard/pendaftar");
  return { success: true };
}
