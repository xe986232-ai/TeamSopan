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
// delay per karakter 50ms + durasi reveal 800ms) supaya tiap elemen
// tidak pernah tumpang tindih satu sama lain.
const GREETING_REVEAL_MS = (GREETING_TEXT.length - 1) * 50 + 800;
const GREETING_HOLD_MS = 900; // jeda baca sebelum animasi 1 keluar

const AVATAR_ZOOM_MS = 1300; // profile zoom ke depan, pelan
const GAP_AFTER_AVATAR_MS = 300;

const NAME_REVEAL_MS = (member.name.length - 1) * 50 + 800;
const GAP_AFTER_NAME_MS = 150;

const DIVISION_REVEAL_MS = (member.division.length - 1) * 50 + 800;
const HOLD_AFTER_ALL_MS = 1800; // jeda sebelum opening ditutup

const EXIT_FADE_MS = 1200; // fade opacity halaman turun, kesan opening selesai

const T_AVATAR_START = GREETING_REVEAL_MS + GREETING_HOLD_MS;
const T_NAME_START = T_AVATAR_START + AVATAR_ZOOM_MS + GAP_AFTER_AVATAR_MS;
const T_DIVISION_START = T_NAME_START + NAME_REVEAL_MS + GAP_AFTER_NAME_MS;
const T_EXIT_START = T_DIVISION_START + DIVISION_REVEAL_MS + HOLD_AFTER_ALL_MS;

export default function WelcomePreviewSection() {
  // tahap: "greeting" -> "avatar" -> "name" -> "division" -> "exit"
  const [stage, setStage] = useState("greeting");

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage("avatar"), T_AVATAR_START),
      setTimeout(() => setStage("name"), T_NAME_START),
      setTimeout(() => setStage("division"), T_DIVISION_START),
      setTimeout(() => setStage("exit"), T_EXIT_START),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const showAvatar = stage !== "greeting";
  const showName = stage === "name" || stage === "division" || stage === "exit";
  const showDivision = stage === "division" || stage === "exit";

  return (
    <motion.section
      animate={{ opacity: stage === "exit" ? 0 : 1 }}
      transition={{ duration: EXIT_FADE_MS / 1000, ease: "easeInOut" }}
      className="bg-base py-20 sm:py-28 px-4 flex flex-col items-center justify-center min-h-[70vh] overflow-hidden"
    >
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
              className="text-3xl md:text-5xl text-ink"
            />
          </motion.div>
        )}

        {/* Animasi 2: Profile -> Nama -> Divisi, berurutan, tanpa card/deskripsi */}
        {showAvatar && (
          <motion.div
            key="member-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: AVATAR_ZOOM_MS / 1000,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-black/10 dark:border-white/10 shadow-lg mb-6"
            >
              <img
                src={member.avatarUrl}
                alt={`Foto ${member.name}`}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {showName && (
              <BlurInText
                text={member.name}
                className="text-2xl md:text-4xl text-ink"
              />
            )}

            {showDivision && (
              <BlurInText
                text={member.division}
                className="text-lg md:text-2xl text-pink-500 mt-1"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
