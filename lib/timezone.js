// Helper timezone buat fitur absensi.
//
// Sesi absensi disimpan sebagai "jam dinding" (wall clock) apa adanya,
// bukan 1 momen absolut yang sama buat semua orang -- lihat komentar di
// app/dashboard/absensi/actions.js. Di browser, itu gampang: constructor
// `new Date(y, m, d, h, mi)` otomatis kebaca pakai timezone device yang
// lagi jalanin kode-nya (lihat lib/absensi.js -> toLocalWallClock).
//
// Tapi validasi "boleh absen atau enggak" itu final-nya dicek di SERVER
// (app/absensi/[roomId]/actions.js), dan server gak otomatis tau device
// pengunjung ada di zona waktu mana. Makanya browser kirim nama zona
// waktu IANA-nya sendiri (mis. "Asia/Makassar" buat WITA) lewat
// `Intl.DateTimeFormat().resolvedOptions().timeZone`, terus fungsi di
// bawah ini yang mengubah jam dinding sesi (mis. "07:00") jadi instant
// UTC yang tepat SESUAI zona waktu itu, biar bisa dibandingkan adil ke
// Date.now() di server.

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

// Ambil komponen wall-clock (Y/M/D/H/Mi/S) dari nilai ISO yang disimpan
// dengan trik "seolah-olah UTC" (lihat wibDateTime di
// app/dashboard/absensi/actions.js) -- pakai getUTC*() supaya gak
// kegeser timezone server pas dibaca balik.
export function wallClockComponentsFromIso(iso) {
  const d = new Date(iso);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
  };
}

// Timezone Indonesia yang valid buat dikirim dari client -- dipakai
// buat validasi/whitelist ringan di server (jaga-jaga kalau
// Intl.resolvedOptions() browser pengunjung ngasih nilai aneh/kosong).
export const FALLBACK_TIME_ZONE = "Asia/Jakarta";
