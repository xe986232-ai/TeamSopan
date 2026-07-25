import { NowPlayingCard } from "@/components/ui/now-playing-card";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";

export const metadata = {
  title: "Preview NowPlayingCard",
  robots: { index: false, follow: false },
};

// Halaman preview doang buat liat NowPlayingCard di dalam frame HP --
// ganti `cover` & `src` di bawah dengan file asli lo (taruh di /public,
// misal /public/covers/hey-kamu-gufron.jpg dan
// /public/audio/hey-kamu-gufron.mp3).
export default function PreviewNowPlayingPage() {
  return (
    <main className="relative min-h-screen bg-neutral-900 flex items-center justify-center px-6 py-16">
      <Iphone15Pro width={340} height={692} className="drop-shadow-2xl">
        <div className="flex h-full w-full items-center justify-center bg-black px-4">
          <NowPlayingCard
            cover="/divisi/creator-coming-soon/preview-mockup.png"
            artist="ZuraRmx"
            title="DJ HEY KAMU GUFRON"
            subtitle="delynmybini"
            src={null}
          />
        </div>
      </Iphone15Pro>
    </main>
  );
}
