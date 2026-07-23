"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import {
  generateMemberEmail,
  generateRandomPassword,
  generateActivationToken,
} from "@/lib/members";

const DIVISION_ROLE_LABEL = {
  remix: "Member Remix",
  creator: "Member Creator",
  leadis: "Member Leadis",
};

export async function rejectRegistrant(id) {
  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("registrants")
    .update({ status: "ditolak" })
    .eq("id", id);

  if (error) {
    return { error: `Gagal menolak pendaftar: ${error.message}` };
  }

  revalidatePath("/dashboard/pendaftar");
  return { success: true };
}

// Terima pendaftar: bikin akun login (Supabase Auth) + baris member +
// link aktivasi sekali pakai. Mengembalikan email, password sementara,
// dan link aktivasi supaya admin bisa salin & kirim manual ke pendaftar
// (lewat WA nomor yang dia isi waktu daftar).
export async function acceptRegistrant(id) {
  const supabase = createAdminSupabaseClient();

  const { data: registrant, error: fetchError } = await supabase
    .from("registrants")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !registrant) {
    return { error: "Data pendaftar tidak ditemukan." };
  }

  if (registrant.status === "diterima") {
    return { error: "Pendaftar ini sudah diterima sebelumnya." };
  }

  // Cari email yang belum kepakai (jaga-jaga ada nama depan yang sama).
  let email = generateMemberEmail(registrant.full_name);
  for (let attempt = 0; attempt < 20; attempt++) {
    const { data: existing } = await supabase
      .from("members")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (!existing) break;
    email = generateMemberEmail(registrant.full_name, attempt + 1);
  }

  const password = generateRandomPassword();

  // 1. Buat akun login lewat Supabase Auth (email cuma dipakai sebagai
  // format login internal, bukan email sungguhan — jadi email_confirm
  // langsung true, tidak butuh kirim email verifikasi beneran).
  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError || !authUser?.user) {
    return { error: `Gagal membuat akun: ${authError?.message}` };
  }

  // 2. Simpan profil member.
  const { error: memberError } = await supabase.from("members").insert({
    id: authUser.user.id,
    full_name: registrant.full_name,
    email,
    division: registrant.division,
    role: DIVISION_ROLE_LABEL[registrant.division] || "Member",
    status: "trial",
    registrant_id: registrant.id,
  });

  if (memberError) {
    // rollback akun auth kalau gagal simpan profil, biar gak nyangkut
    await supabase.auth.admin.deleteUser(authUser.user.id);
    return { error: `Gagal menyimpan data member: ${memberError.message}` };
  }

  // 3. Buat token aktivasi (link acak, sekali pakai).
  const token = generateActivationToken();
  const { error: tokenError } = await supabase
    .from("activation_tokens")
    .insert({ token, member_id: authUser.user.id });

  if (tokenError) {
    return { error: `Gagal membuat link aktivasi: ${tokenError.message}` };
  }

  // 4. Update status pendaftar.
  const { error: updateError } = await supabase
    .from("registrants")
    .update({ status: "diterima", member_id: authUser.user.id })
    .eq("id", id);

  if (updateError) {
    return { error: `Gagal update status pendaftar: ${updateError.message}` };
  }

  revalidatePath("/dashboard/pendaftar");
  revalidatePath("/dashboard/anggota");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const activationLink = `${siteUrl}/masuk?token=${token}`;

  return {
    success: true,
    credentials: {
      name: registrant.full_name,
      whatsapp: registrant.whatsapp,
      email,
      password,
      activationLink,
    },
  };
}
