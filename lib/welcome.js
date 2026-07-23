// Key sessionStorage buat oper nama user yang baru aja login,
// dari halaman /masuk ke animasi welcome di beranda.
// Perumpamaan sementara sebelum ada auth beneran (Firebase/API).
export const WELCOME_NAME_KEY = "sopan_welcome_name";

// Key sessionStorage buat oper data lengkap pendaftar yang baru aja
// aktivasi akun (nama, divisi, foto profil), dari form aktivasi
// (/masuk?token=xxx) ke animasi welcome di /preview-welcome.
export const WELCOME_DATA_KEY = "sopan_welcome_data";

// Simpan data welcome sebelum redirect ke /preview-welcome.
export function setWelcomeData({ name, division, avatarUrl }) {
  try {
    sessionStorage.setItem(
      WELCOME_DATA_KEY,
      JSON.stringify({ name, division, avatarUrl })
    );
  } catch {
    // sessionStorage gak tersedia — gapapa, halaman welcome pakai fallback default.
  }
}

// Ambil (sekali pakai) data welcome yang barusan disimpan. Langsung dihapus
// biar refresh manual di /preview-welcome tidak muter ulang data lama.
export function popWelcomeData() {
  try {
    const raw = sessionStorage.getItem(WELCOME_DATA_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(WELCOME_DATA_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
