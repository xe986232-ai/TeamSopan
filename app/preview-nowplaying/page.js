import { NowPlayingCard } from "@/components/ui/now-playing-card";

export const metadata = {
  title: "Preview NowPlayingCard",
  robots: { index: false, follow: false },
};

// Halaman preview doang buat liat NowPlayingCard -- ganti `cover` & `src`
// di bawah dengan file asli lo (taruh di /public, misal
// /public/covers/hey-kamu-gufron.jpg dan /public/audio/hey-kamu-gufron.mp3).
export default function PreviewNowPlayingPage() {
  return (
    <main className="relative min-h-screen bg-neutral-900 flex items-center justify-center px-6 py-16">
      <NowPlayingCard
        cover="/divisi/creator-coming-soon/preview-mockup.png"
        artist="ZuraRmx"
        title="DJ HEY KAMU GUFRON"
        subtitle="delynmybini"
        src={null}
      />
    </main>
  );
}
