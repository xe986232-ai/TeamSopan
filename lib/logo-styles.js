// Preset warna buat logo utama (components/ui/logo-mark.jsx), dipakai di
// navbar publik (components/ui/site-navbar.jsx) dan picker di dashboard
// (app/dashboard/pengaturan/LogoStylePicker.jsx). Plain JS, bisa dipakai
// dari komponen server maupun client.
//
// Dulu logo-nya orb/blob + huruf "S" dengan CSS radial-gradient sebagai
// background. Sekarang diganti jadi SVG garis polos (soundwave), jadi
// tiap style cuma butuh 2 warna hex buat jadi gradient stroke SVG
// (<linearGradient> dari colors[0] ke colors[1]) -- lihat LogoMark.

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
