"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

// Karya tiap divisi ditampilkan berputar di ring 3D ini. Foto masih
// placeholder Unsplash (pola sama seperti AdminSection) -- gampang diganti
// ke foto karya asli tim kapan saja. Sengaja dibuat 12 slide (bukan cuma
// 6) supaya lengkungan ring-nya halus dan beberapa kartu kelihatan
// sekaligus dari depan, bukan cuma 2 kartu doang.
const BASE_SLIDES = [
  {
    id: "remix-1",
    division: "Remix",
    title: "Sesi produksi & mixing",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=500",
    from: "#B026FF",
    to: "#FF2E92",
  },
  {
    id: "creator-1",
    division: "Creator",
    title: "Proses edit jedag-jedug",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=500",
    from: "#00E5FF",
    to: "#3D5AFE",
  },
  {
    id: "leadis-1",
    division: "Leadis",
    title: "Konten para kreator cewek",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=500",
    from: "#FFD166",
    to: "#FF6FB5",
  },
  {
    id: "remix-2",
    division: "Remix",
    title: "Studio & sound design",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=500",
    from: "#B026FF",
    to: "#FF2E92",
  },
  {
    id: "creator-2",
    division: "Creator",
    title: "Behind the scene shooting",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500",
    from: "#00E5FF",
    to: "#3D5AFE",
  },
  {
    id: "leadis-2",
    division: "Leadis",
    title: "Kolaborasi showcase",
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=500",
    from: "#FFD166",
    to: "#FF6FB5",
  },
];

// Digandakan jadi 12 kartu (2x putaran list) biar spasi antar kartu di
// ring cuma 30 derajat -- itu yang bikin lengkungannya halus.
const SLIDES = [...BASE_SLIDES, ...BASE_SLIDES];

const CARD_WIDTH = "9.5em"; // ~150px, dipakai juga di rumus translateZ di bawah
const CARD_ASPECT = "7/10";
const PERSPECTIVE = "19em"; // ~2x CARD_WIDTH -- rasio ini yang bikin kartu pinggir menekuk tajam ke dalam
const DURATION = 30; // detik untuk satu putaran penuh 360 derajat

export default function DivisionImageRing() {
  const n = SLIDES.length;
  const prefersReducedMotion = useReducedMotion();
  // Kalau user minta reduced motion, tetap muter tapi jauh lebih pelan --
  // bukan berhenti total, biar kontennya (karya tim) tetap kelihatan semua.
  const animationDuration = prefersReducedMotion ? DURATION * 4 : DURATION;

  return (
    <section className="relative bg-base py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <p className="font-body font-semibold text-sm tracking-widest text-pink-500 uppercase">
            Galeri Karya
          </p>
          <h2 className="font-display font-extrabold mt-2 text-3xl text-ink sm:text-4xl">
            Sekilas Proses di Balik Layar
          </h2>
          <p className="font-body text-sm text-ink-muted mt-3">
            Muter otomatis 360 derajat nonstop.
          </p>
        </motion.div>

        <div
          className="grid w-full place-items-center overflow-hidden select-none"
          style={{
            height: "min(85vw, 380px)",
            perspective: PERSPECTIVE,
            // Vignette fade di kiri-kanan biar ring blend mulus ke
            // background, bukan keliatan ke-crop tajam.
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            maskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          }}
          role="group"
          aria-label="Galeri karya divisi, berputar otomatis"
        >
          <motion.div
            className="grid place-self-center"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: [0, 360] }}
            transition={{
              duration: animationDuration,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={`${slide.id}-${i}`}
                className="col-start-1 row-start-1 relative overflow-hidden rounded-2xl border border-black/10 shadow-xl"
                style={{
                  width: CARD_WIDTH,
                  aspectRatio: CARD_ASPECT,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: `rotateY(calc(${i} * (1turn / ${n}))) translateZ(calc(-1 * (0.5 * ${CARD_WIDTH} + 0.5em) / tan(0.5 * (1turn / ${n}))))`,
                }}
              >
                <Image
                  alt={slide.title}
                  src={slide.image}
                  fill
                  sizes="150px"
                  draggable={false}
                  className="object-cover pointer-events-none"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.05) 55%, transparent)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-2.5 pointer-events-none">
                  <span
                    className="inline-block font-accent text-[9px] font-semibold uppercase tracking-widest text-white px-1.5 py-0.5 rounded-full mb-1"
                    style={{
                      background: `linear-gradient(90deg, ${slide.from}, ${slide.to})`,
                    }}
                  >
                    {slide.division}
                  </span>
                  <p className="font-body font-semibold text-[11px] text-white leading-snug">
                    {slide.title}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
