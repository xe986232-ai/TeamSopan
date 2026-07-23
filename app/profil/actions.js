"use server";

import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";

// Ambil data profil member yang lagi login sekarang. Dipanggil dari
// Server Component (app/profil/page.js) buat isi data awal halaman.
// Pakai createServerSupabaseClient (baca sesi dari cookie) supaya cuma
// bisa ambil data member itu sendiri — bukan bisa comot ID sembarangan.
export async function getOwnProfile() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Kamu belum masuk." };
  }

  const { data, error } = await supabase
    .from("members")
    .select(
      "id, full_name, email, division, role, status, avatar_url, bio, instagram_url, tiktok_url, youtube_url"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return { error: "Profil tidak ditemukan." };
  }

  return { data };
}

// Update profil sendiri (nama, bio, sosmed) + opsional ganti foto avatar.
// `formData` berisi: full_name, bio, instagram_url, tiktok_url, youtube_url,
// dan file "avatar" (opsional).
//
// Alur keamanan: cek dulu SIAPA yang lagi login lewat cookie sesi
// (createServerSupabaseClient), baru pakai secret key (createAdminSupabaseClient)
// buat update baris `members` MILIK USER ITU SENDIRI (where id = user.id).
// Browser tidak pernah bisa update tabel members langsung.
export async function updateOwnProfile(formData) {
  const sessionClient = createServerSupabaseClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    return { error: "Sesi kamu sudah habis, silakan masuk lagi." };
  }

  const fullName = formData.get("full_name")?.toString().trim();
  const bio = formData.get("bio")?.toString().trim() ?? "";
  const instagramUrl = formData.get("instagram_url")?.toString().trim() ?? "";
  const tiktokUrl = formData.get("tiktok_url")?.toString().trim() ?? "";
  const youtubeUrl = formData.get("youtube_url")?.toString().trim() ?? "";
  const avatar = formData.get("avatar");

  if (!fullName) {
    return { error: "Nama tidak boleh kosong." };
  }

  const admin = createAdminSupabaseClient();

  const updatePayload = {
    full_name: fullName,
    bio,
    instagram_url: instagramUrl,
    tiktok_url: tiktokUrl,
    youtube_url: youtubeUrl,
  };

  // Kalau ada file avatar baru diunggah, upload dulu ke storage lalu
  // sertakan URL publiknya di payload update.
  if (avatar && typeof avatar !== "string" && avatar.size > 0) {
    const ext = avatar.name?.split(".").pop() || "jpg";
    const path = `${user.id}-${Date.now()}.${ext}`;
    const arrayBuffer = await avatar.arrayBuffer();

    const { error: uploadError } = await admin.storage
      .from("member-photos")
      .upload(path, arrayBuffer, { contentType: avatar.type, upsert: false });

    if (uploadError) {
      return { error: `Gagal unggah foto: ${uploadError.message}` };
    }

    const { data: publicUrlData } = admin.storage
      .from("member-photos")
      .getPublicUrl(path);
    updatePayload.avatar_url = publicUrlData.publicUrl;
  }

  const { data, error } = await admin
    .from("members")
    .update(updatePayload)
    .eq("id", user.id)
    .select(
      "id, full_name, email, division, role, status, avatar_url, bio, instagram_url, tiktok_url, youtube_url"
    )
    .maybeSingle();

  if (error || !data) {
    return { error: `Gagal menyimpan profil: ${error?.message || "unknown"}` };
  }

  return { success: true, data };
}
