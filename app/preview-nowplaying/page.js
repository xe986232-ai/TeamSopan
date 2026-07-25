import { SiteNavbar } from "@/components/ui/site-navbar";
import { NowPlayingCard } from "@/components/ui/now-playing-card";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";

export const metadata = {
  title: "Preview NowPlayingCard",
  robots: { index: false, follow: false },
};

const navItems = [{ name: "Beranda", link: "/" }];
const mobileGroups = [{ label: "Menu", items: [{ name: "Beranda", link: "/" }] }];

// Halaman preview NowPlayingCard di dalam frame HP -- sekarang jadi
// "halaman biasa" kayak app/page.js: pakai SiteNavbar yang sama, ikut
// bg-base/text-ink (jadi otomatis ngikut dark/light mode dari
// ThemeProvider di root layout, bukan warna gelap hardcode lagi), dan
// frame HP-nya di-scale pakai className (w-*, h-auto) supaya proporsional
// & ga kepotong di layar HP asli -- lebar SVG-nya sengaja TIDAK dipasang
// literal (width/height), biar ukurannya sepenuhnya diatur CSS responsif.
//
// Ganti `cover` & `src` di bawah dengan file asli lo (taruh di /public,
// misal /public/covers/hey-kamu-gufron.jpg dan
// /public/audio/hey-kamu-gufron.mp3).
export default function PreviewNowPlayingPage() {
  return (
    <main id="top" className="relative bg-base min-h-screen">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />

      <section className="relative flex items-center justify-center px-6 py-28 sm:py-32">
        <Iphone15Pro className="w-[240px] sm:w-[280px] h-auto drop-shadow-2xl">
          <div className="flex h-full w-full items-center justify-center bg-black px-3">
            <NowPlayingCard
              cover="/divisi/creator-coming-soon/preview-mockup.png"
              artist="ZuraRmx"
              title="DJ HEY KAMU GUFRON"
              subtitle="delynmybini"
              src={null}
            />
          </div>
        </Iphone15Pro>
      </section>
    </main>
  );
}
