"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { LOGO_STYLES, LOGO_SHAPES } from "@/lib/logo-styles";

export async function updateLogoStyle(styleId, shapeId) {
  // Validasi ketat: cuma boleh salah satu key yang memang ada di preset,
  // biar nggak ada sembarang string kesimpen sebagai "logo_style" /
  // "logo_shape" di DB.
  if (!styleId || !LOGO_STYLES[styleId]) {
    return { error: "Warna logo tidak dikenali." };
  }
  if (!shapeId || !LOGO_SHAPES[shapeId]) {
    return { error: "Bentuk logo tidak dikenali." };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: 1,
        logo_style: styleId,
        logo_shape: shapeId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) {
    return { error: `Gagal simpan: ${error.message}` };
  }

  // Navbar publik ambil logo_style/logo_shape client-side tiap mount,
  // tapi tetap revalidate biar halaman dashboard & homepage nggak
  // nyimpen cache lama.
  revalidatePath("/dashboard/pengaturan");
  revalidatePath("/");

  return { success: true };
}

export async function updateAnnouncementBanner({ enabled, text, link }) {
  // Kalau banner mau diaktifkan, teksnya wajib diisi -- daripada nyala
  // tapi kosong tanpa disadari admin.
  const trimmedText = (text || "").trim();
  if (enabled && !trimmedText) {
    return { error: "Isi teks pengumuman dulu sebelum mengaktifkan banner." };
  }

  const trimmedLink = (link || "").trim();

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: 1,
        banner_enabled: !!enabled,
        banner_text: trimmedText,
        banner_link: trimmedLink || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) {
    return { error: `Gagal simpan: ${error.message}` };
  }

  revalidatePath("/dashboard/pengaturan");
  revalidatePath("/");

  return { success: true };
}
