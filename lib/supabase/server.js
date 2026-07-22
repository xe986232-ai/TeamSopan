import "server-only";
import { createClient } from "@supabase/supabase-js";

// PENTING: file ini cuma boleh diimport dari Server Component / Server Action /
// Route Handler. Paket "server-only" bakal bikin build ERROR kalau ada
// client component yang nyoba import ini secara tidak sengaja — jadi
// SUPABASE_SECRET_KEY nggak akan pernah ke-bundle ke kode yang dikirim ke browser.
//
// Secret key ini punya akses penuh (bypass RLS), jadi dipakai buat operasi
// admin: upload foto & update data admin divisi dari dashboard.
export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { auth: { persistSession: false } }
  );
}
