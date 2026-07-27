import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { divisionShortLabel } from "@/lib/division";
import DivisionsSectionClient from "./DivisionsSectionClient";

// Data statis tampilan tiap divisi (warna, deskripsi, tag) -- yang dinamis
// (member & jumlahnya) diambil dari Supabase di getDivisionsData di bawah.
const DIVISION_META = {
  remix: {
    eyebrow: "Divisi 01",
    name: "Remix",
    href: "/divisi/remix",
    tagline: "Suara baru dari lagu lama",
    description:
      "Ngolah track lewat DAW jadi remix versi sendiri — dari mashup, bootleg remix, sampai produksi remix full version siap rilis.",
    tags: ["Remix", "DAW Production", "Bootleg Remix"],
    soft: "#F1E9FF",
    accentSolidFrom: "#B026FF",
    accentSolidTo: "#FF2E92",
  },
  creator: {
    eyebrow: "Divisi 02",
    name: "Creator",
    tagline: "Jedag-jedug bikin nagih",
    description:
      "Racik footage jadi konten jedag-jedug yang bikin nagih pakai Alight Motion atau CapCut — transisi ngebut, efek nampol, siap FYP.",
    tags: ["Alight Motion", "CapCut", "Edit Jedag-Jedug"],
    soft: "#DFF7EC",
    accentSolidFrom: "#00E5FF",
    accentSolidTo: "#3D5AFE",
  },
  leadis: {
    eyebrow: "Divisi 03",
    name: "Leadis",
    tagline: "Jedag-jedug khusus kreator cewek",
    description:
      "Sama kayak Creator — edit jedag-jedug pakai Alight Motion atau CapCut, tapi ini rumahnya para kreator cewek buat berkarya bareng.",
    tags: ["Alight Motion", "CapCut", "Kreator Cewek"],
    soft: "#FFEFD9",
    accentSolidFrom: "#FFD166",
    accentSolidTo: "#FF6FB5",
  },
};

const DIVISION_ORDER = ["remix", "creator", "leadis"];

// Fisher-Yates biar urutan member yang ditampilkan beneran acak tiap kali
// halaman di-render ulang (server component -> acak lagi tiap refresh),
// bukan cuma diacak sekali terus disimpen.
function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function fallbackAvatar(name, hexColor) {
  return `https://placehold.co/200x200/${hexColor.replace("#", "")}/white?text=${encodeURIComponent(
    name?.charAt(0) || "?"
  )}`;
}

// Ambil member aktif per divisi dari Supabase, acak, lalu pilih 3 buat
// ditampilkan di kartu divisi homepage. Kalau member aktif di divisi itu
// kurang dari 3, slot sisanya diisi kartu "logo default" (bukan foto member
// palsu) supaya tetap kelihatan penuh & rapi.
async function getDivisionsData() {
  const byDivision = { remix: [], creator: [], leadis: [] };

  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("members")
      .select("id, full_name, division, role, avatar_url")
      .eq("status", "aktif");

    if (error) throw error;

    for (const m of data || []) {
      if (byDivision[m.division]) byDivision[m.division].push(m);
    }
  } catch (err) {
    console.error(
      "[DivisionsSection] Gagal ambil data members aktif dari Supabase:",
      err
    );
    // byDivision tetap array kosong per divisi -> semua kartu jatuh ke
    // slot logo default, section tetap tampil (tidak rusak/kosong).
  }

  return DIVISION_ORDER.map((slug) => {
    const meta = DIVISION_META[slug];
    const activeMembers = byDivision[slug] || [];
    const totalActive = activeMembers.length;

    const picked = shuffle(activeMembers)
      .slice(0, 3)
      .map((m) => ({
        id: m.id,
        name: m.full_name,
        designation: m.role || divisionShortLabel(slug),
        image: m.avatar_url || fallbackAvatar(m.full_name, meta.accentSolidFrom),
        isDefault: false,
      }));

    const missing = 3 - picked.length;
    const members =
      missing > 0
        ? [
            ...picked,
            ...Array.from({ length: missing }, (_, i) => ({
              id: `${slug}-default-${i}`,
              name: "SOPAN TEAM",
              designation: meta.name,
              image: "/sopan-logo-black.png",
              isDefault: true,
            })),
          ]
        : picked;

    return {
      ...meta,
      members,
      totalActive,
      // "30+" cuma muncul kalau beneran ada member aktif lebih dari 3 yang
      // gak kebagian slot avatar di atas -- gak asal pasang angka gede.
      extraCount: totalActive > 3 ? "30+" : null,
    };
  });
}

export default async function DivisionsSection() {
  const divisions = await getDivisionsData();
  return <DivisionsSectionClient divisions={divisions} />;
}
