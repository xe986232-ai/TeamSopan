import { SiteNavbar } from "@/components/ui/site-navbar";
import Footer from "@/components/Footer";
import AnggotaSkeleton from "@/components/AnggotaSkeleton";

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

// Ini cuma kepake kalau Next.js BENERAN lagi nunggu server (mis. cache
// miss / ISR regenerate) — bukan jalur utama buat kasus normal di Vercel
// yang datanya udah di-cache. Untuk kasus normal, lihat
// components/AnggotaReveal.jsx yang sengaja nunda reveal di client.
export default function AnggotaLoading() {
  return (
    <main className="relative bg-base">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />
      <AnggotaSkeleton />
      <Footer />
    </main>
  );
}
