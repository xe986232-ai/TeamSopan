"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Sound effect ringan bikinan sendiri lewat Web Audio API (tanpa file audio
// eksternal) — "whoosh" tipis pas teks pembuka muncul, "chime" pas profile
// muncul. Browser modern nge-block audio otomatis sebelum ada interaksi
// user; efek ini akan langsung nyala begitu user pertama kali tap/klik apa
// pun di halaman kalau autoplay-nya sempat diblokir.
function playWhoosh(ctx) {
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(660, now + 0.5);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.6);
}

function playChime(ctx) {
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // arpeggio C5-E5-G5, kesan "ta-da"
  notes.forEach((freq, i) => {
    const start = now + i * 0.09;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.2, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.5);
  });
}

// Placeholder — nanti disambungkan ke data member beneran.
const member = {
  name: "Candra Sopan",
  division: "Divisi Remix",
  avatarUrl:
    "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?auto=format&fit=crop&q=80&w=400",
};

const GREETING_TEXT = "Selamat Bergabung Di Divisi Remix";

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

export default function WelcomePreviewSection() {
  // tahap: "greeting" -> "intro" -> "exit"
  const [stage, setStage] = useState("greeting");
  const audioCtxRef = useRef(null);

  const getAudioCtx = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();
    }
    return audioCtxRef.current;
  };

  useEffect(() => {
    const ctx = getAudioCtx();
    if (ctx && ctx.state === "suspended") {
      const resume = () => ctx.resume();
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    }
    playWhoosh(ctx);

    const timers = [
      setTimeout(() => setStage("intro"), T_INTRO_START),
      setTimeout(() => setStage("exit"), T_EXIT_START),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (stage === "intro") {
      playChime(audioCtxRef.current);
    }
  }, [stage]);

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
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/15 shadow-lg mb-6">
                <img
                  src={member.avatarUrl}
                  alt={`Foto ${member.name}`}
                  className="w-full h-full object-cover"
                />
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
