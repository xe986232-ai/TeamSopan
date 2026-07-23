"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import {
  generateMemberEmail,
  generateRandomPassword,
  generateActivationToken,
  withSopanSuffix,
} from "@/lib/members";

// Sama seperti di app/dashboard/pendaftar/actions.js — dipisah di sini
// (bukan diimpor) karena "next/headers" cuma boleh dipakai di file yang
// jalan di server, dan supaya bulk-actions ini tetap berdiri sendiri.
function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  const h = headers();
  const host = h.get("host");
  if (!host) return "";
  const proto = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

const DIVISION_ROLE_LABEL = {
  remix: "Member Remix",
  creator: "Member Creator",
  leadis: "Member Leadis",
};

const VALID_DIVISIONS = Object.keys(DIVISION_ROLE_LABEL);

// Buat 1 akun member langsung (tanpa baris `registrants`). Dipakai buat
// nge-input member yang udah gabung dari sebelum sistem ini dibuat --
// jadi gak ada data pendaftaran WA/alasan/dll, cuma nama + divisi.
async function createOneMember(supabase, { name, division }) {
  const cleanName = (name || "").trim();
  if (!cleanName) return { error: "Nama kosong dilewati." };
  if (!VALID_DIVISIONS.includes(division)) {
    return { error: `"${cleanName}": divisi "${division}" tidak valid.`, name: cleanName };
  }

  const memberFullName = withSopanSuffix(cleanName);

  // Cari email yang belum kepakai (nama depan bisa sama di antara 37 orang ini).
  let email = generateMemberEmail(cleanName);
  for (let attempt = 0; attempt < 30; attempt++) {
    const { data: existing } = await supabase
      .from("members")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (!existing) break;
    email = generateMemberEmail(cleanName, attempt + 1);
  }

  const password = generateRandomPassword();

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser?.user) {
    return { error: `"${cleanName}": gagal buat akun (${authError?.message}).`, name: cleanName };
  }

  const { error: memberError } = await supabase.from("members").insert({
    id: authUser.user.id,
    full_name: memberFullName,
    email,
    division,
    role: DIVISION_ROLE_LABEL[division] || "Member",
    status: "trial",
    registrant_id: null,
  });

  if (memberError) {
    await supabase.auth.admin.deleteUser(authUser.user.id);
    return { error: `"${cleanName}": gagal simpan data member (${memberError.message}).`, name: cleanName };
  }

  const token = generateActivationToken();
  const { error: tokenError } = await supabase
    .from("activation_tokens")
    .insert({ token, member_id: authUser.user.id });

  if (tokenError) {
    return { error: `"${cleanName}": akun terbuat tapi gagal buat link aktivasi (${tokenError.message}).`, name: cleanName };
  }

  return {
    success: true,
    name: memberFullName,
    email,
    password,
    division,
    activationLink: `${getSiteUrl()}/masuk?token=${token}`,
  };
}

// entries: [{ name: string, division: 'remix' | 'creator' | 'leadis' }, ...]
// Diproses satu-satu (bukan Promise.all) biar aman kalau ada nama dobel di
// list yang sama -- cek "email sudah kepakai" di atas jadi selalu akurat.
export async function bulkCreateMembers(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return { results: [], errors: ["Tidak ada nama yang dikirim."] };
  }
  if (entries.length > 100) {
    return { results: [], errors: ["Maksimal 100 nama per proses, biar aman."] };
  }

  const supabase = createAdminSupabaseClient();
  const results = [];
  const errors = [];

  for (const entry of entries) {
    const outcome = await createOneMember(supabase, entry);
    if (outcome.success) {
      results.push(outcome);
    } else {
      errors.push(outcome.error);
    }
  }

  revalidatePath("/dashboard/anggota");

  return { results, errors };
}
