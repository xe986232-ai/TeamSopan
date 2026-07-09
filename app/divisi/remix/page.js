"use client";

import { motion } from "framer-motion";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Button } from "@/components/ui/button";
import { SiteNavbar } from "@/components/ui/site-navbar";
import { ExpandableCards } from "@/components/ui/expandable-card";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import Footer from "@/components/Footer";

const MEMBERS = [
  { id: 1, name: "Raka A.", designation: "Lead Remixer", image: "https://i.pravatar.cc/150?img=13" },
  { id: 2, name: "Dio P.", designation: "Sound Designer", image: "https://i.pravatar.cc/150?img=14" },
  { id: 3, name: "Fajar N.", designation: "Mix Engineer", image: "https://i.pravatar.cc/150?img=15" },
];

const KARYA = [
  {
    title: "Malam Ini Bootleg",
    subtitle: "Bootleg Remix",
    accent: "from-remix-from/30 to-remix-to/30",
    description:
      "Bootleg remix versi funk dari track komunitas lokal. Diracik ulang dengan groove yang lebih hidup buat dance floor, tetap mempertahankan nuansa asli lagunya.",
  },
  {
    title: "Senja Mashup Set",
    subtitle: "Mashup",
    accent: "from-remix-from/30 to-remix-to/30",
    description:
      "Mashup 3 lagu jadi satu set closing 12 menit, dipakai buat penutup event komunitas. Transisi antar lagu dibuat mulus biar energi penonton tetap terjaga.",
  },
  {
    title: "Ruang Tunggu (Remix Full Produksi)",
    subtitle: "Remix Full Produksi",
    accent: "from-remix-from/30 to-remix-to/30",
    description:
      "Produksi ulang penuh dengan arransemen baru & sound design custom dari nol. Ini proyek paling ambisius divisi Remix sejauh ini.",
  },
];

const TESTIMONIALS = [
  {
    name: "Raka A.",
    title: "Lead Remixer",
    image: "https://i.pravatar.cc/150?img=13",
    quote: "Tiap project remix di sini selalu jadi ruang eksperimen baru. Nggak pernah bosen.",
  },
  {
    name: "Dio P.",
    title: "Sound Designer",
    image: "https://i.pravatar.cc/150?img=14",
    quote: "Detail sound design kecil aja bisa ngubah rasa satu track. Di sini semua orang peduli soal itu.",
  },
  {
    name: "Fajar N.",
    title: "Mix Engineer",
    image: "https://i.pravatar.cc/150?img=15",
    quote: "Mixing bareng tim yang saling ngerti bikin proses produksi jauh lebih cepat & rapi.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function RemixDivisionPage() {
  return (
    <main className="relative bg-base">
      <SiteNavbar
        navItems={[
          { name: "Tentang", link: "/#tentang" },
          { name: "Divisi", link: "/#divisi" },
        ]}
        mobileGroups={[
          {
            label: "Menu",
            items: [
              { name: "Beranda", link: "/" },
              { name: "Tentang", link: "/#tentang" },
              { name: "Divisi", link: "/#divisi" },
            ],
          },
        ]}
      />

      {/* Hero divisi Remix */}
      <section className="relative overflow-hidden px-6 sm:px-10 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div
          className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "#B026FF" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "#FF2E92" }}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative max-w-3xl mx-auto text-center"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-ink-muted">
            Divisi 01
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl mt-4 bg-gradient-to-r from-remix-from to-remix-to bg-clip-text text-transparent">
            Remix
          </h1>
          <p className="font-body text-lg sm:text-xl text-ink-muted mt-4 max-w-xl mx-auto">
            Suara baru dari lagu lama.
          </p>
          <p className="font-body text-base text-ink-dim mt-4 max-w-2xl mx-auto">
            Wadah buat kamu yang jago ngolah ulang track jadi versi yang
            lebih segar — dari mashup, bootleg, sampai remix full produksi.
            Buat kreator yang mau bikin telinga orang nengok dua kali.
          </p>

          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {["Mashup", "Bootleg Remix", "Sound Design"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-ink-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button className="rounded-full px-7 py-3">Gabung Divisi Remix</Button>
            <a
              href="#karya"
              className="border border-black/10 dark:border-white/10 rounded-full text-ink px-7 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Lihat Karya
            </a>
          </div>
        </motion.div>
      </section>

      {/* Member */}
      <section className="px-6 sm:px-10 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-ink-muted">
            Tim
          </span>
          <h2 className="font-display text-3xl sm:text-4xl mt-4 text-ink">
            Yang meracik di balik layar
          </h2>

          <div className="flex justify-center mt-8">
            <AnimatedTooltip items={MEMBERS} />
          </div>
        </motion.div>
      </section>

      {/* Karya */}
      <section id="karya" className="px-6 sm:px-10 py-16 sm:py-20 bg-base-elevated">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mb-10 text-center mx-auto"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-ink-muted">
              Karya Terbaru
            </span>
            <h2 className="font-display text-3xl sm:text-4xl mt-4 text-ink">
              Apa yang lagi diracik divisi Remix
            </h2>
          </motion.div>

          <ExpandableCards items={KARYA} />
        </div>
      </section>

      {/* Testimoni */}
      <section className="relative py-10 overflow-hidden bg-base-elevated">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto px-6 sm:px-10 mb-8 text-center"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-ink-muted">
            Kata Mereka
          </span>
          <h2 className="font-display text-3xl sm:text-4xl mt-4 text-ink">
            Cerita dari divisi Remix
          </h2>
        </motion.div>
        <InfiniteMovingCards items={TESTIMONIALS} direction="left" speed="slow" />
      </section>

      <Footer />
    </main>
  );
}