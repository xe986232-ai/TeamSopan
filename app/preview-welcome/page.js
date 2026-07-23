import { SiteNavbar } from "@/components/ui/site-navbar";
import PreviewWelcomeContent from "./PreviewWelcomeContent";

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
  title: "Preview Welcome",
};

export default function PreviewWelcomePage() {
  return (
    <main className="relative bg-base">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />
      <PreviewWelcomeContent />
    </main>
  );
}
