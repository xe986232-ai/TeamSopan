// Mapping slug divisi (disimpan di DB: 'remix' | 'creator' | 'leadis')
// ke label yang ditampilkan ke user.
export const DIVISION_LABELS = {
  remix: "Divisi Remix",
  creator: "Divisi Creator",
  leadis: "Divisi Leadis",
};

export function divisionLabel(slug) {
  if (!slug) return "";
  return DIVISION_LABELS[slug] || slug;
}

// Label singkat, dipakai di kartu anggota halaman /anggota (bukan
// "Divisi Remix" yang panjang, cukup peran singkatnya).
export const DIVISION_SHORT_LABELS = {
  remix: "Remixer",
  creator: "Creator",
  leadis: "Leadis",
};

export function divisionShortLabel(slug) {
  if (!slug) return "";
  return DIVISION_SHORT_LABELS[slug] || slug;
}
