"use client";

import { motion } from "framer-motion";

// Dipisah jadi component sendiri ("use client") karena CreatorTrendingSection
// sekarang jadi async Server Component (buat fetch data trending_works dari
// Supabase) -- Server Component nggak boleh pakai hook/animasi framer-motion
// langsung, jadi bagian heading yang butuh whileInView ini didelegasikan
// ke sini.
export default function CreatorTrendingHeading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="max-w-2xl mx-auto px-6 sm:px-10 mb-10 text-center"
    >
      <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
        Divisi Creator
      </span>
      <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 text-ink">
        Trending Edit
      </h2>
      <p className="mt-3 text-ink-muted">
        Karya video editing yang lagi rame dilihat dari komunitas SOPAN TEAM.
      </p>
    </motion.div>
  );
}
