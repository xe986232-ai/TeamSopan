"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GREETING_TEXT = "Selamat Bergabung Di Team Sopan";

const SMOOTH_EASE = [0.22, 1, 0.36, 1];

// Animasi 1: campuran blur-in per huruf (tipis) + zoom besar->kecil (tipis) + fade.
const CHAR_DELAY_MS = 30;
const CHAR_DURATION_MS = 550;
const GREETING_REVEAL_MS = (GREETING_TEXT.length - 1) * CHAR_DELAY_MS + CHAR_DURATION_MS;
const GREETING_HOLD_MS = 1100;
const GREETING_EXIT_MS = 500;

// Animasi 2: Profile + Nama + Divisi muncul bareng, zoom kecil -> besar.
const INTRO_ZOOM_MS = 1000;
const INTRO_HOLD_MS = 1900;

// Fade keseluruhan overlay di penutup.
const EXIT_FADE_MS = 1200;

const T_INTRO_START = GREETING_REVEAL_MS + GREETING_HOLD_MS + GREETING_EXIT_MS;
const T_EXIT_START = T_INTRO_START + INTRO_ZOOM_MS + INTRO_HOLD_MS;

function getInitials(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase();
}

// Teks pembuka: zoom tipis besar->kecil di level grup, dipadu blur-in tipis per huruf.
function GreetingText({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: SMOOTH_EASE }}
    >
      <h2 className="font-display font-extrabold text-center text-3xl md:text-5xl text-white">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: "blur(1px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
              delay: (i * CHAR_DELAY_MS) / 1000,
              duration: CHAR_DURATION_MS / 1000,
              ease: "easeOut",
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </h2>
    </motion.div>
  );
}

export default function WelcomePreviewSection({
  name = "Member Sopan",
  division = "Member SOPAN TEAM",
  onFinish,
}) {
  // tahap: "greeting" -> "intro" -> "exit"
  const [stage, setStage] = useState("greeting");

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage("intro"), T_INTRO_START),
      setTimeout(() => setStage("exit"), T_EXIT_START),
      setTimeout(() => {
        if (onFinish) onFinish();
      }, T_EXIT_START + EXIT_FADE_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  const isExiting = stage === "exit";

  return (
    <motion.div
      className="fixed inset-0 z-[6000] flex flex-col items-center justify-center overflow-hidden bg-black"
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: EXIT_FADE_MS / 1000, ease: "easeInOut" }}
      style={{ pointerEvents: isExiting ? "none" : "auto" }}
    >
      {/* gradient tipis-tipis di atas background hitam */}
      <div className="pointer-events-none absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full opacity-20 blur-3xl bg-gradient-to-br from-remix-from via-creator-from to-transparent" />
      <div className="pointer-events-none absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full opacity-15 blur-3xl bg-gradient-to-tr from-leadis-to via-creator-from to-transparent" />

      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {/* Animasi 1: teks pembuka, blur-in tipis per huruf + zoom tipis + fade, lalu fade out sendirian */}
          {stage === "greeting" && (
            <motion.div
              key="greeting"
              exit={{ opacity: 0, scale: 0.96, transition: { duration: GREETING_EXIT_MS / 1000, ease: "easeInOut" } }}
            >
              <GreetingText text={GREETING_TEXT} />
            </motion.div>
          )}

          {/* Animasi 2: Profile + Nama + Divisi muncul bareng, zoom kecil -> besar */}
          {stage !== "greeting" && (
            <motion.div
              key="member-intro"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: INTRO_ZOOM_MS / 1000, ease: SMOOTH_EASE }}
              className="flex flex-col items-center"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/15 shadow-lg mb-6 flex items-center justify-center bg-gradient-to-br from-remix-from via-creator-from to-leadis-to">
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                  {getInitials(name)}
                </span>
                {/* kilau putih, sapuan sekali dari kiri sampai mentok kanan lalu hilang */}
                <motion.div
                  className="absolute top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                  style={{ transform: "skewX(-20deg)" }}
                  initial={{ left: "-45%" }}
                  animate={{ left: "145%" }}
                  transition={{ duration: 0.9, ease: "easeIn", delay: 0.3 }}
                />
              </div>

              <h3 className="font-display font-extrabold text-center text-2xl md:text-4xl text-white">
                {name}
              </h3>
              <p className="font-display font-bold text-center text-lg md:text-2xl text-pink-400 mt-1">
                {division}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
