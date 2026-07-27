// Helper timezone buat fitur absensi.
//
// Sesi absensi HARUS mulai & berakhir di 1 MOMEN ABSOLUT yang SAMA buat
// SEMUA orang, di zona waktu manapun mereka berada -- kalau admin bikin
// sesi jam 07:00, maka jam 07:00 itu dikunci sebagai WIB
// (SESSION_TIME_ZONE di bawah), dan semua anggota (WIB/WITA/WIT/luar
// negeri sekalipun) absennya kebuka di momen nyata yang PERSIS sama,
// bukan ditafsir ulang jadi "07:00 versi jam HP masing-masing" (itu
// bikin orang di zona beda mulai di momen berbeda -- ada yang nunggu,
// ada yang udah jalan duluan, padahal harusnya bareng).
//
// Alurnya:
// 1. Admin ngetik jam di form /dashboard/absensi (mis. "07:00").
// 2. zonedWallClockToUtcMs() di bawah ini ubah "07:00" tsb JADI instant
//    UTC yang tepat, dengan asumsi jam itu adalah jam SESSION_TIME_ZONE
//    (WIB) -- disimpan ke DB sebagai instant absolut (timestamptz).
// 3. Semua pengecekan "sudah mulai/sudah selesai" (baik di halaman
//    member app/absensi/[roomId]/actions.js, maupun status di dashboard
//    lib/absensi.js -> getSessionStatus) tinggal bandingin instant itu
//    langsung ke Date.now() -- TANPA reinterpretasi apapun berdasarkan
//    timezone device pengunjung. Instant absolut = sama buat semua
//    orang, itu intinya.

// y, mo, d, h, mi, s: komponen wall-clock (mo 0-indexed, ikutan konvensi
// Date.UTC). timeZone: nama IANA, mis. "Asia/Jakarta", "Asia/Makassar",
// "Asia/Jayapura". Return: epoch ms instant yang sesuai.
//
// Algoritma "guess & correct": karena zona waktu Indonesia semuanya
// fixed-offset (gak ada DST), 1 kali koreksi udah selalu presisi --
// gak perlu loop.
export function zonedWallClockToUtcMs(y, mo, d, h, mi, s, timeZone) {
  const guessMs = Date.UTC(y, mo, d, h, mi, s ?? 0);

  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = {};
  for (const p of dtf.formatToParts(new Date(guessMs))) {
    if (p.type !== "literal") parts[p.type] = p.value;
  }

  // Jam "24" muncul dari beberapa implementasi ICU buat tengah malam --
  // normalisasi ke 0 biar Date.UTC gak salah baca.
  const hour = parts.hour === "24" ? 0 : Number(parts.hour);

  const asIfUtcMs = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    Number(parts.minute),
    Number(parts.second)
  );

  // Selisih antara "guess dibaca ulang di timeZone target" vs guess
  // aslinya = besar offset yang perlu dikoreksi.
  const diff = asIfUtcMs - guessMs;
  return guessMs - diff;
}

// Zona waktu acuan TETAP buat semua sesi absensi -- jam yang diketik
// admin di form selalu dianggap WIB, gak peduli admin/anggota lagi
// fisik di zona mana. Ini yang bikin sesi mulai "bareng" buat semua
// orang (lihat komentar panjang di atas).
export const SESSION_TIME_ZONE = "Asia/Jakarta";

// Alias lama, dipertahankan kalau masih ada kode lain yang mengimpor
// nama ini.
export const FALLBACK_TIME_ZONE = SESSION_TIME_ZONE;

// Ambil komponen tanggal/jam SEKARANG di sebuah timeZone (bukan di zona
// device/browser yang jalanin kode ini). Dipakai buat ngisi default
// "tanggal" & "jam mulai" di form Buat Sesi Absensi -- kalau defaultnya
// diambil dari jam device (mis. `new Date().getHours()`), hasilnya
// gampang meleset dari WIB tiap kali device gak persis di WIB (device
// clock drift/salah setting timezone) -- padahal form bilang jamnya
// "patokan WIB" & backend memang selalu MENGUNCI input sebagai WIB
// (lihat wallClockDateTime di app/dashboard/absensi/actions.js). Kalau
// defaultnya ternyata beberapa menit di belakang WIB asli, sesi yang
// dibuat pakai default itu jadi mulai beberapa menit LEBIH LAMBAT dari
// yang dimaksud admin (baru "sekarang" versi device, bukan WIB) --
// itu penyebab laporan "buat sesi buat mulai sekarang, malah nunggu
// belasan menit baru kebuka".
export function nowInZoneParts(timeZone = SESSION_TIME_ZONE) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const parts = {};
  for (const p of dtf.formatToParts(new Date())) {
    if (p.type !== "literal") parts[p.type] = p.value;
  }

  return {
    year: Number(parts.year),
    month: Number(parts.month), // 1-indexed
    day: Number(parts.day),
    hour: parts.hour === "24" ? 0 : Number(parts.hour),
    minute: Number(parts.minute),
  };
}
