"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/server";

const VALID_DIVISIONS = ["remix", "creator", "leadis"];

export async function submitRegistrant(payload) {
  const fullName = payload.fullName?.trim();
  const age = Number(payload.age);
  const domicile = payload.domicile?.trim();
  const whatsapp = payload.whatsapp?.trim();
  const division = payload.division;
  const experience = payload.experience?.trim() || "";
  const portfolio = payload.portfolio?.trim() || "";
  const reason = payload.reason?.trim() || "";

  if (!fullName || !domicile || !whatsapp) {
    return { error: "Data belum lengkap, coba cek lagi formnya." };
  }
  if (!Number.isInteger(age) || age < 10 || age > 100) {
    return { error: "Umur tidak valid." };
  }
  if (!VALID_DIVISIONS.includes(division)) {
    return { error: "Divisi tidak valid." };
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase.from("registrants").insert({
    full_name: fullName,
    age,
    domicile,
    whatsapp,
    division,
    experience,
    portfolio,
    reason,
    status: "menunggu",
  });

  if (error) {
    return { error: `Gagal mengirim pendaftaran: ${error.message}` };
  }

  return { success: true };
}
