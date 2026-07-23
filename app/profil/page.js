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

  if (result.error || !result.data) {
    redirect("/masuk");
  }

  return (
    <main className="relative bg-base min-h-screen">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />
      <ProfileDashboardSection profile={result.data} />
    </main>
  );
}
