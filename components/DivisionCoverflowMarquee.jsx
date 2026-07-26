"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Karya tiap divisi mengalir di coverflow ini. Foto masih placeholder
// Unsplash (pola sama seperti AdminSection) -- gampang diganti ke foto
// karya asli tim kapan saja.
const SLIDES = [
  {
    id: "remix-1",
    division: "Remix",
    title: "Sesi produksi & mixing",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600",
    from: "#B026FF",
    to: "#FF2E92",
  },
  {
    id: "creator-1",
    division: "Creator",
    title: "Proses edit jedag-jedug",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
    from: "#00E5FF",
    to: "#3D5AFE",
  },
  {
    id: "leadis-1",
    division: "Leadis",
    title: "Konten para kreator cewek",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600",
    from: "#FFD166",
    to: "#FF6FB5",
  },
  {
    id: "remix-2",
    division: "Remix",
    title: "Studio & sound design",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=600",
    from: "#B026FF",
    to: "#FF2E92",
  },
  {
    id: "creator-2",
    division: "Creator",
    title: "Behind the scene shooting",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
    from: "#00E5FF",
    to: "#3D5AFE",
  },
  {
    id: "leadis-2",
    division: "Leadis",
    title: "Kolaborasi showcase",
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600",
    from: "#FFD166",
    to: "#FF6FB5",
  },
];

const CARD_WIDTH = 220; // px
const CARD_GAP = 32; // px
const SPACING = CARD_WIDTH + CARD_GAP;
const REPEAT = 5; // berapa kali list digandakan biar loop-nya mulus tanpa putus
const AUTO_SPEED = 34; // px per detik
const DRAG_SENSITIVITY = 1.1;
const CURVE_RANGE = 460; // px jarak dari tengah sampai rotasi maksimum
const MAX_ROTATE = 52; // derajat
const MAX_TRANSLATE_Z = 240; // px, seberapa jauh kartu mundur ke belakang

export default function DivisionCoverflowMarquee() {
  const n = SLIDES.length;
  const loopWidth = n * SPACING;
  const items = useMemo(
    () => Array.from({ length: n * REPEAT }, (_, i) => SLIDES[i % n]),
    [n]
  );
  // Titik tengah strip yang sudah digandakan, dipakai buat nge-center
  // seluruh susunan kartu relatif ke titik (0,0) container.
  const stripCenterOffset = (items.length * SPACING) / 2 - SPACING / 2;

  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const tick = (time) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (!draggingRef.current && !pausedRef.current) {
        let next = offsetRef.current + AUTO_SPEED * dt;
        next = ((next % loopWidth) + loopWidth) % loopWidth;
        offsetRef.current = next;
        setOffset(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loopWidth]);

  const handlePointerDown = useCallback((e) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      let next = offsetRef.current - dx * DRAG_SENSITIVITY;
      next = ((next % loopWidth) + loopWidth) % loopWidth;
      offsetRef.current = next;
      setOffset(next);
    },
    [loopWidth]
  );

  const stopDragging = useCallback(() => {
    draggingRef.current = false;
  }, []);

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
            Mengalir otomatis -- geser kapan aja buat lihat-lihat sendiri.
          </p>
        </motion.div>

        <div
          className="relative mx-auto overflow-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing"
          style={{ height: "min(72vw, 380px)", perspective: "1400px" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerLeave={stopDragging}
          onPointerCancel={stopDragging}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          role="group"
          aria-label="Galeri karya divisi, geser untuk menjelajah"
        >
          <div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {items.map((slide, i) => {
              const rawX = i * SPACING - offset - stripCenterOffset;
              const absX = Math.abs(rawX);

              // Skip render kartu yang jauh di luar layar biar hemat.
              if (absX > CURVE_RANGE + 400) return null;

              const clampedRatio = Math.min(absX / CURVE_RANGE, 1);
              const rotateY = -Math.sign(rawX) * clampedRatio * MAX_ROTATE;
              const translateZ = -clampedRatio * MAX_TRANSLATE_Z;
              const scale = 1 - clampedRatio * 0.32;
              const opacity = Math.max(1 - absX / (CURVE_RANGE + 260), 0);

              return (
                <div
                  key={`${slide.id}-${i}`}
                  className="absolute top-1/2 left-1/2 overflow-hidden rounded-2xl border border-black/10 shadow-xl"
                  style={{
                    width: CARD_WIDTH,
                    aspectRatio: "4 / 5",
                    transform: `translate(-50%, -50%) translateX(${rawX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex: Math.round(1000 - absX),
                    pointerEvents: absX < CARD_WIDTH ? "auto" : "none",
                  }}
                >
                  <Image
                    alt={slide.title}
                    src={slide.image}
                    fill
                    sizes="220px"
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
                  <div className="absolute inset-x-0 bottom-0 p-3.5 pointer-events-none">
                    <span
                      className="inline-block font-accent text-[10px] font-semibold uppercase tracking-widest text-white px-2 py-0.5 rounded-full mb-1.5"
                      style={{
                        background: `linear-gradient(90deg, ${slide.from}, ${slide.to})`,
                      }}
                    >
                      {slide.division}
                    </span>
                    <p className="font-body font-semibold text-xs text-white leading-snug">
                      {slide.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
