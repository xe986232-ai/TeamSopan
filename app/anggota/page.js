import { SiteNavbar } from "@/components/ui/site-navbar";
import Footer from "@/components/Footer";
import { TeamSectionSimple01 } from "@/components/TeamSectionSimple01";

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

export default function AnggotaPage() {
  return (
    <main className="relative bg-base">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />
      <TeamSectionSimple01 />
      <Footer />
    </main>
  );
}