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
    .select("token, used, members(full_name, email, division)")
    .eq("token", token)
    .maybeSingle();

  if (error || !data || data.used) {
    return { valid: false };
  }

  return {
    valid: true,
    name: data.members?.full_name,
    email: data.members?.email,
    division: data.members?.division,
  };
}

// Set password sendiri lewat link aktivasi (sekali pakai), sekalian upload
// foto profil kalau ada. Setelah ini token langsung mati dan tidak bisa
// dipakai lagi. `formData` berisi: token, password, dan file "photo" (opsional).
export async function activateAccount(formData) {
  const token = formData.get("token");
  const newPassword = formData.get("password");
  const photo = formData.get("photo");

  if (!token || !newPassword || newPassword.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }

  const supabase = createAdminSupabaseClient();

  const { data: tokenRow, error: tokenError } = await supabase
    .from("activation_tokens")
    .select("token, used, member_id, members(full_name, email, division)")
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

  // Upload foto profil kalau pendaftar lengkapi di form aktivasi. Ini opsional
  // — kalau gagal, aktivasi tetap lanjut (foto bisa dilengkapi belakangan).
  let avatarUrl = null;
  if (photo && typeof photo !== "string" && photo.size > 0) {
    const ext = photo.name?.split(".").pop() || "jpg";
    const path = `${tokenRow.member_id}-${Date.now()}.${ext}`;
    const arrayBuffer = await photo.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("member-photos")
      .upload(path, arrayBuffer, { contentType: photo.type, upsert: false });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("member-photos")
        .getPublicUrl(path);
      avatarUrl = publicUrlData.publicUrl;
    }
  }

  const { error: markUsedError } = await supabase
    .from("activation_tokens")
    .update({ used: true, used_at: new Date().toISOString() })
    .eq("token", token);

  if (markUsedError) {
    return { error: `Gagal menyelesaikan aktivasi: ${markUsedError.message}` };
  }

  // Sekalian aktifkan status member dari "trial" jadi "aktif", + simpan foto kalau ada.
  await supabase
    .from("members")
    .update({ status: "aktif", ...(avatarUrl ? { avatar_url: avatarUrl } : {}) })
    .eq("id", tokenRow.member_id);

  return {
    success: true,
    email: tokenRow.members?.email,
    name: tokenRow.members?.full_name,
    division: tokenRow.members?.division,
    avatarUrl,
  };
}
