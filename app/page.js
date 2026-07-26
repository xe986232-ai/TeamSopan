import { SiteNavbar } from "@/components/ui/site-navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import DivisionsSection from "@/components/DivisionsSection";
import TrendingSoundSection from "@/components/TrendingSoundSection";
import CreatorTrendingSection from "@/components/CreatorTrendingSection";
import AdminSection from "@/components/AdminSection";
import DivisionCoverflowMarquee from "@/components/DivisionCoverflowMarquee";
import ShowcaseSection from "@/components/ShowcaseSection";
import TestimonialSection from "@/components/TestimonialSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import WelcomeGate from "@/components/WelcomeGate";

// Revalidate tiap 60 detik biar foto admin divisi yang baru diupload dari
// dashboard otomatis kepakai di homepage tanpa perlu deploy ulang.
export const revalidate = 60;

const navItems = [
  { name: "Tentang", link: "#tentang" },
  { name: "Divisi", link: "#divisi" },
  { name: "Ketentuan", link: "/ketentuan" },
  { name: "Privasi", link: "/privasi" },
];

const mobileGroups = [
  {
    label: "Menu",
    items: [
      { name: "Beranda", link: "#top" },
      { name: "Tentang", link: "#tentang" },
      { name: "Divisi", link: "#divisi" },
      { name: "Karya", link: "#karya" },
    ],
  },
  {
    label: "Divisi Kami",
    items: [
      { name: "Remix", link: "#divisi" },
      { name: "Creator", link: "#divisi" },
      { name: "Leadis", link: "#divisi" },
    ],
  },
  {
    label: "Legal",
    items: [
      { name: "Ketentuan Layanan", link: "/ketentuan" },
      { name: "Kebijakan Privasi", link: "/privasi" },
    ],
  },
];

export default function Home() {
  return (
    <main id="top" className="relative bg-base">
      <WelcomeGate />
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />
      <Hero />
      <AboutSection />
      <DivisionsSection />
      <TrendingSoundSection />
      <CreatorTrendingSection />
      <AdminSection />
      <DivisionCoverflowMarquee />
      <ShowcaseSection />
      <TestimonialSection />
      <FaqSection />
      <Footer />
    </main>
  );
}