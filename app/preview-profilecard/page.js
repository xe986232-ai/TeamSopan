import { SiteNavbar } from "@/components/ui/site-navbar";
import Footer from "@/components/Footer";
import ProfileCardPreviewSection from "@/components/ProfileCardPreviewSection";

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
  title: "Preview ProfileCard",
};

export default function PreviewProfileCardPage() {
  return (
    <main className="relative bg-base">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />
      <ProfileCardPreviewSection />
      <Footer />
    </main>
  );
}
