"use client";

import { motion } from "framer-motion";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const SHOWCASE = [
  {
    quote:
      "Remix terbaru divisi ini dipakai buat closing set komunitas lokal — respon-nya di luar ekspektasi.",
    name: "Divisi Remix",
    title: "Karya Terbaru",
  },
  {
    quote:
      "Edit video event kemarin selesai dalam waktu singkat, tapi transisi dan color grading-nya tetap rapi.",
    name: "Divisi Creator",
    title: "Karya Terbaru",
  },
  {
    quote:
      "Sesi showcase pertama Leadis berhasil narik banyak perhatian — jadi pemantik buat konten berikutnya.",
    name: "Divisi Leadis",
    title: "Karya Terbaru",
  },
  {
    quote:
      "Kolaborasi lintas divisi pertama: musik dari Remix, visual dari Creator, dibawakan oleh Leadis.",
    name: "SOPAN TEAM",
    title: "Kolaborasi",
  },
];

export default function ShowcaseSection() {
  return (
    <section id="karya" className="relative py-20 sm:py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto px-6 sm:px-10 mb-10 text-center"
      >
        <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
          Aktivitas Terakhir
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 text-ink">
          Apa yang lagi dikerjain tim
        </h2>
      </motion.div>

      <InfiniteMovingCards items={SHOWCASE} direction="left" speed="slow" />
    </section>
  );
}
