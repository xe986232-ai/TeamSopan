"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function AnnouncementBar({ children, href }) {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative overflow-hidden bg-gradient-to-r from-remix-from via-creator-to to-leadis-to"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 px-10 py-2.5 text-center">
            <a
              href={href || "#"}
              className="text-xs sm:text-sm font-medium text-black/90 hover:underline underline-offset-2"
            >
              {children}
            </a>
          </div>
          <button
            onClick={() => setVisible(false)}
            aria-label="Tutup pengumuman"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 hover:text-black transition-colors text-sm"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
