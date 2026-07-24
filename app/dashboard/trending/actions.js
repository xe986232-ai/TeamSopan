"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

const MAX_SIZE = 100 * 1024 * 1024; // 100MB, samain sama file_size_limit bucket

export async function uploadTrendingVideo(formData) {
  const slot = Number(formData.get("slot"));
  const file = formData.get("file");

  if (!slot || !file || typeof file === "string" || file.size === 0) {
    return { error: "File video tidak ditemukan." };
  }

  if (!file.type?.startsWith("video/")) {
    return { error: "File harus berupa video (mp4, webm, mov, dll)." };
  }

  if (file.size > MAX_SIZE) {
    return { error: "Ukuran video maksimal 100MB." };
  }

  const supabase = createAdminSupabaseClient();

  const ext = file.name.split(".").pop() || "mp4";
  // nama file pakai timestamp supaya CDN cache selalu ambil versi terbaru
  const path = `slot-${slot}-${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("trending-videos")
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: `Gagal upload: ${uploadError.message}` };
  }

  const { data: publicUrlData } = supabase.storage
    .from("trending-videos")
    .getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("trending_works")
    .update({ video_url: publicUrlData.publicUrl, updated_at: new Date().toISOString() })
    .eq("slot", slot);

  if (updateError) {
    return { error: `Gagal simpan ke database: ${updateError.message}` };
  }

  // refresh dashboard & homepage biar video baru langsung kepakai
  revalidatePath("/dashboard/trending");
  revalidatePath("/");

  return { success: true, videoUrl: publicUrlData.publicUrl };
}

export async function removeTrendingVideo(slot) {
  if (!slot) return { error: "Slot tidak valid." };

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("trending_works")
    .update({ video_url: null, updated_at: new Date().toISOString() })
    .eq("slot", slot);

  if (error) {
    return { error: `Gagal hapus: ${error.message}` };
  }

  revalidatePath("/dashboard/trending");
  revalidatePath("/");

  return { success: true };
}
