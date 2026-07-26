// Preset effect animasi untuk teks nama "SOPAN TEAM" di Hero homepage
// (components/ui/portfolio-hero.jsx), dipakai juga di picker dashboard
// (app/dashboard/pengaturan/HeroTextEffectPicker.jsx). Plain JS, bisa
// dipakai dari komponen server maupun client.

export const HERO_TEXT_EFFECTS = {
  crossfade: {
    id: "crossfade",
    label: "Foto Gonta-Ganti",
    description:
      "Tiap huruf terisi foto, semua huruf ganti foto bareng-bareng tiap beberapa detik (default lama).",
  },
  sequential: {
    id: "sequential",
    label: "Foto Berjalan",
    description:
      "Foto muncul satu huruf demi satu huruf secara berurutan -- huruf yang sudah dilewati jadi putih.",
  },
  static: {
    id: "static",
    label: "Warna Polos",
    description:
      "Tanpa animasi foto -- teks warna polos kuning kehijauan, seperti desain paling awal.",
  },
  outline: {
    id: "outline",
    label: "Texture + Outline",
    description:
      "Sama seperti Foto Gonta-Ganti, tapi tiap huruf dilapis garis outline di atas foto biar bentuk hurufnya tetap tegas kebaca.",
  },
};

export const DEFAULT_HERO_TEXT_EFFECT = "crossfade";

export const HERO_TEXT_EFFECT_LIST = Object.values(HERO_TEXT_EFFECTS);

export function getHeroTextEffect(id) {
  return HERO_TEXT_EFFECTS[id] || HERO_TEXT_EFFECTS[DEFAULT_HERO_TEXT_EFFECT];
}
