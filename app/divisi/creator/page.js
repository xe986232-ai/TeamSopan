"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Button } from "@/components/ui/button";
import { SiteNavbar } from "@/components/ui/site-navbar";
import { ExpandableCards } from "@/components/ui/expandable-card";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import Footer from "@/components/Footer";

const MEMBERS = [
  { id: 1, name: "Bagas W.", designation: "Lead Editor", image: "https://i.pravatar.cc/150?img=33" },
  { id: 2, name: "Yoga S.", designation: "Motion Designer", image: "https://i.pravatar.cc/150?img=51" },
  { id: 3, name: "Rian K.", designation: "Alight Motion Artist", image: "https://i.pravatar.cc/150?img=52" },
];

const KARYA = [
  {
    title: "Cinematic Transition Pack",
    subtitle: "Alight Motion Edit",
    accent: "from-creator-from/30 to-creator-to/30",
    description:
      "Rangkaian transisi cinematic yang dirakit penuh di Alight Motion, dipakai buat video showcase komunitas. Fokus di timing & smoothness biar perpindahan scene enak dilihat.",
  },
  {
    title: "Beat Sync Edit",
    subtitle: "Motion Graphic",
    accent: "from-creator-from/30 to-creator-to/30",
    description:
      "Edit video yang dipotong & digerakkan pas banget sama ketukan musik. Kombinasi keyframe & curva custom biar animasinya tetap terasa hidup, nggak kaku.",
  },
  {
    title: "Animated Text Reel",
    subtitle: "Animation Text",
    accent: "from-creator-from/30 to-creator-to/30",
    description:
      "Showcase kumpulan animasi teks — dari yang simpel sampai yang pakai custom curva buat efek bounce & overshoot. Sering dipakai buat opening/closing video komunitas.",
  },
];

const TESTIMONIALS = [
  {
    name: "Bagas W.",
    title: "Lead Editor",
    image: "https://i.pravatar.cc/150?img=33",
    quote: "Alight Motion itu fleksibel banget kalau udah paham main curva. Rasanya kayak punya After Effects di HP.",
  },
  {
    name: "Yoga S.",
    title: "Motion Designer",
    image: "https://i.pravatar.cc/150?img=51",
    quote: "Belajar animasi teks di sini bikin gaya edit gue jadi lebih punya karakter, nggak template-an lagi.",
  },
  {
    name: "Rian K.",
    title: "Alight Motion Artist",
    image: "https://i.pravatar.cc/150?img=52",
    quote: "Tiap project selalu ada eksperimen keyframe baru. Divisi ini bikin gue nggak berhenti belajar.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function CreatorDivisionPage() {
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

      {/* Hero divisi Creator */}
      <section className="relative overflow-hidden px-6 sm:px-10 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div
          className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "#00E5FF" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "#3D5AFE" }}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative max-w-3xl mx-auto text-center"
        >
          <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
            Divisi 02
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl mt-4 bg-gradient-to-r from-creator-from to-creator-to bg-clip-text text-transparent">
            Creator
          </h1>
          <p className="font-body font-medium text-lg sm:text-xl text-ink-muted mt-4 max-w-xl mx-auto">
            Footage jadi cerita, lewat layar HP.
          </p>
          <p className="font-body font-normal text-base text-ink-dim mt-4 max-w-2xl mx-auto">
            Divisi buat kamu yang jago editing video pakai{" "}
            <span className="text-ink font-medium">Alight Motion</span> — dari
            transisi rapi, animasi teks, motion graphic, sampai color grading
            yang konsisten. Semua diracik langsung dari HP, nggak butuh PC.
          </p>

          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {["Alight Motion", "Motion Graphic", "Animation Text"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-ink-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button className="rounded-full px-7 py-3">Gabung Divisi Creator</Button>
            <Link
              href="/divisi/creator/assets"
              className="border border-black/10 dark:border-white/10 rounded-full text-ink px-7 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Lihat Assets & Template
            </Link>
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
          <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
            Tim
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 text-ink">
            Yang meracik animasi di balik layar
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
            <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
              Karya Terbaru
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 text-ink">
              Apa yang lagi diracik divisi Creator
            </h2>
          </motion.div>

          <ExpandableCards items={KARYA} />
        </div>
      </section>

      {/* Assets & Template CTA */}
      <section className="px-6 sm:px-10 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center rounded-3xl border border-black/10 dark:border-white/10 px-6 sm:px-10 py-12 sm:py-16 relative overflow-hidden"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(135deg, #00E5FF, #3D5AFE)",
            }}
          />
          <span className="relative font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
            Belajar & Berkarya
          </span>
          <h2 className="relative font-display font-bold text-3xl sm:text-4xl mt-4 text-ink">
            Assets, template, dan tutorial dasar Alight Motion
          </h2>
          <p className="relative font-body text-base text-ink-dim mt-4 max-w-xl mx-auto">
            Mulai dari animasi teks siap pakai, penjelasan dasar editing,
            sampai cara main curva biar animasi kamu makin hidup.
          </p>
          <div className="relative mt-8">
            <Link href="/divisi/creator/assets">
              <Button className="rounded-full px-7 py-3">Buka Assets Creator</Button>
            </Link>
          </div>
        </motion.div>
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
          <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
            Kata Mereka
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 text-ink">
            Cerita dari divisi Creator
          </h2>
        </motion.div>
        <InfiniteMovingCards items={TESTIMONIALS} direction="left" speed="slow" />
      </section>

      <Footer />
    </main>
  );
}
