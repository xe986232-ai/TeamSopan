"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function CreatorComingSoonPage() {
  return (
    // "dark" dipaksa di sini biar halaman teaser ini selalu tampil gelap,
    // nggak ikut toggle light/dark punya user.
    <div className="dark relative min-h-screen bg-black overflow-hidden">
      {/* Ambient glow — cyan (kiri) & ungu/biru (kanan), senada sama referensi */}
      <div
        className="pointer-events-none absolute top-[-10%] left-[-15%] h-[520px] w-[520px] rounded-full blur-3xl opacity-40"
        style={{ background: "#00E5FF" }}
      />
      <div
        className="pointer-events-none absolute top-[-5%] right-[-10%] h-[480px] w-[480px] rounded-full blur-3xl opacity-30"
        style={{ background: "#6D28D9" }}
      />

      {/* Logo kecil di pojok kiri atas */}
      <div className="relative z-10 flex items-center gap-2 px-6 sm:px-10 pt-8">
        <span className="relative h-6 w-6 rounded-full border-2 border-transparent bg-gradient-to-br from-creator-from to-creator-to" />
        <Link
          href="/"
          className="font-body font-semibold text-sm tracking-wide text-white/90 hover:text-white transition-colors"
        >
          TEAM SOPAN
        </Link>
      </div>

      <section className="relative z-10 px-6 sm:px-10 pt-10 pb-24 sm:pt-14 sm:pb-32 flex flex-col items-center">
        {/* Preview mockup */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative w-full max-w-xl mx-auto"
        >
          <div
            className="pointer-events-none absolute -inset-6 rounded-[32px] blur-2xl opacity-40"
            style={{ background: "linear-gradient(135deg, #00E5FF, #6D28D9)" }}
          />
          <div className="relative rounded-[24px] overflow-hidden shadow-2xl">
            <Image
              src="/divisi/creator-coming-soon/preview-mockup.png"
              alt="Preview website Divisi Creator — Team Sopan"
              width={1254}
              height={1254}
              priority
              className="w-full h-auto"
            />
          </div>
        </motion.div>

        {/* Text: WEBSITE LAUNCH / Coming Soon */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="relative text-center mt-14 sm:mt-16"
        >
          <span className="font-body font-semibold text-sm sm:text-base tracking-[0.35em] uppercase bg-gradient-to-r from-creator-from to-creator-to bg-clip-text text-transparent">
            Website Launch
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl mt-3 text-white">
            Coming Soon
          </h1>
          <p className="font-body font-normal text-base sm:text-lg text-white/60 mt-5 max-w-md mx-auto">
            Halaman divisi Creator sedang disiapkan. Nantikan showcase karya,
            member, dan assets dari divisi ini.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-9">
            <Link href="/">
              <span className="inline-block rounded-full px-7 py-3 text-sm font-medium text-white bg-gradient-to-r from-creator-from to-creator-to hover:opacity-90 transition-opacity">
                Balik ke Beranda
              </span>
            </Link>
            <Link
              href="/gabung"
              className="rounded-full px-7 py-3 text-sm font-medium text-white border border-white/15 hover:bg-white/5 transition-colors"
            >
              Gabung Divisi Creator
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
