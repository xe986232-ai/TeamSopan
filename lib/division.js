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
