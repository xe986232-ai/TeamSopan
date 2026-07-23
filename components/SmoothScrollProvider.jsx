"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Smooth scroll global pakai Lenis. Tetap jalan di atas native scroll
// (position: sticky, anchor link, dsb tetap normal) — cuma bikin momentum
// scroll-nya lebih "berat"/halus, bukan patah-patah kayak scroll native.
//
// Elemen dengan scroll internal sendiri (modal, sidebar, dropdown) dikasih
// atribut `data-lenis-prevent` biar nggak ikut di-handle Lenis.
export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    // Hormati preferensi user yang nyalain "reduced motion" di OS/browser.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return children;
}
