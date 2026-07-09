"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "./ui/aurora-background";

const DIVISION_BADGES = [
  { label: "Remix", color: "#B026FF" },
  { label: "Creator", color: "#00E5FF" },
  { label: "Leadis", color: "#FFD166" },
];

export default function Hero() {
  return (
    <AuroraBackground className="min-h-screen">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 text-center"
      >
        <a
          href="#divisi"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs sm:text-sm text-ink-muted hover:bg-white/10 transition-colors mb-4"
        >
          <span>🎉</span>
          <span>Divisi Leadis resmi dibuka untuk kreator perempuan</span>
          <span className="transition-transform group-hover:translate-x-0.5">›</span>
        </a>

        <div className="font-display font-black uppercase text-5xl md:text-8xl text-ink text-center leading-[0.95]">
          Sopan Team
        </div>

        <div className="font-body font-light text-base md:text-2xl text-ink-muted py-4 max-w-xl">
          Tiga divisi, satu identitas. Kami meremix suara, mengedit gambar
          jadi cerita, dan memberi panggung buat kreator perempuan.
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-2">
          <a
            href="#divisi"
            className="relative rounded-full w-fit px-7 py-3 text-sm font-semibold text-black bg-ink overflow-hidden group"
          >
            <span className="relative z-10">Lihat Divisi</span>
            <span className="absolute inset-0 bg-gradient-to-r from-remix-from via-creator-to to-leadis-to opacity-0 group-hover:opacity-20 transition-opacity" />
          </a>
          <a
            href="#tentang"
            className="border border-white/15 rounded-full w-fit text-ink px-7 py-3 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Tentang Kami
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-10 opacity-90">
          {DIVISION_BADGES.map((d) => (
            <span
              key={d.label}
              className="flex items-center gap-1.5 text-xs text-ink-muted border border-white/10 rounded-full px-3 py-1.5 bg-white/5"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              {d.label}
            </span>
          ))}
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
