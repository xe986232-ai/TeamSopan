"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useOutsideClick } from "@/hooks/use-outside-click";

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

/**
 * PortfolioHero — hero section bergaya "kartu nama digital": nama besar
 * tersusun 2 baris dengan foto/logo yang overlap di tengah, tagline di
 * bawah, menu dropdown minimal di kiri atas, dan toggle tema di kanan atas.
 *
 * Dipakai berdiri sendiri (tidak menggantikan Hero.jsx utama) — cocok untuk
 * halaman profil divisi atau landing alternatif yang butuh nuansa lebih
 * personal/portfolio-like.
 */
export default function PortfolioHero({
  nameTop = "SOPAN",
  nameBottom = "TEAM",
  tagline = "Tiga divisi, satu wadah untuk berkarya bareng.",
  avatarSrc = "/sopan-logo-black.png",
  menuItems = [
    { label: "BERANDA", href: "#top", highlight: true },
    { label: "TENTANG", href: "#tentang" },
    { label: "DIVISI", href: "#divisi" },
    { label: "KARYA", href: "#karya" },
    { label: "KETENTUAN", href: "/ketentuan" },
    { label: "PRIVASI", href: "/privasi" },
  ],
  accentColor = "#C3E41D",
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useOutsideClick(menuRef, () => setIsMenuOpen(false));

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <section
      className="relative min-h-[70vh] sm:min-h-screen flex flex-col overflow-hidden transition-colors"
      style={{
        backgroundColor: isDark ? "#000000" : "#FAFAFA",
        color: isDark ? "#FFFFFF" : "#1A1A1A",
      }}
    >
      {/* Header */}
      <header className="relative z-40 px-6 py-6">
        <nav className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Menu button + dropdown */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              className="p-2 transition-colors duration-300 text-neutral-500 hover:text-black dark:hover:text-white"
              aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              {isMenuOpen ? (
                <X className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
              ) : (
                <Menu className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
              )}
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute top-full left-0 w-[200px] md:w-[240px] shadow-2xl mt-2 ml-1 p-4 rounded-lg z-50"
                style={{ backgroundColor: isDark ? "#0A0A0A" : "#FAFAFA" }}
              >
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-base md:text-lg font-bold tracking-tight py-1.5 px-2 cursor-pointer transition-colors duration-300"
                    style={{
                      color: item.highlight
                        ? accentColor
                        : isDark
                        ? "#FFFFFF"
                        : "#1A1A1A",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = accentColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = item.highlight
                        ? accentColor
                        : isDark
                        ? "#FFFFFF"
                        : "#1A1A1A";
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Mark / signature */}
          <div
            className="text-3xl sm:text-4xl italic"
            style={{ fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive" }}
          >
            S
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative w-14 h-7 sm:w-16 sm:h-8 rounded-full hover:opacity-80 transition-opacity"
            style={{ backgroundColor: isDark ? "#262626" : "#E5E5E5" }}
            aria-label="Ganti tema"
          >
            <div
              className="absolute top-1 left-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-transform duration-300"
              style={{
                backgroundColor: isDark ? "#FFFFFF" : "#1A1A1A",
                transform: isDark
                  ? "translateX(1.75rem)"
                  : "translateX(0)",
              }}
            />
          </button>
        </nav>
      </header>

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
