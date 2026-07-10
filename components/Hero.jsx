"use client";

import { motion } from "framer-motion";
import { SoftGlowBackground } from "./ui/soft-glow-background";
import { RainbowButton } from "./ui/rainbow-button";

export default function Hero() {
  return (
    <SoftGlowBackground className="min-h-[70vh] sm:min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 text-center"
      >
        <div className="font-hero font-black uppercase text-5xl md:text-8xl text-ink text-center leading-[0.95]">
          Sopan Team
        </div>

        <div className="font-body font-normal text-base md:text-2xl text-ink-muted py-4 max-w-xl">
          Tiga divisi, satu wadah. Tempat berkumpulnya kreator remix, video
          editor, dan kreator konten perempuan yang mau berkembang bareng.
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <RainbowButton href="#divisi" className="h-auto w-fit px-7 py-3 text-sm font-semibold">
            Lihat Divisi
          </RainbowButton>
          <RainbowButton href="#tentang" className="h-auto w-fit px-7 py-3 text-sm font-medium">
            Tentang Kami
          </RainbowButton>
        </div>
      </motion.div>
    </SoftGlowBackground>
  );
}
