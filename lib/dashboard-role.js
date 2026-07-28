// Resolusi role dashboard berdasarkan email yang login.
//
// - "master": akun admints@teamsopan.com (env ADMIN_EMAIL) -- akses penuh
//   ke semua /dashboard/*, termasuk pengaturan situs & akun.
// - "division": akun admin divisi (mis. rizzsopan@teamsopan.com untuk
//   Divisi Remix) -- akses TERBATAS, cuma ke sub-halaman yang relevan
//   buat divisinya sendiri.
//
// File ini SENGAJA tidak import "server-only" -- dipakai juga dari
// middleware.js (Edge runtime), bukan cuma dari Server Component.

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Tambah baris baru di sini kalau mau bikin dashboard admin utk divisi
// lain (creator/leadis) -- tinggal isi env var-nya, kode lain di bawah
// (middleware, sidebar, dst) otomatis ngikutin karena semua baca dari
// mapping ini.
const DIVISION_ADMIN_EMAILS = {
  remix: process.env.DIVISION_ADMIN_EMAIL_REMIX,
  creator: process.env.DIVISION_ADMIN_EMAIL_CREATOR,
  leadis: process.env.DIVISION_ADMIN_EMAIL_LEADIS,
};

// Prefix path /dashboard/* yang boleh diakses admin divisi. Path yang
// gak match salah satu prefix ini bakal di-redirect balik ke /dashboard.
export const DIVISION_ALLOWED_PATH_PREFIXES = [
  "/dashboard",
  "/dashboard/anggota",
  "/dashboard/pendaftar",
  "/dashboard/absensi",
  "/dashboard/trending-sound",
  "/dashboard/admin",
  "/dashboard/pengaturan",
  "/dashboard/bantuan",
];

// Sub-path yang secara eksplisit DIBLOKIR buat admin divisi walau ada di
// bawah prefix yang diizinkan di atas (mis. /dashboard/anggota diizinkan,
// tapi /dashboard/anggota/tambah-massal khusus master admin).
export const DIVISION_BLOCKED_PATHS = ["/dashboard/anggota/tambah-massal"];

export function resolveDashboardRole(email) {
  if (!email) return null;
  const lower = email.toLowerCase();

  if (ADMIN_EMAIL && lower === ADMIN_EMAIL.toLowerCase()) {
    return { type: "master", division: null };
  }

  for (const [division, divisionEmail] of Object.entries(
    DIVISION_ADMIN_EMAILS
  )) {
    if (divisionEmail && lower === divisionEmail.toLowerCase()) {
      return { type: "division", division };
    }
  }

  return null;
}

export function isDivisionPathAllowed(pathname) {
  const isBlocked = DIVISION_BLOCKED_PATHS.some(
    (blocked) => pathname === blocked || pathname.startsWith(`${blocked}/`)
  );
  if (isBlocked) return false;

  return DIVISION_ALLOWED_PATH_PREFIXES.some(
    (prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
