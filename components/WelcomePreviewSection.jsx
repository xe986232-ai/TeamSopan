"use client";

import BlurInText from "@/components/ui/blur-in-text";
import MorphingText from "@/components/ui/morphing-text";

// Placeholder — nanti disambungkan ke data member beneran.
const avatarUrl =
  "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?auto=format&fit=crop&q=80&w=400";
const morphWords = ["Candra", "Divisi Remix", "SOPAN TEAM"];

export default function WelcomePreviewSection() {
  return (
    <section className="bg-base py-20 sm:py-28 px-4 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-black/10 dark:border-white/10 shadow-lg mb-8">
        <img
          src={avatarUrl}
          alt="Foto member baru"
          className="w-full h-full object-cover"
        />
      </div>

      <BlurInText text="Selamat Datang!" className="text-4xl md:text-6xl text-ink" />

      <MorphingText words={morphWords} className="text-2xl md:text-4xl mt-4" />
    </section>
  );
}
