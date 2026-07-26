"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { createPublicSupabaseClient } from "@/lib/supabase/client";
import { DEFAULT_HERO_TEXT_EFFECT } from "@/lib/hero-text-effects";

/**
 * BlurText — animasi reveal per kata/huruf dengan efek blur + fade + slide,
 * dipicu saat elemen masuk viewport (IntersectionObserver).
 */
function BlurText({
  text,
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  const segments = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  return (
    <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateY(0)"
              : `translateY(${direction === "top" ? "-20px" : "20px"})`,
            transition: `all 0.5s ease-out ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
}

// Foto Unsplash yang dipakai sebagai "isi" tekstur huruf SOPAN/TEAM —
// gambar-gambar ini gantian ditampilkan di dalam bentuk huruf (bukan warna
// solid), pakai teknik background-clip: text.
const HERO_TEXTURE_IMAGES = [
  "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=1400&q=80",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1400&q=80",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1400&q=80",
  "https://images.unsplash.com/photo-1636955779321-819753cd1741?w=1400&q=80",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1400&q=80",
  "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1400&q=80",
];

/**
 * TexturedText — versi "isi huruf pakai foto" dari nama hero (mirip
 * referensi: teks besar yang di dalamnya ada gambar, bukan warna polos).
 * Pakai background-clip: text supaya foto ke-crop persis bentuk hurufnya,
 * lalu foto-nya diganti bergantian tiap beberapa detik dengan crossfade
 * halus. Reveal pertama tetap nunggu section masuk viewport dulu.
 */
function TexturedText({
  text,
  images,
  className = "",
  style,
  cycleMs = 3200,
  offset = 0,
}) {
  const [inView, setInView] = useState(false);
  const [idx, setIdx] = useState(offset % images.length);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  useEffect(() => {
    if (!inView || images.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % images.length);
    }, cycleMs);
    return () => clearInterval(timer);
  }, [inView, images, cycleMs]);

  const letters = useMemo(() => text.split(""), [text]);

  return (
    <span ref={ref} className={`inline-flex flex-nowrap ${className}`} style={style}>
      {letters.map((ch, i) => {
        if (ch === " ") {
          return (
            <span key={i} aria-hidden="true" style={{ display: "inline-block", width: "0.35em" }} />
          );
        }
        // tiap huruf ambil foto BEDA dari array (index digeser per posisi
        // huruf), jadi hasilnya kayak referensi: satu huruf = satu foto,
        // bukan satu foto direntang ke seluruh kata.
        const img = images[(idx + i) % images.length];
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: "inline-block",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(-20px)",
              transition: `opacity 0.5s ease-out ${i * 60}ms, transform 0.5s ease-out ${i * 60}ms`,
            }}
          >
            <span
              key={i}
              className={`hero-texture-text${idx === offset % images.length ? " hero-texture-text-first-reveal" : ""}`}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {ch}
            </span>
          </span>
        );
      })}
      {/* Teks asli disembunyikan visual tapi tetap kebaca screen reader/SEO */}
      <span className="sr-only">{text}</span>
    </span>
  );
}

/**
 * SequentialTexturedText — effect kedua untuk teks nama hero: foto
 * "berjalan" satu huruf demi satu huruf secara berurutan (bukan semua
 * huruf gonta-ganti bareng seperti TexturedText). Huruf yang lagi
 * "dilewati" tampil bertekstur foto, huruf-huruf sebelumnya yang sudah
 * dilewati berubah jadi putih polos, dan huruf yang belum kelewatan
 * masih redup/samar. Sampai huruf terakhir, semua sempat putih penuh
 * sebentar, lalu mengulang dari awal lagi.
 */
function SequentialTexturedText({
  text,
  images,
  className = "",
  style,
  offset = 0,
  stepMs = 550,
  holdMs = 1800,
}) {
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  const letters = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    let timeoutId;
    let idx = 0;

    function tick() {
      if (cancelled) return;
      setActiveIndex(idx);
      if (idx < letters.length) {
        idx += 1;
        timeoutId = setTimeout(tick, stepMs);
      } else {
        // Sudah kelewatan semua huruf (semuanya putih sebentar), tahan
        // dulu baru ulang dari huruf pertama.
        timeoutId = setTimeout(() => {
          idx = 0;
          tick();
        }, holdMs);
      }
    }

    tick();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [inView, letters.length, stepMs, holdMs]);

  return (
    <span ref={ref} className={`inline-flex flex-nowrap ${className}`} style={style}>
      {letters.map((ch, i) => {
        if (ch === " ") {
          return (
            <span key={i} aria-hidden="true" style={{ display: "inline-block", width: "0.35em" }} />
          );
        }

        const isPassed = i < activeIndex;
        const isActive = i === activeIndex;
        const img = images[(offset + i) % images.length];

        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: "inline-block",
              position: "relative",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(-20px)",
              transition: `opacity 0.5s ease-out ${i * 40}ms, transform 0.5s ease-out ${i * 40}ms`,
            }}
          >
            {/* Layer dasar: warna huruf polos, transisi warnanya halus
                (bukan lompat) pas status berubah -- ini yang selalu
                kelihatan buat huruf yang belum/sudah dilewati. */}
            <span
              style={{
                color: isPassed ? "#FFFFFF" : "rgba(195, 228, 29, 0.28)",
              }}
            >
              {ch}
            </span>

            {/* Layer texture foto: switch instan (tanpa fade/transition) --
                huruf yang aktif langsung tampil bertekstur, yang lain
                langsung polos, sesuai permintaan "tanpa animasi fade". */}
            <span
              className="hero-texture-text-plain"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: isActive ? 1 : 0,
              }}
            >
              {ch}
            </span>
          </span>
        );
      })}
      {/* Teks asli disembunyikan visual tapi tetap kebaca screen reader/SEO */}
      <span className="sr-only">{text}</span>
    </span>
  );
}

/**
 * TexturedOutlineText — effect keempat: sama seperti TexturedText (semua
 * huruf ganti foto bareng-bareng dengan crossfade), tapi tiap huruf
 * dilapis garis outline di atas foto-nya (pakai -webkit-text-stroke)
 * biar bentuk hurufnya tetap kebaca jelas walau foto di dalamnya rame/
 * kontras rendah. Layer outline ini statis (nggak ikut ganti tiap foto
 * berubah) jadi nggak nambah kedipan baru.
 */
function TexturedOutlineText({
  text,
  images,
  className = "",
  style,
  cycleMs = 3200,
  offset = 0,
  isDark = true,
}) {
  const [inView, setInView] = useState(false);
  const [idx, setIdx] = useState(offset % images.length);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  useEffect(() => {
    if (!inView || images.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % images.length);
    }, cycleMs);
    return () => clearInterval(timer);
  }, [inView, images, cycleMs]);

  const letters = useMemo(() => text.split(""), [text]);
  const strokeColor = isDark ? "#FFFFFF" : "#1A1A1A";

  return (
    <span ref={ref} className={`inline-flex flex-nowrap ${className}`} style={style}>
      {letters.map((ch, i) => {
        if (ch === " ") {
          return (
            <span key={i} aria-hidden="true" style={{ display: "inline-block", width: "0.35em" }} />
          );
        }
        const img = images[(idx + i) % images.length];
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: "inline-block",
              position: "relative",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(-20px)",
              transition: `opacity 0.5s ease-out ${i * 60}ms, transform 0.5s ease-out ${i * 60}ms`,
            }}
          >
            {/* Layer foto -- key TIDAK berubah tiap foto ganti (cuma
                background-image-nya yang di-swap), jadi foto berpindah
                instan tanpa animasi blur/fade berulang, dan outline di
                atasnya selalu pas ngikutin bentuk huruf yang sama. */}
            <span
              key={i}
              className="hero-texture-text"
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {ch}
            </span>
            {/* Layer outline -- statis, isi huruf transparan (cuma
                garis pinggirnya kelihatan), duduk di atas layer foto
                supaya bentuk huruf tetap tegas. Lebar garis dibikin
                proporsional ke ukuran font raksasa (clamp), soalnya
                1.5px fix nyaris nggak kelihatan di font 190px. */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                color: "transparent",
                WebkitTextStroke: `clamp(1.5px, 0.14em, 3.5px) ${strokeColor}`,
                textStroke: `clamp(1.5px, 0.14em, 3.5px) ${strokeColor}`,
                pointerEvents: "none",
              }}
            >
              {ch}
            </span>
          </span>
        );
      })}
      {/* Teks asli disembunyikan visual tapi tetap kebaca screen reader/SEO */}
      <span className="sr-only">{text}</span>
    </span>
  );
}

/**
 * GlitchAvatar — logo/avatar muncul belakangan (setelah teks nama selesai
 * animasi), pakai efek "glitch masuk": jitter posisi + potongan clip-path
 * yang lompat-lompat + sedikit color-split (ghost cyan/magenta), lalu
 * settle rapi ke posisi normal. Durasi dibuat agak longgar (~1.1s) supaya
 * nggak berkesan buru-buru, dan trigger-nya nunggu elemen kelihatan di
 * viewport dulu (sama seperti BlurText).
 */
function GlitchAvatar({ avatarSrc }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative w-[60px] h-[100px] sm:w-[85px] sm:h-[140px] md:w-[105px] md:h-[170px] lg:w-[120px] lg:h-[195px] ${
        inView ? "hero-glitch-in" : "opacity-0"
      }`}
    >
      <div className="w-full h-full rounded-full overflow-hidden shadow-2xl bg-white flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer">
        <Image
          src={avatarSrc}
          alt="Logo Sopan Team"
          width={120}
          height={195}
          className="w-[70%] h-[70%] object-contain"
        />
      </div>
      {/* Ghost layer color-split — kesan "glitch" khas RGB shift */}
      <span
        aria-hidden
        className="hero-glitch-ghost hero-glitch-ghost-cyan"
        style={{ backgroundImage: `url(${avatarSrc})` }}
      />
      <span
        aria-hidden
        className="hero-glitch-ghost hero-glitch-ghost-magenta"
        style={{ backgroundImage: `url(${avatarSrc})` }}
      />
    </div>
  );
}

// Placeholder untuk koleksi gambar di background hero — nanti gampang diganti
// satu-satu (src-nya aja) begitu ada foto/karya asli dari tim. Disusun
// berjajar rapi (bukan nyebar acak) persis kayak referensi: satu baris,
// saling overlap dikit, tinggi selang-seling, tiap kartu dirotasi dikit.
const COLLAGE_ITEMS = [
  { src: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&q=80", rotate: -6, radius: 999, tall: true },
  { src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=80", rotate: 4, radius: 28, tall: false },
  { src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80", rotate: -5, radius: 999, tall: true },
  { src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&q=80", rotate: 6, radius: 24, tall: false },
  { src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80", rotate: -4, radius: 999, tall: true },
  { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80", rotate: 5, radius: 26, tall: false },
  { src: "https://images.unsplash.com/photo-1622428051717-dcd9ce313e69?w=400&q=80", rotate: -6, radius: 999, tall: true },
  { src: "https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?w=400&q=80", rotate: 4, radius: 22, tall: false },
  { src: "https://images.unsplash.com/photo-1636955779321-819753cd1741?w=400&q=80", rotate: -5, radius: 999, tall: true },
];

/**
 * HeroCollageBackground — satu baris kartu foto rapi di belakang teks hero,
 * saling overlap dikit dan tiap kartu dirotasi kecil biar nggak kaku, tapi
 * tetap tersusun berjajar (bukan nyebar acak) — muncul di semua ukuran
 * layar, ukurannya ngecil otomatis pas di HP. Ditutup gradasi hitam di atas
 * biar teks nama tetap kebaca jelas.
 */
function HeroCollageBackground({ isDark }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Baris kartu gambar, rapi & overlap */}
      <div className="absolute inset-0 flex items-center justify-center opacity-70 sm:opacity-80">
        <div className="flex items-center" style={{ marginLeft: "-3vw" }}>
          {COLLAGE_ITEMS.map((item, i) => (
            <div
              key={i}
              className="relative overflow-hidden shadow-2xl shrink-0"
              style={{
                width: "clamp(52px, 9vw, 130px)",
                height: item.tall
                  ? "clamp(80px, 13vw, 190px)"
                  : "clamp(60px, 9.5vw, 130px)",
                borderRadius: item.radius,
                transform: `rotate(${item.rotate}deg)`,
                marginLeft: "-3vw",
                zIndex: i,
              }}
            >
              <Image
                src={item.src}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gradasi hitam menutup gambar biar teks tetap fokus & kebaca */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.55) 100%), linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.75) 100%)"
            : "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(250,250,250,0.95) 0%, rgba(250,250,250,0.82) 45%, rgba(250,250,250,0.6) 100%), linear-gradient(to bottom, rgba(250,250,250,0.65) 0%, rgba(250,250,250,0.35) 30%, rgba(250,250,250,0.35) 70%, rgba(250,250,250,0.8) 100%)",
        }}
      />
    </div>
  );
}

/**
 * PortfolioHero — hero section bergaya "kartu nama digital": nama besar
 * tersusun 2 baris dengan foto/logo yang overlap di tengah, dan tagline
 * di bawah. Hanya visual hero — tidak membawa nav/menu sendiri, dipakai
 * di bawah <SiteNavbar /> yang sudah ada.
 */
export default function PortfolioHero({
  nameTop = "SOPAN",
  nameBottom = "TEAM",
  tagline = "Tiga divisi, satu wadah untuk berkarya bareng.",
  avatarSrc = "/sopan-logo-black.png",
  accentColor = "#C3E41D",
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  // Effect animasi teks nama — diatur admin dari /dashboard/pengaturan,
  // disimpan di kolom `hero_text_effect` tabel `site_settings`. Default
  // aman dipakai sambil nunggu data ke-fetch / kalau gagal ambil, jadi
  // tampilan situs yang sudah live tidak berubah sampai admin sengaja
  // ganti pilihannya.
  const [textEffect, setTextEffect] = useState(DEFAULT_HERO_TEXT_EFFECT);

  useEffect(() => {
    let active = true;
    const supabase = createPublicSupabaseClient();

    supabase
      .from("site_settings")
      .select("hero_text_effect")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("[PortfolioHero] Gagal ambil hero_text_effect:", error);
          return;
        }
        if (data?.hero_text_effect) setTextEffect(data.hero_text_effect);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className="relative min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] flex flex-col overflow-hidden transition-colors"
      style={{
        backgroundColor: isDark ? "#000000" : "#FAFAFA",
        color: isDark ? "#FFFFFF" : "#1A1A1A",
      }}
    >
      {/* Hero content — background moodboard dipasang scoped di sini aja
          (bukan di seluruh section) supaya nggak melorot nutupin tagline
          di bawahnya; jadi cuma nutupin area nama+logo, pas sampe situ. */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-16 overflow-hidden">
        <HeroCollageBackground isDark={isDark} />
        <div className="relative text-center">
          <div>
            {textEffect === "sequential" ? (
              <SequentialTexturedText
                text={nameTop}
                images={HERO_TEXTURE_IMAGES}
                offset={0}
                className="font-hero font-black text-[72px] sm:text-[120px] md:text-[160px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase whitespace-nowrap"
              />
            ) : textEffect === "outline" ? (
              <TexturedOutlineText
                text={nameTop}
                images={HERO_TEXTURE_IMAGES}
                offset={0}
                isDark={isDark}
                className="font-hero font-black text-[72px] sm:text-[120px] md:text-[160px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase whitespace-nowrap"
              />
            ) : textEffect === "static" ? (
              <BlurText
                text={nameTop}
                delay={80}
                animateBy="letters"
                direction="top"
                className="font-hero font-black text-[72px] sm:text-[120px] md:text-[160px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase justify-center whitespace-nowrap"
                style={{ color: accentColor }}
              />
            ) : (
              <TexturedText
                text={nameTop}
                images={HERO_TEXTURE_IMAGES}
                offset={0}
                className="font-hero font-black text-[72px] sm:text-[120px] md:text-[160px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase whitespace-nowrap"
              />
            )}
          </div>
          <div>
            {textEffect === "sequential" ? (
              <SequentialTexturedText
                text={nameBottom}
                images={HERO_TEXTURE_IMAGES}
                offset={2}
                className="font-hero font-black text-[72px] sm:text-[120px] md:text-[160px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase whitespace-nowrap"
              />
            ) : textEffect === "outline" ? (
              <TexturedOutlineText
                text={nameBottom}
                images={HERO_TEXTURE_IMAGES}
                offset={2}
                isDark={isDark}
                className="font-hero font-black text-[72px] sm:text-[120px] md:text-[160px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase whitespace-nowrap"
              />
            ) : textEffect === "static" ? (
              <BlurText
                text={nameBottom}
                delay={80}
                animateBy="letters"
                direction="top"
                className="font-hero font-black text-[72px] sm:text-[120px] md:text-[160px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase justify-center whitespace-nowrap"
                style={{ color: accentColor }}
              />
            ) : (
              <TexturedText
                text={nameBottom}
                images={HERO_TEXTURE_IMAGES}
                offset={2}
                className="font-hero font-black text-[72px] sm:text-[120px] md:text-[160px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase whitespace-nowrap"
              />
            )}
          </div>

          {/* Avatar / logo overlap — masuk belakangan dengan animasi glitch */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <GlitchAvatar avatarSrc={avatarSrc} />
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="relative pb-10 sm:pb-14 md:pb-16 px-6">
        <div className="flex justify-center">
          <BlurText
            text={tagline}
            delay={120}
            animateBy="words"
            direction="top"
            className="font-body text-[14px] sm:text-[17px] md:text-[19px] lg:text-[21px] text-center transition-colors duration-300 max-w-xl"
            style={{ color: isDark ? "#A3A3A3" : "#525252" }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#tentang"
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 transition-colors duration-300 text-neutral-500 hover:text-black dark:hover:text-white"
        aria-label="Scroll ke bawah"
      >
        <ChevronDown className="w-5 h-5 md:w-8 md:h-8 animate-bounce" />
      </a>
    </section>
  );
}

// Diekspor supaya bisa dipakai bikin preview mini live di
// app/dashboard/pengaturan/HeroTextEffectPicker.jsx — biar admin lihat
// dulu masing-masing effect sebelum simpan pilihan, tanpa harus buka tab
// baru ke /preview-hero.
export { TexturedText, SequentialTexturedText, TexturedOutlineText, BlurText, HERO_TEXTURE_IMAGES };
