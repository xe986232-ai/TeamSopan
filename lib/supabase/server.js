import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client ini pakai "publishable key" TAPI baca sesi login dari cookie
// (lewat next/headers). Dipakai di Server Component / Server Action buat
// tahu "siapa yang lagi login sekarang" (mis. cek akses dashboard, ambil
// profil member yang login). TIDAK bypass RLS.
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component (bukan Action/Route Handler) —
            // boleh diabaikan karena middleware yang akan refresh sesi.
          }
        },
      },
    }
  );
}

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
