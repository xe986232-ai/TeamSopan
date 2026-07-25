import { SiteNavbar } from "@/components/ui/site-navbar";
import { LocalMusicPlayer } from "@/components/ui/local-music-player";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";

export const metadata = {
  title: "Preview Music Player",
  robots: { index: false, follow: false },
};

const navItems = [{ name: "Beranda", link: "/" }];
const mobileGroups = [{ label: "Menu", items: [{ name: "Beranda", link: "/" }] }];

// Halaman preview LocalMusicPlayer di dalam frame HP -- sebelumnya halaman
// ini isinya NowPlayingCard (kartu statis 1 track fix), sekarang diganti
// full sama LocalMusicPlayer (playlist manager beneran: upload lagu, ganti
// sampul, equalizer nyambung ke frekuensi audio asli). NowPlayingCard &
// file-nya udah dihapus dari project, LocalMusicPlayer jadi satu-satunya
// komponen "sedang memutar" yang dipakai.
//
// Konten di dalam layar HP dikasih overflow-y-auto karena LocalMusicPlayer
// sekarang punya panel daftar putar di bawah card, jadi kalau layarnya
// kurang tinggi tetap bisa di-scroll persis kayak di HP asli.
export default function PreviewNowPlayingPage() {
  return (
    <main id="top" className="relative bg-base min-h-screen">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />

      <section className="relative flex items-center justify-center px-6 py-28 sm:py-32">
        <Iphone15Pro className="w-[240px] sm:w-[280px] h-auto drop-shadow-2xl">
          <div className="flex h-full w-full flex-col items-center overflow-y-auto bg-black px-3 py-6">
            <LocalMusicPlayer />
          </div>
        </Iphone15Pro>
      </section>
    </main>
  );
}
