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
