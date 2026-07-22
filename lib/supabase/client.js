import { createClient } from "@supabase/supabase-js";

// Client ini pakai "publishable key" — aman dipakai di sisi browser/publik.
// Cuma bisa baca data sesuai policy RLS yang diizinkan untuk publik.
// URL & key diambil dari environment variable, di-set di Vercel (Project Settings > Environment Variables)
// dan di file .env.local untuk development lokal.
export function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
