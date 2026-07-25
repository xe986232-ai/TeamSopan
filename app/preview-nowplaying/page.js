import { SiteNavbar } from "@/components/ui/site-navbar";
import { NowPlayingScene } from "@/components/ui/now-playing-scene";

export const metadata = {
  title: "Preview Music Player",
  robots: { index: false, follow: false },
};

const navItems = [{ name: "Beranda", link: "/" }];
const mobileGroups = [{ label: "Menu", items: [{ name: "Beranda", link: "/" }] }];

// Halaman preview music player -- di dalam frame HP cuma tampil
// MusicPlayerCard (kecil) + background ambient blur dari sampul aktif yang
// penuh 1 layar. Semua kustomisasi (upload lagu, ganti sampul, kelola
// daftar putar) ada di PlaylistPanel yang letaknya DI LUAR mockup HP.
// Lihat components/ui/now-playing-scene.jsx untuk detail komposisinya.
export default function PreviewNowPlayingPage() {
  return (
    <main id="top" className="relative bg-base min-h-screen">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />

      <section className="relative flex items-center justify-center px-6 py-28 sm:py-32">
        <NowPlayingScene />
      </section>
    </main>
  );
}
