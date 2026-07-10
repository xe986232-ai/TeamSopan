"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlurInText from "@/components/ui/blur-in-text";

// Placeholder — nanti disambungkan ke data member beneran.
const member = {
  name: "Candra Sopan",
  division: "Divisi Remix",
  avatarUrl:
    "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?auto=format&fit=crop&q=80&w=400",
};

const GREETING_TEXT = "Selamat Bergabung Di Divisi Remix";

// Durasi dihitung otomatis dari panjang teks (mengikuti timing BlurInText:
// delay per karakter 50ms + durasi reveal 800ms) supaya animasi 1 tidak
// pernah tumpang tindih dengan animasi 2.
const GREETING_REVEAL_MS = (GREETING_TEXT.length - 1) * 50 + 800;
const GREETING_HOLD_MS = 900; // jeda baca sebelum animasi 1 keluar

const AVATAR_ZOOM_MS = 1300; // profile zoom ke depan, pelan
const GAP_AFTER_AVATAR_MS = 300;

// Nama & Divisi pakai fade + naik + blur-out satu kesatuan (bukan per huruf)
// biar mulus, tidak kaku/patah-patah.
const NAME_REVEAL_MS = 900;
const GAP_AFTER_NAME_MS = 250;

const DIVISION_REVEAL_MS = 800;

const SETTLE_GAP_MS = 350; // jeda sebentar setelah Divisi kebaca
const SETTLE_DURATION_MS = 1000; // profile naik pelan & smooth
const HOLD_AFTER_SETTLE_MS = 1200; // jeda sebelum overlay ditutup

const EXIT_FADE_MS = 1200; // overlay fade out, balik ke halaman utama

const SMOOTH_EASE = [0.22, 1, 0.36, 1];

const T_AVATAR_START = GREETING_REVEAL_MS + GREETING_HOLD_MS;
const T_NAME_START = T_AVATAR_START + AVATAR_ZOOM_MS + GAP_AFTER_AVATAR_MS;
const T_DIVISION_START = T_NAME_START + NAME_REVEAL_MS + GAP_AFTER_NAME_MS;
const T_SETTLE_START = T_DIVISION_START + DIVISION_REVEAL_MS + SETTLE_GAP_MS;
const T_EXIT_START = T_SETTLE_START + SETTLE_DURATION_MS + HOLD_AFTER_SETTLE_MS;

// Fade + naik dikit + blur-out, satu kesatuan (bukan per karakter).
function SmoothIn({ text, className }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: SMOOTH_EASE }}
      className={`font-display font-extrabold text-center ${className}`}
    >
      {text}
    </motion.p>
  );
}

export default function WelcomePreviewSection() {
  // tahap: "greeting" -> "avatar" -> "name" -> "division" -> "settled" -> "exit"
  const [stage, setStage] = useState("greeting");

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage("avatar"), T_AVATAR_START),
      setTimeout(() => setStage("name"), T_NAME_START),
      setTimeout(() => setStage("division"), T_DIVISION_START),
      setTimeout(() => setStage("settled"), T_SETTLE_START),
      setTimeout(() => setStage("exit"), T_EXIT_START),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const showAvatar = stage !== "greeting";
  const showName = ["name", "division", "settled", "exit"].includes(stage);
  const showDivision = ["division", "settled", "exit"].includes(stage);
  const isSettled = stage === "settled" || stage === "exit";
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
          {/* Animasi 1: teks pembuka sendirian dulu */}
          {stage === "greeting" && (
            <motion.div
              key="greeting"
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <BlurInText
                text={GREETING_TEXT}
                className="text-3xl md:text-5xl text-white"
              />
            </motion.div>
          )}

          {/* Animasi 2: Profile -> Nama -> Divisi (mulus, bukan per huruf), lalu naik pelan */}
          {showAvatar && (
            <motion.div
              key="member-intro"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                y: isSettled ? -24 : 0,
              }}
              transition={{
                opacity: { duration: 0.5, ease: "easeInOut" },
                y: { duration: SETTLE_DURATION_MS / 1000, ease: SMOOTH_EASE },
              }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: AVATAR_ZOOM_MS / 1000,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/15 shadow-lg mb-6"
              >
                <img
                  src={member.avatarUrl}
                  alt={`Foto ${member.name}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {showName && (
                <SmoothIn text={member.name} className="text-2xl md:text-4xl text-white" />
              )}

              {showDivision && (
                <SmoothIn
                  text={member.division}
                  className="text-lg md:text-2xl text-pink-400 mt-1"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
