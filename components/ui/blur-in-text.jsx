"use client";

import { motion } from "framer-motion";

/**
 * BlurInText — animasi teks blur-in per karakter, main sekali saat muncul.
 * @param {string} text - Teks yang ditampilkan.
 * @param {string} className - Class tambahan buat ukuran/warna.
 */
export default function BlurInText({ text = "Blur In Effect", className = "" }) {
  return (
    <h2 className={`font-display font-extrabold text-center ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h2>
  );
}
