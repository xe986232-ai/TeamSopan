import { SiteNavbar } from "@/components/ui/site-navbar";
import Footer from "@/components/Footer";
import { TeamSectionSimple01 } from "@/components/TeamSectionSimple01";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { divisionLabel } from "@/lib/division";

const navItems = [
  { name: "Tentang", link: "/#tentang" },
  { name: "Divisi", link: "/#divisi" },
  { name: "Anggota", link: "/anggota" },
];

const mobileGroups = [
  {
    label: "Menu",
    items: [
      { name: "Beranda", link: "/#top" },
      { name: "Tentang", link: "/#tentang" },
      { name: "Divisi", link: "/#divisi" },
      { name: "Anggota", link: "/anggota" },
    ],
  },
];

export const metadata = {
  title: "Anggota Tim | SOPAN TEAM",
  description: "Kenalan dengan anggota tim SOPAN TEAM dari divisi Remix, Creator, dan Leadis.",
};

// Revalidate tiap 60 detik biar member baru / update profil (foto, bio, dll)
// otomatis kepakai di halaman ini tanpa perlu deploy ulang.
export const revalidate = 60;

// Halaman publik, jadi query dilakukan lewat server (bukan browser) pakai
// admin client — bukan buat bypass keamanan sembarangan, tapi karena tabel
// `members` sengaja TIDAK punya policy publik (cuma "baca profil sendiri").
// Di sini kita SENGAJA hanya pilih & tampilkan kolom yang aman buat publik
// (tidak termasuk email), dan cuma anggota berstatus "aktif" yang muncul.
export default async function AnggotaPage() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      "id, full_name, division, role, avatar_url, bio, instagram_url, tiktok_url, youtube_url"
    )
    .eq("status", "aktif")
    .order("joined_at", { ascending: true });

  const members = (data || []).map((m) => ({
    id: m.id,
    name: m.full_name,
    title: m.role || divisionLabel(m.division),
    division: divisionLabel(m.division),
    avatarUrl:
      m.avatar_url ||
      `https://placehold.co/200x200/B026FF/white?text=${encodeURIComponent(
        m.full_name?.charAt(0) || "?"
      )}`,
    social: {
      instagram: m.instagram_url || null,
      tiktok: m.tiktok_url || null,
      youtube: m.youtube_url || null,
    },
  }));

  return (
    <main className="relative bg-base">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />
      <TeamSectionSimple01 members={members} loadError={error?.message} />
      <Footer />
    </main>
  );
}
