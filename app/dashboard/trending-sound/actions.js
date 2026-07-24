"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

const MAX_COVER_SIZE = 10 * 1024 * 1024; // 10MB, samain sama file_size_limit bucket cover
const MAX_AUDIO_SIZE = 30 * 1024 * 1024; // 30MB, samain sama file_size_limit bucket audio

export async function uploadSoundCover(formData) {
  const slot = Number(formData.get("slot"));
  const file = formData.get("file");

  if (!slot || !file || typeof file === "string" || file.size === 0) {
    return { error: "File gambar tidak ditemukan." };
  }
  if (!file.type?.startsWith("image/")) {
    return { error: "File harus berupa gambar (jpg, png, webp, dll)." };
  }
  if (file.size > MAX_COVER_SIZE) {
    return { error: "Ukuran gambar maksimal 10MB." };
  }

  const supabase = createAdminSupabaseClient();

  const ext = file.name.split(".").pop() || "jpg";
  // nama file pakai timestamp supaya CDN cache selalu ambil versi terbaru
  const path = `slot-${slot}-${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("trending-sound-covers")
    .upload(path, arrayBuffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { error: `Gagal upload: ${uploadError.message}` };
  }

  const { data: publicUrlData } = supabase.storage
    .from("trending-sound-covers")
    .getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("trending_sounds")
    .update({ cover_url: publicUrlData.publicUrl, updated_at: new Date().toISOString() })
    .eq("slot", slot);

  if (updateError) {
    return { error: `Gagal simpan ke database: ${updateError.message}` };
  }

  revalidatePath("/dashboard/trending-sound");
  revalidatePath("/");

  return { success: true, coverUrl: publicUrlData.publicUrl };
}

export async function uploadSoundAudio(formData) {
  const slot = Number(formData.get("slot"));
  const file = formData.get("file");

  if (!slot || !file || typeof file === "string" || file.size === 0) {
    return { error: "File audio tidak ditemukan." };
  }
  if (!file.type?.startsWith("audio/")) {
    return { error: "File harus berupa audio (mp3, wav, m4a, dll)." };
  }
  if (file.size > MAX_AUDIO_SIZE) {
    return { error: "Ukuran audio maksimal 30MB." };
  }

  const supabase = createAdminSupabaseClient();

  const ext = file.name.split(".").pop() || "mp3";
  const path = `slot-${slot}-${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("trending-sound-audio")
    .upload(path, arrayBuffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { error: `Gagal upload: ${uploadError.message}` };
  }

  const { data: publicUrlData } = supabase.storage
    .from("trending-sound-audio")
    .getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("trending_sounds")
    .update({ audio_url: publicUrlData.publicUrl, updated_at: new Date().toISOString() })
    .eq("slot", slot);

  if (updateError) {
    return { error: `Gagal simpan ke database: ${updateError.message}` };
  }

  revalidatePath("/dashboard/trending-sound");
  revalidatePath("/");

  return { success: true, audioUrl: publicUrlData.publicUrl };
}

export async function updateSoundInfo(formData) {
  const slot = Number(formData.get("slot"));
  const title = formData.get("title")?.toString().trim();
  const creator = formData.get("creator")?.toString().trim();

  if (!slot || !title) {
    return { error: "Judul (text atas) tidak boleh kosong." };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("trending_sounds")
    .update({
      title,
      creator: creator ?? "",
      updated_at: new Date().toISOString(),
    })
    .eq("slot", slot);

  if (error) {
    return { error: `Gagal simpan: ${error.message}` };
  }

  revalidatePath("/dashboard/trending-sound");
  revalidatePath("/");

  return { success: true };
}

export async function removeSoundCover(slot) {
  if (!slot) return { error: "Slot tidak valid." };

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("trending_sounds")
    .update({ cover_url: null, updated_at: new Date().toISOString() })
    .eq("slot", slot);

  if (error) return { error: `Gagal hapus: ${error.message}` };

  revalidatePath("/dashboard/trending-sound");
  revalidatePath("/");

  return { success: true };
}

export async function removeSoundAudio(slot) {
  if (!slot) return { error: "Slot tidak valid." };

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("trending_sounds")
    .update({ audio_url: null, updated_at: new Date().toISOString() })
    .eq("slot", slot);

  if (error) return { error: `Gagal hapus: ${error.message}` };

  revalidatePath("/dashboard/trending-sound");
  revalidatePath("/");

  return { success: true };
}
