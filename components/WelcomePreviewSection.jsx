"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Music2, Youtube } from "lucide-react";
import BlurInText from "@/components/ui/blur-in-text";
import ProfileCard from "@/components/ui/profile-card";

// Placeholder — nanti disambungkan ke data member beneran.
const profile = {
  name: "Candra Sopan",
  title: "Divisi Remix",
  bio: "Admin Divisi Remix, mengelola karya dan koordinasi kreator remix di SOPAN TEAM.",
  avatarUrl:
    "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?auto=format&fit=crop&q=80&w=800",
  socialLinks: [
    { id: "instagram", icon: Instagram, label: "Instagram", href: "#" },
    { id: "tiktok", icon: Music2, label: "TikTok", href: "#" },
    { id: "youtube", icon: Youtube, label: "YouTube", href: "#" },
  ],
  actionButton: { text: "Lihat Profil", href: "#" },
};

const GREETING_TEXT = "Selamat Bergabung Di Divisi Remix";
const NAME_TEXT = "Candra Sopan";

// Durasi dihitung otomatis dari panjang teks (mengikuti timing BlurInText:
// delay per karakter 50ms + durasi reveal 800ms) supaya animasi 1 & animasi 2
// tidak pernah tumpang tindih.
const GREETING_REVEAL_MS = (GREETING_TEXT.length - 1) * 50 + 800;
const GREETING_HOLD_MS = 900; // jeda baca sebelum animasi 1 keluar
const NAME_REVEAL_MS = (NAME_TEXT.length - 1) * 50 + 800;
const PROFILE_DELAY_MS = 400; // profile nyusul sedikit setelah animasi 2 mulai muncul
const PROFILE_ZOOM_MS = 1600; // zoom depan pelan
const PROFILE_HOLD_MS = 1800; // jeda sebelum opening ditutup
const EXIT_FADE_MS = 1200; // fade opacity halaman turun, kesan opening selesai

const T_NAME_START = GREETING_REVEAL_MS + GREETING_HOLD_MS;
const T_PROFILE_START = T_NAME_START + PROFILE_DELAY_MS;
const T_EXIT_START = T_PROFILE_START + PROFILE_ZOOM_MS + PROFILE_HOLD_MS;

export default function WelcomePreviewSection() {
  // tahap: "greeting" -> "name" -> "profile" -> "exit"
  const [stage, setStage] = useState("greeting");

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage("name"), T_NAME_START),
      setTimeout(() => setStage("profile"), T_PROFILE_START),
      setTimeout(() => setStage("exit"), T_EXIT_START),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

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

        {/* Animasi 2 (baru muncul setelah animasi 1 selesai) + Profile zoom pelan */}
        {stage !== "greeting" && (
          <motion.div
            key="name-and-profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <BlurInText
              text={NAME_TEXT}
              className="text-2xl md:text-4xl text-ink mb-10"
            />

            {(stage === "profile" || stage === "exit") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.55 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: PROFILE_ZOOM_MS / 1000,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <ProfileCard {...profile} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
