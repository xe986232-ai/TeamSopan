// Preset warna gradient buat logo orb "S" di navbar (components/ui/site-navbar.jsx).
// Dipakai di DUA tempat: navbar publik (buat nge-render warna yang lagi
// aktif) dan picker di dashboard (app/dashboard/pengaturan) buat preview +
// pilihan admin. File ini SENGAJA plain JS tanpa "server-only" / "use
// client" biar bisa di-import dari komponen server maupun client.
//
// Tiap preset punya 2 layer gradient (sama seperti struktur asli logo):
// - outer: layer blur di belakang (glow), sedikit lebih "pekat"
// - inner: layer utama tempat huruf "S" duduk
// Urutan warna & posisi (circle at 30% 30%, ...) dipertahankan sama supaya
// bentuk highlight-nya konsisten, cuma warnanya yang beda per preset.

export const LOGO_STYLES = {
  aurora: {
    id: "aurora",
    label: "Aurora",
    description: "Ungu - pink - cyan (default)",
    outer: "radial-gradient(circle at 30% 30%, #7C3AED, #EC4899 45%, #22D3EE 100%)",
    inner: "radial-gradient(circle at 30% 30%, #A855F7, #F472B6 50%, #38BDF8 100%)",
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    description: "Oranye - pink - ungu",
    outer: "radial-gradient(circle at 30% 30%, #F97316, #EC4899 45%, #7C3AED 100%)",
    inner: "radial-gradient(circle at 30% 30%, #FB923C, #F472B6 50%, #A78BFA 100%)",
  },
  ocean: {
    id: "ocean",
    label: "Ocean",
    description: "Biru - cyan - teal",
    outer: "radial-gradient(circle at 30% 30%, #1D4ED8, #0EA5E9 45%, #14B8A6 100%)",
    inner: "radial-gradient(circle at 30% 30%, #3B82F6, #38BDF8 50%, #2DD4BF 100%)",
  },
  forest: {
    id: "forest",
    label: "Forest",
    description: "Hijau tua - lime - teal",
    outer: "radial-gradient(circle at 30% 30%, #15803D, #84CC16 45%, #0D9488 100%)",
    inner: "radial-gradient(circle at 30% 30%, #22C55E, #A3E635 50%, #2DD4BF 100%)",
  },
  flame: {
    id: "flame",
    label: "Flame",
    description: "Merah - oranye - kuning",
    outer: "radial-gradient(circle at 30% 30%, #B91C1C, #EA580C 45%, #EAB308 100%)",
    inner: "radial-gradient(circle at 30% 30%, #EF4444, #F97316 50%, #FACC15 100%)",
  },
};

export const DEFAULT_LOGO_STYLE = "aurora";

export const LOGO_STYLE_LIST = Object.values(LOGO_STYLES);

export function getLogoStyle(id) {
  return LOGO_STYLES[id] || LOGO_STYLES[DEFAULT_LOGO_STYLE];
}
