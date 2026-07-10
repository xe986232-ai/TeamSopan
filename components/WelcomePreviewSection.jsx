"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Placeholder — nanti disambungkan ke data member beneran.
const member = {
  name: "Candra Sopan",
  division: "Divisi Remix",
  avatarUrl:
    "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?auto=format&fit=crop&q=80&w=400",
};

const GREETING_TEXT = "Selamat Bergabung Di Divisi Remix";

const SMOOTH_EASE = [0.22, 1, 0.36, 1];

// Animasi 1: teks zoom dari besar -> kecil (normal), lalu fade out.
const GREETING_ZOOM_MS = 1000;
const GREETING_HOLD_MS = 1200;
const GREETING_EXIT_MS = 500;

// Animasi 2: Profile + Nama + Divisi muncul bareng, zoom kecil -> besar.
const INTRO_ZOOM_MS = 1000;
const INTRO_HOLD_MS = 1900;

// Fade keseluruhan overlay di penutup.
const EXIT_FADE_MS = 1200;

const T_INTRO_START = GREETING_ZOOM_MS + GREETING_HOLD_MS + GREETING_EXIT_MS;
const T_EXIT_START = T_INTRO_START + INTRO_ZOOM_MS + INTRO_HOLD_MS;

export default function WelcomePreviewSection() {
  // tahap: "greeting" -> "intro" -> "exit"
  const [stage, setStage] = useState("greeting");

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage("intro"), T_INTRO_START),
      setTimeout(() => setStage("exit"), T_EXIT_START),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

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
          {/* Animasi 1: teks pembuka, zoom besar -> kecil, lalu fade out sendirian */}
          {stage === "greeting" && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: GREETING_EXIT_MS / 1000, ease: "easeInOut" } }}
              transition={{ duration: GREETING_ZOOM_MS / 1000, ease: SMOOTH_EASE }}
            >
              <h2 className="font-display font-extrabold text-center text-3xl md:text-5xl text-white">
                {GREETING_TEXT}
              </h2>
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
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/15 shadow-lg mb-6">
                <img
                  src={member.avatarUrl}
                  alt={`Foto ${member.name}`}
                  className="w-full h-full object-cover"
                />
                {/* kilau putih jalan melintasi foto profile */}
                <motion.div
                  className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                  style={{ transform: "skewX(-20deg)" }}
                  initial={{ x: "-150%" }}
                  animate={{ x: "250%" }}
                  transition={{
                    duration: 1.4,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
              </div>

              <h3 className="font-display font-extrabold text-center text-2xl md:text-4xl text-white">
                {member.name}
              </h3>
              <p className="font-display font-bold text-center text-lg md:text-2xl text-pink-400 mt-1">
                {member.division}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
