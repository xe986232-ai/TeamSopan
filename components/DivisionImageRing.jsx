"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Karya tiap divisi ditampilkan berputar di ring 3D ini. Foto masih
// placeholder Unsplash (pola sama seperti AdminSection) -- gampang diganti
// ke foto karya asli tim kapan saja.
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

const CARD_WIDTH = 190; // px
const CARD_ASPECT = 4 / 5;
const AUTO_SPEED_DEG_PER_SEC = 10; // kecepatan putaran otomatis
const DRAG_SENSITIVITY = 0.35; // derajat per px geser mouse/touch

export default function DivisionImageRing() {
  const n = SLIDES.length;
  // Jari-jari ring dihitung dari lebar kartu, biar tiap kartu pas nempel
  // membentuk lingkaran tanpa saling tabrakan -- dihitung di JS (bukan
  // pakai CSS trig function `tan()`) supaya kompatibel di browser lama.
  const radius = Math.round(CARD_WIDTH / 2 / Math.tan(Math.PI / n));

  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const tick = (time) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (!draggingRef.current && !pausedRef.current) {
        rotationRef.current += AUTO_SPEED_DEG_PER_SEC * dt;
        setRotation(rotationRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handlePointerDown = useCallback((e) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    rotationRef.current += dx * DRAG_SENSITIVITY;
    setRotation(rotationRef.current);
  }, []);

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
            Muter otomatis -- atau geser langsung buat lihat-lihat sendiri.
          </p>
        </motion.div>

        <div
          className="relative mx-auto grid place-items-center touch-pan-y select-none"
          style={{ height: "min(60vw, 340px)", perspective: "1200px" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerLeave={stopDragging}
          onPointerCancel={stopDragging}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          role="group"
          aria-label="Galeri karya divisi, geser untuk memutar"
        >
          <div
            className="relative cursor-grab active:cursor-grabbing"
            style={{
              width: CARD_WIDTH,
              aspectRatio: CARD_ASPECT,
              transformStyle: "preserve-3d",
              transform: `rotateY(${rotation}deg)`,
            }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className="absolute inset-0 overflow-hidden rounded-2xl border border-black/10 shadow-xl"
                style={{
                  transform: `rotateY(${(360 / n) * i}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <Image
                  alt={slide.title}
                  src={slide.image}
                  fill
                  sizes="190px"
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
                <div className="absolute inset-x-0 bottom-0 p-3 pointer-events-none">
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
