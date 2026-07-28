"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { LOGO_STYLES, LOGO_SHAPES } from "@/lib/logo-styles";
import { HERO_TEXT_EFFECTS } from "@/lib/hero-text-effects";
import { getCurrentDashboardRole } from "@/lib/dashboard-role-server";

// Pengaturan situs cuma boleh diubah Master Admin -- admin divisi cuma
// boleh LIHAT (halaman /dashboard/pengaturan dikunci pakai ReadOnlyOverlay
// di UI), tapi tetap dijaga lagi di sini di server biar gak bisa dipanggil
// langsung dari luar UI.
async function assertMasterAdmin() {
  const role = await getCurrentDashboardRole();
  if (role?.type !== "master") {
    return { error: "Cuma Master Admin yang bisa mengubah pengaturan situs." };
  }
  return null;
}

export async function updateLogoStyle(styleId, shapeId) {
  const guardError = await assertMasterAdmin();
  if (guardError) return guardError;

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
  const guardError = await assertMasterAdmin();
  if (guardError) return guardError;

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

export async function updateOpenMember(enabled) {
  const guardError = await assertMasterAdmin();
  if (guardError) return guardError;

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: 1,
        open_member: !!enabled,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) {
    return { error: `Gagal simpan: ${error.message}` };
  }

  // Tombol "Gabung" di navbar & footer (semua halaman publik) ambil
  // open_member client-side tiap mount, tapi tetap revalidate biar
  // halaman dashboard & homepage nggak nyimpan cache lama.
  revalidatePath("/dashboard/pengaturan");
  revalidatePath("/");

  return { success: true };
}

export async function updateHeroTextEffect(effectId) {
  const guardError = await assertMasterAdmin();
  if (guardError) return guardError;

  // Validasi ketat: cuma boleh salah satu key yang memang ada di preset
  // (lihat lib/hero-text-effects.js), biar nggak ada sembarang string
  // kesimpen sebagai "hero_text_effect" di DB.
  if (!effectId || !HERO_TEXT_EFFECTS[effectId]) {
    return { error: "Effect teks Hero tidak dikenali." };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: 1,
        hero_text_effect: effectId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) {
    return { error: `Gagal simpan: ${error.message}` };
  }

  // Hero di homepage & /preview-hero ambil hero_text_effect client-side
  // tiap mount, tapi tetap revalidate biar halaman dashboard & homepage
  // nggak nyimpan cache lama.
  revalidatePath("/dashboard/pengaturan");
  revalidatePath("/");
  revalidatePath("/preview-hero");

  return { success: true };
}
