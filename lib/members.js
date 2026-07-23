import { randomBytes } from "crypto";

// Ubah nama lengkap jadi bagian depan email: huruf kecil, tanpa spasi/simbol.
// "Reno Setiawan" -> "renosetiawan"
function slugifyName(fullName) {
  return fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // buang aksen
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 24) || "member";
}

// Format email member: <namadepan> + "sopan" + @teamsopan.com
// Contoh: "Reno" -> renosopan@teamsopan.com
// `suffix` dipakai kalau email sudah kepakai (jadi reno2sopan@teamsopan.com, dst).
export function generateMemberEmail(fullName, suffix = 0) {
  const firstName = fullName.trim().split(/\s+/)[0] || "member";
  const base = slugifyName(firstName);
  const withSuffix = suffix > 0 ? `${base}${suffix + 1}` : base;
  return `${withSuffix}sopan@teamsopan.com`;
}

// Password acak buat akun baru — dikasih ke pendaftar lewat WA oleh admin,
// nanti diganti sendiri oleh pendaftar lewat link aktivasi.
export function generateRandomPassword(length = 10) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[bytes[i] % chars.length];
  }
  return out;
}

// Token buat link aktivasi (/masuk?token=...) — panjang & acak biar gak
// bisa ditebak.
export function generateActivationToken() {
  return randomBytes(24).toString("hex");
}
