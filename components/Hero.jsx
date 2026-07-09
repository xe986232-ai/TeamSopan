"use client";

import { motion } from "framer-motion";
import { SoftGlowBackground } from "./ui/soft-glow-background";

export default function Hero() {
  return (
    <SoftGlowBackground className="min-h-[70vh] sm:min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 text-center"
      >
        <div className="font-display font-black uppercase text-5xl md:text-8xl text-ink text-center leading-[0.95]">
          Sopan Team
        </div>

        <div className="font-body font-light text-base md:text-2xl text-ink-muted py-4 max-w-xl">
          Tiga divisi, satu wadah. Tempat berkumpulnya kreator remix, video
          editor, dan kreator konten perempuan yang mau berkembang bareng.
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#divisi"
            className="relative rounded-full w-fit px-7 py-3 text-sm font-semibold text-white bg-ink-solid dark:bg-white dark:text-ink-solid overflow-hidden group"
          >
            <span className="relative z-10">Lihat Divisi</span>
            <span className="absolute inset-0 bg-gradient-to-r from-remix-from via-creator-to to-leadis-to opacity-0 group-hover:opacity-30 transition-opacity" />
          </a>
          <a
            href="#tentang"
            className="border border-black/10 dark:border-white/10 rounded-full w-fit text-ink px-7 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Tentang Kami
          </a>
        </div>
      </motion.div>
    </SoftGlowBackground>
  );
}
