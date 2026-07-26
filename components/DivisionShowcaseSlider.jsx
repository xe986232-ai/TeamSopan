"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Karya tiap divisi ditampilkan bergantian di slider 3D ini. Foto masih
// placeholder Unsplash (sama seperti AdminSection) -- gampang diganti ke
// foto karya asli tim kapan saja.
const SLIDES = [
  {
    id: "remix-1",
    division: "Remix",
    title: "Sesi produksi & mixing",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
    from: "#B026FF",
    to: "#FF2E92",
  },
  {
    id: "creator-1",
    division: "Creator",
    title: "Proses edit jedag-jedug",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
    from: "#00E5FF",
    to: "#3D5AFE",
  },
  {
    id: "leadis-1",
    division: "Leadis",
    title: "Konten para kreator cewek",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
    from: "#FFD166",
    to: "#FF6FB5",
  },
  {
    id: "remix-2",
    division: "Remix",
    title: "Studio & sound design",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800",
    from: "#B026FF",
    to: "#FF2E92",
  },
  {
    id: "creator-2",
    division: "Creator",
    title: "Behind the scene shooting",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    from: "#00E5FF",
    to: "#3D5AFE",
  },
];

// Seberapa jauh (dalam jumlah kartu) sebuah slide masih dirender sebelum
// disembunyikan total -- biar transisi tetap mulus pas geser cepat.
const MAX_VISIBLE_OFFSET = 2;

export default function DivisionShowcaseSlider() {
  const [active, setActive] = useState(0);

  const goTo = (index) => {
    const next = (index + SLIDES.length) % SLIDES.length;
    setActive(next);
  };

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
        </motion.div>

        {/* Panggung 3D -- perspective bikin kartu di kiri/kanan kelihatan
            berputar menjauh dari kamera, bukan cuma geser datar. */}
        <div
          className="relative mx-auto flex items-center justify-center"
          style={{ perspective: "1400px", height: "min(70vw, 420px)" }}
        >
          {SLIDES.map((slide, index) => {
            let offset = index - active;
            // Bikin loop terasa "wrap around" lewat jalur terpendek.
            if (offset > SLIDES.length / 2) offset -= SLIDES.length;
            if (offset < -SLIDES.length / 2) offset += SLIDES.length;

            const isActive = offset === 0;
            const absOffset = Math.abs(offset);
            const isVisible = absOffset <= MAX_VISIBLE_OFFSET;

            return (
              <motion.button
                key={slide.id}
                type="button"
                aria-label={`Lihat karya: ${slide.title}`}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => goTo(index)}
                className="absolute top-1/2 left-1/2 w-[210px] sm:w-[260px] rounded-2xl overflow-hidden shadow-2xl border border-black/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  aspectRatio: "4 / 5",
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  x: "-50%",
                  y: "-50%",
                  translateX: offset * (isActive ? 0 : 150) + offset * 60,
                  rotateY: offset * -35,
                  scale: isActive ? 1 : 0.78,
                  opacity: isVisible ? (isActive ? 1 : 0.45) : 0,
                  zIndex: 10 - absOffset,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              >
                <Image
                  alt={slide.title}
                  src={slide.image}
                  fill
                  sizes="(min-width: 640px) 260px, 210px"
                  className="object-cover pointer-events-none"
                  priority={isActive}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.1) 55%, transparent)",
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 p-4 text-left pointer-events-none">
                  <span
                    className="inline-block font-accent text-[11px] font-semibold uppercase tracking-widest text-white px-2.5 py-1 rounded-full mb-2"
                    style={{
                      background: `linear-gradient(90deg, ${slide.from}, ${slide.to})`,
                    }}
                  >
                    {slide.division}
                  </span>
                  <p className="font-body font-semibold text-sm text-white leading-snug">
                    {slide.title}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Kontrol navigasi */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Karya sebelumnya"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-base-line text-ink transition-colors hover:bg-base-elevated focus:outline-none focus-visible:ring-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ke karya ${index + 1}`}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: index === active ? "22px" : "8px",
                  background:
                    index === active
                      ? `linear-gradient(90deg, ${slide.from}, ${slide.to})`
                      : "rgb(var(--base-line))",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Karya berikutnya"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-base-line text-ink transition-colors hover:bg-base-elevated focus:outline-none focus-visible:ring-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
