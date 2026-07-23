"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/server";

// Cek apakah token aktivasi masih valid (ada & belum dipakai).
// Dipanggil pas halaman /masuk?token=... dibuka, buat mutusin nampilin
// form "set password" atau form login biasa.
export async function checkActivationToken(token) {
  if (!token) return { valid: false };

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("activation_tokens")
    .select("token, used, members(full_name, email)")
    .eq("token", token)
    .maybeSingle();

  if (error || !data || data.used) {
    return { valid: false };
  }

  return {
    valid: true,
    name: data.members?.full_name,
    email: data.members?.email,
  };
}

// Set password sendiri lewat link aktivasi (sekali pakai). Setelah ini
// token langsung mati dan tidak bisa dipakai lagi.
export async function activateAccount(token, newPassword) {
  if (!token || !newPassword || newPassword.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }

  const supabase = createAdminSupabaseClient();

  const { data: tokenRow, error: tokenError } = await supabase
    .from("activation_tokens")
    .select("token, used, member_id, members(email)")
    .eq("token", token)
    .maybeSingle();

  if (tokenError || !tokenRow || tokenRow.used) {
    return { error: "Link aktivasi sudah tidak berlaku." };
  }

  const { error: passwordError } = await supabase.auth.admin.updateUserById(
    tokenRow.member_id,
    { password: newPassword }
  );

  if (passwordError) {
    return { error: `Gagal mengatur password: ${passwordError.message}` };
  }

  const { error: markUsedError } = await supabase
    .from("activation_tokens")
    .update({ used: true, used_at: new Date().toISOString() })
    .eq("token", token);

  if (markUsedError) {
    return { error: `Gagal menyelesaikan aktivasi: ${markUsedError.message}` };
  }

  // Sekalian aktifkan status member dari "trial" jadi "aktif".
  await supabase
    .from("members")
    .update({ status: "aktif" })
    .eq("id", tokenRow.member_id);

  return { success: true, email: tokenRow.members?.email };
}
