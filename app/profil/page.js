import { redirect } from "next/navigation";
import { SiteNavbar } from "@/components/ui/site-navbar";
import ProfileDashboardSection from "@/components/ProfileDashboardSection";
import { getOwnProfile } from "./actions";

const navItems = [
  { name: "Tentang", link: "/#tentang" },
  { name: "Divisi", link: "/#divisi" },
];

const mobileGroups = [
  {
    label: "Menu",
    items: [
      { name: "Beranda", link: "/#top" },
      { name: "Tentang", link: "/#tentang" },
      { name: "Divisi", link: "/#divisi" },
    ],
  },
];

export const metadata = {
  title: "Profil Saya",
};

// Halaman dashboard profil member yang lagi login. Beda dengan /dashboard
// (khusus admin, dijaga middleware) — halaman ini buat member biasa lihat
// & edit profil sendiri (nama, bio, sosmed, avatar), makanya pengecekan
// login dilakukan di sini langsung (bukan lewat middleware).
export default async function ProfilPage() {
  const result = await getOwnProfile();

  if (result.unauthenticated) {
    redirect("/masuk");
  }

  if (result.error) {
    return (
      <main className="relative bg-base min-h-screen">
        <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <h1 className="font-display font-bold text-xl text-ink mb-2">
            Gagal memuat profil
          </h1>
          <p className="text-sm text-ink-muted mb-1">{result.error}</p>
          <p className="text-xs text-ink-dim mt-4">
            Kalau ini error soal kolom database (bio/instagram_url/dll),
            pastikan file <code>supabase/migration_member_profile.sql</code>{" "}
            sudah dijalankan di Supabase Dashboard → SQL Editor.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-base min-h-screen">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />
      <ProfileDashboardSection profile={result.data} />
    </main>
  );
}
