import { SiteNavbar } from "@/components/ui/site-navbar";
import { TiktokPreviewScene } from "@/components/ui/tiktok-preview-scene";
import { RemotionDemo } from "@/components/ui/remotion-demo";

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
export default function PreviewTiktokOverlayPage() {
  return (
    <main id="top" className="relative min-h-screen bg-base">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />

      <section className="relative flex items-center justify-center px-6 py-28 sm:py-32">
        <TiktokPreviewScene />
      </section>

      {/* ---- Tes animasi (Remotion Player) -- lihat components/ui/remotion-demo.jsx.
                 Murni jalan di browser, bukan render server. ---- */}
      <section className="relative flex items-center justify-center border-t border-ink/10 bg-base-elevated/40 px-6 py-20">
        <RemotionDemo />
      </section>
    </main>
  );
}
