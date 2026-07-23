"use client";

import { createBrowserClient } from "@supabase/ssr";

// Client ini pakai "publishable key" — aman dipakai di sisi browser/publik.
// Cuma bisa baca/tulis data sesuai policy RLS yang diizinkan untuk publik.
// Pakai createBrowserClient (bukan createClient biasa) supaya sesi login
// disimpan di COOKIE, bukan cuma localStorage — ini penting supaya
// middleware.js & Server Component bisa tahu status login user.
export function createPublicSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
