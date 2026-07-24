"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { LOGO_STYLES } from "@/lib/logo-styles";

export async function updateLogoStyle(styleId) {
  // Validasi ketat: cuma boleh salah satu key yang memang ada di preset,
  // biar nggak ada sembarang string kesimpen sebagai "logo_style" di DB.
  if (!styleId || !LOGO_STYLES[styleId]) {
    return { error: "Style logo tidak dikenali." };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { id: 1, logo_style: styleId, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );

  if (error) {
    return { error: `Gagal simpan: ${error.message}` };
  }

  // Navbar publik ambil logo_style client-side tiap mount, tapi tetap
  // revalidate biar halaman dashboard & homepage nggak nyimpen cache lama.
  revalidatePath("/dashboard/pengaturan");
  revalidatePath("/");

  return { success: true };
}
