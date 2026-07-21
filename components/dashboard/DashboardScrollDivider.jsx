"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// Pemisah tipis antara background sidebar & konten utama — bukan cuma
// gap kosong, tapi kapsul track vertikal dengan "thumb" hitam yang ikut
// gerak sesuai posisi scroll halaman. Referensi: celah di sisi nav pada
// desain mobile amocreative.com yang menampilkan bar hitam tipis serupa.
export default function DashboardScrollDivider() {
  const { scrollYProgress } = useScroll();

  // Spring biar gerakannya halus, gak kaku ngikutin scroll mentah-mentah.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.3,
  });

  // Thumb bergerak dari atas (0%) ke bawah track (82%, karena tingginya
  // sendiri 18% dari track supaya gak pernah keluar batas bawah).
  const thumbTop = useTransform(smoothProgress, [0, 1], ["0%", "82%"]);

  return (
    <div aria-hidden className="flex w-[3px] shrink-0 self-stretch py-1">
      <div className="relative w-full rounded-full bg-black/10 overflow-hidden">
        <motion.div
          style={{ top: thumbTop }}
          className="absolute left-0 w-full h-[18%] rounded-full bg-black/70"
        />
      </div>
    </div>
  );
}
