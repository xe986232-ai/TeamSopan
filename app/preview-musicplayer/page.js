import { SiteNavbar } from "@/components/ui/site-navbar";
import { LocalMusicPlayer } from "@/components/ui/local-music-player";

export const metadata = {
  title: "Preview Music Player",
  robots: { index: false, follow: false },
};

const navItems = [{ name: "Beranda", link: "/" }];
const mobileGroups = [{ label: "Menu", items: [{ name: "Beranda", link: "/" }] }];

// Halaman preview LocalMusicPlayer -- komponen ini hasil konversi dari
// source HTML/CSS/JS "Music Player" yang dikasih user jadi komponen React
// client-side full-fitur: upload lagu (multi-file), ganti sampul per lagu,
// play/pause/next/prev, seek, volume, dan equalizer 5-bar yang beneran
// ngikutin frekuensi audio (Web Audio API AnalyserNode).
//
// Beda dengan NowPlayingCard di /preview-nowplaying (itu murni tampilan +
// 1 track fix), komponen ini punya playlist manager sendiri di client --
// jadi nggak butuh prop cover/artist/title, semua diisi lewat tombol
// "Tambah Lagu" & ikon pensil di pojok cover art.
export default function PreviewMusicPlayerPage() {
  return (
    <main id="top" className="relative bg-base min-h-screen">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />

      <section className="relative flex items-center justify-center px-6 py-28 sm:py-32">
        <LocalMusicPlayer />
      </section>
    </main>
  );
}
