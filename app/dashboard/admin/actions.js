"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export async function uploadAdminPhoto(formData) {
  const slug = formData.get("slug");
  const file = formData.get("file");

  if (!slug || !file || typeof file === "string" || file.size === 0) {
    return { error: "File foto tidak ditemukan." };
  }

  if (!file.type?.startsWith("image/")) {
    return { error: "File harus berupa gambar (jpg, png, webp, dll)." };
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return { error: "Ukuran file maksimal 5MB." };
  }

  const supabase = createAdminSupabaseClient();

  const ext = file.name.split(".").pop() || "jpg";
  // nama file pakai timestamp supaya browser/CDN cache selalu ambil versi terbaru
  const path = `${slug}-${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("admin-photos")
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: `Gagal upload: ${uploadError.message}` };
  }

  const { data: publicUrlData } = supabase.storage
    .from("admin-photos")
    .getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("division_admins")
    .update({ image_url: publicUrlData.publicUrl, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (updateError) {
    return { error: `Gagal simpan ke database: ${updateError.message}` };
  }

  // refresh dashboard admin & halaman publik biar foto baru langsung kelihatan
  revalidatePath("/dashboard/admin");
  revalidatePath("/");

  return { success: true, imageUrl: publicUrlData.publicUrl };
}

export async function updateAdminInfo(formData) {
  const slug = formData.get("slug");
  const name = formData.get("name")?.toString().trim();
  const role = formData.get("role")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!slug || !name || !role) {
    return { error: "Nama dan nama divisi tidak boleh kosong." };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("division_admins")
    .update({
      name,
      role,
      description: description ?? "",
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) {
    return { error: `Gagal simpan: ${error.message}` };
  }

  revalidatePath("/dashboard/admin");
  revalidatePath("/");

  return { success: true };
}
