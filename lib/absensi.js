// Helper untuk sesi absensi.
//
// Sesi absensi beneran (tanggal, jam mulai, durasi, siapa yang sudah
// absen) sekarang disimpan di Supabase (tabel `attendance_sessions` &
// `attendance_records` -- lihat supabase/migration_absensi.sql). File ini
// cuma isi konstanta tampilan (warna/nama divisi) + helper kecil yang
// dipakai di beberapa tempat (dashboard admin & halaman absensi member).
//
// room_id (kolom `room_id` di attendance_sessions) formatnya
// {divisi}-{token-acak}, misal remix-k3f9x2 -- dipakai sebagai bagian URL
// /absensi/{roomId}. Dibuat lewat generateRoomId() pas admin klik
// "Buat Sesi & Generate Link" di /dashboard/absensi.

export const DIVISIONS_ABSENSI = {
  remix: {
    id: "remix",
    name: "Remix",
    accentFrom: "#B026FF",
    accentTo: "#FF2E92",
  },
  creator: {
    id: "creator",
    name: "Creator",
    accentFrom: "#00E5FF",
    accentTo: "#3D5AFE",
  },
  leadis: {
    id: "leadis",
    name: "Leadis",
    accentFrom: "#FFD166",
    accentTo: "#FF6FB5",
  },
};

export function generateRoomId(divisionId) {
  const token =
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-4);
  return `${divisionId}-${token}`;
}

// Jam sesi (starts_at/ends_at) disimpan sebagai "jam dinding" (wall
// clock) apa adanya -- BUKAN 1 momen absolut yang sama buat semua orang.
// Lihat komentar di app/dashboard/absensi/actions.js buat detail cara
// simpannya. Fungsi ini baca balik komponen tanggal/jam itu lewat
// getUTC*() (bukan new Date(iso) biasa), lalu bikin ulang pakai
// constructor Date LOKAL -- otomatis kebaca sebagai jam itu di zona
// waktu device yang lagi jalanin kode ini. Hasilnya: admin set "07:00",
// siapa pun yang buka -- baik WIB, WITA, WIT, atau luar negeri -- bakal
// lihat sesi buka jam 07:00 di jam HP dia sendiri, gak ada yang
// "telat".
export function toLocalWallClock(iso) {
  const d = new Date(iso);
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds()
  );
}

// Status sesi absensi relatif terhadap waktu sekarang. Terima row dari
// Supabase (starts_at/ends_at, snake_case) atau shape camelCase.
export function getSessionStatus(session, now = Date.now()) {
  const startsAt = toLocalWallClock(session.starts_at ?? session.startsAt).getTime();
  const endsAt = toLocalWallClock(session.ends_at ?? session.endsAt).getTime();
  if (now < startsAt) return "akan-datang";
  if (now < endsAt) return "aktif";
  return "berakhir";
}

// Format sisa waktu (ms) jadi "HH:MM:SS", atau "MM:SS" kalau di bawah
// 1 jam -- dipakai buat hitungan mundur di halaman /absensi/[roomId].
export function formatCountdown(ms) {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

// Label relatif sederhana buat list "sudah absen" (mis. "5 menit lalu").
export function timeAgoLabel(iso, now = Date.now()) {
  const diffMs = now - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}
