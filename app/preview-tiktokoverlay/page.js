import { SiteNavbar } from "@/components/ui/site-navbar";
import { TiktokPreviewScene } from "@/components/ui/tiktok-preview-scene";

export const metadata = {
  title: "Preview TikTok Overlay",
  robots: { index: false, follow: false },
};

const navItems = [{ name: "Beranda", link: "/" }];
const mobileGroups = [{ label: "Menu", items: [{ name: "Beranda", link: "/" }] }];

// Halaman preview overlay chrome TikTok di dalam mockup HP -- lihat
// components/ui/tiktok-overlay.jsx untuk detail chrome-nya (status bar,
// tab, kolom aksi kanan, bottom nav) dan tiktok-preview-scene.jsx untuk
// tempat area konten (video/foto) ditaruh di belakang overlay.
//
// CATATAN: section tes Remotion Player (RemotionDemo) sudah dihapus --
// itu yang bikin build Vercel gagal (prerender error "Element type is
// invalid... got undefined"). Halaman ini sekarang cuma nampilin
// komponen preview + fitur upload lagu, tanpa render engine apa pun.
export default function PreviewTiktokOverlayPage() {
  return (
    <main id="top" className="relative min-h-screen bg-base">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />

      <section className="relative flex items-center justify-center px-6 py-28 sm:py-32">
        <TiktokPreviewScene />
      </section>
    </main>
  );
}
