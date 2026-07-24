"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

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

  return (
    <section
      className="relative min-h-[70vh] sm:min-h-screen flex flex-col overflow-hidden transition-colors"
      style={{
        backgroundColor: isDark ? "#000000" : "#FAFAFA",
        color: isDark ? "#FFFFFF" : "#1A1A1A",
      }}
    >
      {/* Background moodboard acak + gradasi */}
      <HeroCollageBackground isDark={isDark} />

      {/* Hero content */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-16">
        <div className="relative text-center">
          <div>
            <BlurText
              text={nameTop}
              delay={80}
              animateBy="letters"
              direction="top"
              className="font-hero font-black text-[72px] sm:text-[120px] md:text-[160px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase justify-center whitespace-nowrap"
              style={{ color: accentColor }}
            />
          </div>
          <div>
            <BlurText
              text={nameBottom}
              delay={80}
              animateBy="letters"
              direction="top"
              className="font-hero font-black text-[72px] sm:text-[120px] md:text-[160px] lg:text-[190px] leading-[0.8] tracking-tighter uppercase justify-center whitespace-nowrap"
              style={{ color: accentColor }}
            />
          </div>

          {/* Avatar / logo overlap */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-[60px] h-[100px] sm:w-[85px] sm:h-[140px] md:w-[105px] md:h-[170px] lg:w-[120px] lg:h-[195px] rounded-full overflow-hidden shadow-2xl bg-white flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer">
              <Image
                src={avatarSrc}
                alt="Logo Sopan Team"
                width={120}
                height={195}
                className="w-[70%] h-[70%] object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="relative pb-16 sm:pb-20 md:pb-24 px-6">
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
