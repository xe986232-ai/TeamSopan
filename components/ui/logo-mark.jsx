"use client";

import { useId } from "react";
import { getLogoStyle } from "@/lib/logo-styles";

// Logo utama SOPAN TEAM -- 2 garis soundwave, warnanya gradient sesuai
// style yang dipilih admin di dashboard (app/dashboard/pengaturan).
// Dipakai di navbar publik (site-navbar.jsx) dan di picker dashboard
// (LogoStylePicker.jsx) supaya bentuknya konsisten di mana-mana.
//
// `useId()` dipakai buat bikin id <linearGradient> unik per instance --
// penting karena LogoMark bisa dirender berkali-kali di halaman yang sama
// (misal 5 swatch pilihan di dashboard), dan id SVG yang kebentrok bikin
// browser cuma render definisi gradient yang pertama ketemu buat semuanya.
export default function LogoMark({ styleId, size = 34, className = "" }) {
  const gradientId = useId();
  const style = getLogoStyle(styleId);
  const [from, to] = style.colors;

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
