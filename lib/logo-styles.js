// Preset warna + bentuk buat logo utama (components/ui/logo-mark.jsx),
// dipakai di navbar publik (components/ui/site-navbar.jsx) dan picker di
// dashboard (app/dashboard/pengaturan/LogoStylePicker.jsx). Plain JS, bisa
// dipakai dari komponen server maupun client.
//
// Ada 2 bentuk logo (LOGO_SHAPES di bawah):
// - "orb"       : blob bulat memutar + huruf "S" (desain lama/original)
// - "soundwave" : 2 garis gradient polos (desain baru)
// Warnanya (LOGO_STYLES) sama-sama dipakai buat kedua bentuk -- tiap
// style cuma butuh 2 warna hex (colors[0] -> colors[1]), dipakai sebagai
// gradient stroke SVG untuk soundwave (lihat LogoMark) atau diubah jadi
// radial-gradient CSS untuk orb lewat getOrbGradients() di bawah. Admin
// pilih bentuk + warna secara terpisah di dashboard, jadi totalnya
// 2 x 5 = 10 kombinasi tampilan logo.

export const LOGO_STYLES = {
  aurora: {
    id: "aurora",
    label: "Aurora",
    description: "Ungu ke cyan (default)",
    colors: ["#7C3AED", "#22D3EE"],
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    description: "Oranye ke ungu",
    colors: ["#F97316", "#7C3AED"],
  },
  ocean: {
    id: "ocean",
    label: "Ocean",
    description: "Biru ke teal",
    colors: ["#1D4ED8", "#14B8A6"],
  },
  forest: {
    id: "forest",
    label: "Forest",
    description: "Hijau tua ke teal",
    colors: ["#15803D", "#0D9488"],
  },
  flame: {
    id: "flame",
    label: "Flame",
    description: "Merah ke kuning",
    colors: ["#B91C1C", "#EAB308"],
  },
};

export const DEFAULT_LOGO_STYLE = "aurora";

export const LOGO_STYLE_LIST = Object.values(LOGO_STYLES);

export function getLogoStyle(id) {
  return LOGO_STYLES[id] || LOGO_STYLES[DEFAULT_LOGO_STYLE];
}

// Bentuk logo -- dikombinasikan dengan LOGO_STYLES (warna) di atas.
// "soundwave" tetap jadi default supaya tampilan situs yang sudah live
// tidak berubah kalau kolom logo_shape belum ke-set di database.
export const LOGO_SHAPES = {
  orb: {
    id: "orb",
    label: "Orb",
    description: "Blob bulat memutar + huruf \"S\" (desain original)",
  },
  soundwave: {
    id: "soundwave",
    label: "Soundwave",
    description: "Garis gradient polos (desain baru, default)",
  },
};

export const DEFAULT_LOGO_SHAPE = "soundwave";

export const LOGO_SHAPE_LIST = Object.values(LOGO_SHAPES);

export function getLogoShape(id) {
  return LOGO_SHAPES[id] || LOGO_SHAPES[DEFAULT_LOGO_SHAPE];
}

// Ubah pasangan warna hex (LOGO_STYLES[x].colors) jadi 2 layer
// radial-gradient CSS buat bentuk "orb" -- outer (layer blur/glow di
// belakang) dan inner (layer utama tempat huruf "S" duduk). Struktur
// & posisi highlight (circle at 30% 30%) sengaja disamain dengan desain
// orb original, cuma sekarang diturunkan otomatis dari 2 warna yang sama
// dipakai soundwave, supaya satu preset warna konsisten dipakai di kedua
// bentuk.
export function getOrbGradients(colors) {
  const [from, to] = colors;
  return {
    outer: `radial-gradient(circle at 30% 30%, ${from}, ${to} 100%)`,
    inner: `radial-gradient(circle at 30% 30%, ${from}, ${to} 100%)`,
  };
}
