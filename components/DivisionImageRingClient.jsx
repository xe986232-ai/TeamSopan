"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { StarButton } from "./ui/star-button";

// clamp() berbasis vw supaya di layar mobile yang sempit kartu-nya ikut
// membesar (nggak keliatan kekecilan). Preferred value 55vw dibikin lebih
// agresif dari sebelumnya biar kartu keliatan lebih gede & lebih maju ke
// depan, dibatasi minimum/maksimum biar tetap wajar di semua ukuran device.
const CARD_WIDTH = "clamp(11.5em, 55vw, 15em)";
const CARD_ASPECT = "7/10";
// Tetap dijaga rasio ~2:1 terhadap CARD_WIDTH (pakai clamp yang selaras)
// biar efek menekuk ke dalam konsisten di semua ukuran layar.
const PERSPECTIVE = "clamp(23em, 110vw, 30em)";
const DURATION = 30; // detik untuk satu putaran penuh 360 derajat

// Kartu untuk slot yang belum kepakai member asli. SENGAJA tidak menampilkan
// nama/foto member palsu -- cuma logo Sopan Team di atas background solid
// warna divisi (bukan gradient), jadi jelas ini "slot tersedia", bukan member
// beneran. Begitu member baru daftar, slot ini otomatis kegantiin kartu
// member asli (lihat DivisionImageRing.jsx).
function DefaultSlotCard({ slide }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: slide.from }}
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-md">
          <Image
            alt="Sopan Team"
            src="/sopan-logo-black.png"
            width={26}
            height={33}
          />
        </span>
        <span
          className="inline-block font-accent text-[9px] font-semibold uppercase tracking-widest text-white px-1.5 py-0.5 rounded-full"
          style={{ background: slide.from }}
        >
          {slide.division}
        </span>
        <p className="font-body font-semibold text-[11px] text-white/90 text-center leading-snug">
          Slot Tersedia
        </p>
      </div>
    </>
  );
}

function MemberSlotCard({ slide }) {
  return (
    <>
      <Image
        alt={slide.name}
        src={slide.avatarUrl}
        fill
        unoptimized
        sizes="(max-width: 640px) 55vw, 240px"
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
          style={{ background: slide.from }}
        >
          {slide.division}
        </span>
        <p className="font-body font-semibold text-[11px] text-white leading-snug">
          {slide.name}
        </p>
      </div>
    </>
  );
}

// Komponen ini murni presentasional -- daftar slide (member asli + slot
// default kalau member aktif belum banyak) sudah disiapkan di server
// (lihat DivisionImageRing.jsx).
export default function DivisionImageRingClient({ slides, activeCount = 0 }) {
  const n = slides.length;
  const prefersReducedMotion = useReducedMotion();
  // Kalau user minta reduced motion, tetap muter tapi jauh lebih pelan --
  // bukan berhenti total, biar kontennya (member tim) tetap kelihatan semua.
  const animationDuration = prefersReducedMotion ? DURATION * 4 : DURATION;

  return (
    <section className="relative bg-base py-10 sm:py-14 overflow-hidden">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center mb-6"
        >
          <p className="font-body font-semibold text-sm tracking-widest text-pink-500 uppercase">
            Member Area
          </p>
          <h2 className="font-display font-extrabold mt-2 text-3xl text-ink sm:text-4xl">
            Wajah-Wajah di Balik Sopan Team
          </h2>
          <p className="font-body text-sm text-ink-muted mt-3">
            {activeCount > 0
              ? `${activeCount} member aktif dari tiga divisi kami: Remix, Creator, dan Leadis.`
              : "Kumpulan member aktif dari tiga divisi kami: Remix, Creator, dan Leadis."}
          </p>
        </motion.div>

        {n > 0 && (
          <div
            className="grid w-full place-items-center overflow-hidden select-none"
            style={{
              height: "clamp(220px, 90vw, 380px)",
              perspective: PERSPECTIVE,
              // Vignette fade di kiri-kanan biar ring blend mulus ke
              // background, bukan keliatan ke-crop tajam.
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
              maskImage:
                "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            }}
            role="group"
            aria-label="Foto member Sopan Team, berputar otomatis"
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
              {slides.map((slide, i) => (
                <div
                  key={slide.id}
                  className="col-start-1 row-start-1 relative overflow-hidden rounded-2xl border border-black/10 shadow-xl"
                  style={{
                    width: CARD_WIDTH,
                    aspectRatio: CARD_ASPECT,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: `rotateY(calc(${i} * (1turn / ${n}))) translateZ(calc(-1 * (0.5 * ${CARD_WIDTH} + 0.5em) / tan(0.5 * (1turn / ${n}))))`,
                  }}
                >
                  {slide.isPlaceholder ? (
                    <DefaultSlotCard slide={slide} />
                  ) : (
                    <MemberSlotCard slide={slide} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center mt-8"
        >
          <Link href="/anggota">
            <StarButton backgroundColor="#EC4899" lightColor="#FAFAFA">
              Lihat Semua Member
            </StarButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
