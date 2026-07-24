"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { getLogoStyle, getOrbGradients } from "@/lib/logo-styles";

// Logo utama SOPAN TEAM -- render 2 bentuk pilihan (lihat lib/logo-styles.js):
// - "orb": blob bulat memutar + huruf "S" (desain original/lama)
// - "soundwave": 2 garis gradient polos (desain baru, default)
// Warnanya (gradient) sama-sama datang dari style yang dipilih admin di
// dashboard (app/dashboard/pengaturan). Dipakai di navbar publik
// (site-navbar.jsx), banner-nya sendiri tidak pakai logo, dan di picker
// dashboard (LogoStylePicker.jsx) supaya tampilannya konsisten di mana-mana.

const BLOB_RADIUS_KEYFRAMES = [
  "60% 40% 55% 45% / 50% 60% 40% 50%",
  "45% 55% 40% 60% / 55% 45% 60% 40%",
  "55% 45% 60% 40% / 45% 55% 45% 55%",
  "60% 40% 55% 45% / 50% 60% 40% 50%",
];

function OrbMark({ colors, size, className }) {
  const { outer, inner } = getOrbGradients(colors);

  return (
    <span
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.span
        animate={{
          borderRadius: BLOB_RADIUS_KEYFRAMES,
          scale: [1, 1.08, 0.95, 1],
          background: outer,
        }}
        transition={{
          borderRadius: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          background: { duration: 0.5, ease: "easeInOut" },
        }}
        className="absolute inset-0 blur-md opacity-80"
      />
      <motion.span
        animate={{
          borderRadius: BLOB_RADIUS_KEYFRAMES,
          background: inner,
        }}
        transition={{
          borderRadius: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          background: { duration: 0.5, ease: "easeInOut" },
        }}
        className="relative h-full w-full flex items-center justify-center text-white font-black overflow-hidden"
        style={{ fontSize: size * 0.42 }}
      >
        S
      </motion.span>
    </span>
  );
}

// `useId()` dipakai buat bikin id <linearGradient> unik per instance --
// penting karena LogoMark bisa dirender berkali-kali di halaman yang sama
// (misal swatch pilihan di dashboard), dan id SVG yang kebentrok bikin
// browser cuma render definisi gradient yang pertama ketemu buat semuanya.
function SoundwaveMark({ colors, size, className }) {
  const gradientId = useId();
  const [from, to] = colors;

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      aria-label="Logo Sopan Team"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        d="M5,20 Q10,5 20,20 T35,20"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M5,25 Q10,10 20,25 T35,25"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export default function LogoMark({ styleId, shape = "soundwave", size = 34, className = "" }) {
  const style = getLogoStyle(styleId);

  if (shape === "orb") {
    return <OrbMark colors={style.colors} size={size} className={className} />;
  }
  return <SoundwaveMark colors={style.colors} size={size} className={className} />;
}
