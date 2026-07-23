"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Ripple } from "@/components/ui/ripple";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function ComingSoonPage() {
  return (
    // "dark" dipaksa di sini biar halaman teaser ini selalu tampil gelap,
    // senada sama halaman coming-soon Divisi Creator.
    <div className="dark relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Efek ripple menyebar dari tengah halaman */}
      <Ripple mainCircleSize={180} mainCircleOpacity={0.28} numCircles={8} />

      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Logo Sopan Team, badge bulat putih biar tetap kontras di background gelap */}
        <span className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-white shadow-2xl shadow-black/40 animate-float-slow">
          <Image
            src="/sopan-logo-black.png"
            alt="Sopan Team"
            width={44}
            height={56}
            priority
          />
        </span>

        <span className="font-body font-semibold text-sm sm:text-base tracking-[0.35em] uppercase bg-gradient-to-r from-remix-from via-creator-to to-leadis-to bg-clip-text text-transparent mt-8">
          Sopan Team
        </span>

        <h1 className="font-display font-black text-5xl sm:text-7xl mt-3 text-white">
          Coming Soon
        </h1>

        <p className="font-body font-normal text-base sm:text-lg text-white/60 mt-5 max-w-md">
          Halaman ini sedang kami siapkan. Nantikan kehadirannya buat
          komunitas Remix, Creator, dan Leadis di SOPAN TEAM.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-9">
          <Link href="/">
            <span className="inline-block rounded-full px-7 py-3 text-sm font-medium text-white bg-gradient-to-r from-remix-from via-creator-to to-leadis-to hover:opacity-90 transition-opacity">
              Balik ke Beranda
            </span>
          </Link>
          <Link
            href="/gabung"
            className="rounded-full px-7 py-3 text-sm font-medium text-white border border-white/15 hover:bg-white/5 transition-colors"
          >
            Gabung SOPAN TEAM
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
