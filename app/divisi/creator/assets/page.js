"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Layers,
  Sparkles,
  Spline,
  Type,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteNavbar } from "@/components/ui/site-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Footer from "@/components/Footer";

const CATEGORIES = ["Semua", "Animation Text", "Transisi", "Overlay", "Preset Warna"];

const ASSETS = [
  {
    title: "Bounce In Text",
    category: "Animation Text",
    description: "Animasi teks masuk dengan efek bounce, siap pakai buat opening video.",
    badge: "Gratis",
    tags: ["Text", "Bounce"],
    accent: "from-creator-from/30 to-creator-to/30",
  },
  {
    title: "Glitch Type Text",
    category: "Animation Text",
    description: "Efek teks glitch buat konten yang butuh nuansa lebih techy & tegas.",
    badge: "Pro",
    tags: ["Text", "Glitch"],
    accent: "from-creator-from/30 to-creator-to/30",
  },
  {
    title: "Zoom Blur Transition",
    category: "Transisi",
    description: "Transisi zoom blur cepat, cocok buat perpindahan scene yang energik.",
    badge: "Gratis",
    tags: ["Transisi", "Zoom"],
    accent: "from-creator-from/30 to-creator-to/30",
  },
  {
    title: "Slide Smooth Transition",
    category: "Transisi",
    description: "Transisi geser halus dengan easing custom, minim distraksi.",
    badge: "Pro",
    tags: ["Transisi", "Slide"],
    accent: "from-creator-from/30 to-creator-to/30",
  },
  {
    title: "Light Leak Overlay",
    category: "Overlay",
    description: "Overlay cahaya buat nambah nuansa cinematic di video kamu.",
    badge: "Gratis",
    tags: ["Overlay", "Light"],
    accent: "from-creator-from/30 to-creator-to/30",
  },
  {
    title: "Grain Film Overlay",
    category: "Overlay",
    description: "Tekstur grain film klasik, dipakai buat gaya edit yang lebih moody.",
    badge: "Gratis",
    tags: ["Overlay", "Grain"],
    accent: "from-creator-from/30 to-creator-to/30",
  },
  {
    title: "Moody Tone Preset",
    category: "Preset Warna",
    description: "Preset warna moody, cocok buat konten dengan nuansa tenang & gelap.",
    badge: "Pro",
    tags: ["Warna", "Moody"],
    accent: "from-creator-from/30 to-creator-to/30",
  },
  {
    title: "Vibrant Pop Preset",
    category: "Preset Warna",
    description: "Preset warna cerah & saturasi tinggi, buat konten yang ceria dan pop.",
    badge: "Gratis",
    tags: ["Warna", "Vibrant"],
    accent: "from-creator-from/30 to-creator-to/30",
  },
];

const TUTORIALS = [
  {
    icon: BookOpen,
    title: "Penjelasan Dasar Editing",
    description:
      "Kenalan sama tools inti di Alight Motion — layer, keyframe, timeline — sebelum lanjut ke teknik yang lebih rumit.",
  },
  {
    icon: Spline,
    title: "Penggunaan Curva",
    description:
      "Cara buka & atur graph editor buat ngontrol kecepatan animasi antar keyframe biar gerakannya nggak kaku.",
  },
  {
    icon: Waves,
    title: "Perbedaan Animasi pada Curva",
    description:
      "Bedanya easing linear, ease in-out, sampai overshoot — dan kapan tiap gaya curva ini cocok dipakai.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function AssetThumb({ accent }) {
  return (
    <div
      className={cn(
        "relative h-28 w-full rounded-lg bg-gradient-to-br overflow-hidden",
        accent
      )}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <Sparkles className="absolute bottom-3 right-3 text-white/80" size={20} />
    </div>
  );
}

function BadgePill({ label }) {
  const isFree = label === "Gratis";
  return (
    <span
      className={cn(
        "shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border",
        isFree
          ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
          : "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
      )}
    >
      {label}
    </span>
  );
}

export default function CreatorAssetsPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredAssets = useMemo(() => {
    if (activeCategory === "Semua") return ASSETS;
    return ASSETS.filter((asset) => asset.category === activeCategory);
  }, [activeCategory]);

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
              { name: "Divisi Creator", link: "/divisi/creator" },
              { name: "Tentang", link: "/#tentang" },
            ],
          },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 sm:px-10 pt-28 pb-14 sm:pt-36 sm:pb-16">
        <div
          className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full blur-3xl opacity-25"
          style={{ background: "#00E5FF" }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full blur-3xl opacity-25"
          style={{ background: "#3D5AFE" }}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative max-w-2xl mx-auto text-center"
        >
          <Link
            href="/divisi/creator"
            className="inline-block font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted hover:text-ink transition-colors"
          >
            ← Divisi Creator
          </Link>
          <h1 className="font-display font-black text-4xl sm:text-6xl mt-4 bg-gradient-to-r from-creator-from to-creator-to bg-clip-text text-transparent">
            Assets & Template
          </h1>
          <p className="font-body font-normal text-base sm:text-lg text-ink-dim mt-4 max-w-xl mx-auto">
            Kumpulan animation text, transisi, overlay, dan preset warna buat
            Alight Motion. Tinggal pilih, buka, langsung pakai.
          </p>
        </motion.div>
      </section>

      {/* Filter kategori */}
      <section className="px-6 sm:px-10">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "text-xs sm:text-sm font-medium px-4 py-2 rounded-full border transition-colors",
                activeCategory === cat
                  ? "bg-ink-solid text-white dark:bg-white dark:text-ink-solid border-transparent"
                  : "border-black/10 dark:border-white/10 text-ink-muted hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid assets */}
      <section className="px-6 sm:px-10 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset, i) => (
            <motion.div
              key={asset.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <Card className="h-full flex flex-col overflow-hidden">
                <CardHeader className="p-3 pb-0">
                  <AssetThumb accent={asset.accent} />
                </CardHeader>
                <CardContent className="p-4 pt-3 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-base text-ink leading-snug">
                      {asset.title}
                    </h3>
                    <BadgePill label={asset.badge} />
                  </div>
                  <p className="text-sm text-ink-muted mt-1.5">{asset.category}</p>
                  <p className="text-xs text-ink-dim mt-2 leading-relaxed">
                    {asset.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {asset.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-black/10 dark:border-white/10 text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#"
                    className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-medium rounded-full px-4 py-2.5 bg-ink-solid text-white dark:bg-white dark:text-ink-solid hover:opacity-90 transition-opacity"
                  >
                    Buka Preset
                    <ArrowUpRight size={14} />
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tutorial dasar */}
      <section className="px-6 sm:px-10 py-16 sm:py-20 bg-base-elevated">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mb-10 text-center mx-auto"
          >
            <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
              Belajar Dulu
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 text-ink">
              Tutorial dasar Alight Motion
            </h2>
            <p className="text-sm text-ink-dim mt-3">
              Sebelum utak-atik assets di atas, ada baiknya paham dasar-dasar
              ini dulu.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TUTORIALS.map((tutorial, i) => {
              const Icon = tutorial.icon;
              return (
                <motion.div
                  key={tutorial.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Card className="h-full p-5">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center mb-4"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(61,90,254,0.15))",
                      }}
                    >
                      <Icon className="text-creator-to" size={20} />
                    </div>
                    <h3 className="font-display font-bold text-base text-ink">
                      {tutorial.title}
                    </h3>
                    <p className="text-sm text-ink-dim mt-2 leading-relaxed">
                      {tutorial.description}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink mt-4 transition-colors"
                    >
                      Baca selengkapnya
                      <ArrowUpRight size={12} />
                    </a>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA gabung */}
      <section className="px-6 sm:px-10 py-16 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <Layers className="mx-auto text-ink-dim" size={28} />
          <h2 className="font-display font-bold text-2xl sm:text-3xl mt-4 text-ink">
            Mau nambahin assets kamu sendiri?
          </h2>
          <p className="text-sm text-ink-dim mt-2">
            Gabung divisi Creator dan mulai kontribusi template Alight
            Motion buat komunitas.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Link href="/gabung">
              <Button className="rounded-full px-6 py-2.5 gap-1.5">
                <Type size={14} />
                Gabung Divisi Creator
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
