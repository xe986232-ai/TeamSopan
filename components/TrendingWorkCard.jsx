"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Play, Pause } from "lucide-react";

function formatLikes(n) {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}rb`;
  }
  return `${n}`;
}

// Satu kartu "Trending Edit". Defaultnya nampilin thumbnail gradient (yang
// dipertahankan sesuai request — jangan dihapus). Begitu tombol play
// dipencet: gradient + overlay + teks memudar (fade out), video muncul
// memudar masuk (fade in) lalu langsung diputar. Video-nya SELALU mengikuti
// ukuran kartu (object-cover, absolute inset-0) — bukan sebaliknya — jadi
// semua kartu tetap rata rapi walau video sumbernya beda-beda ukuran/rasio.
export default function TrendingWorkCard({ work, index }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const hasVideo = Boolean(work.videoUrl);

  // Begitu isPlaying jadi true (thumbnail lagi fade out), video langsung
  // di-play lewat JS -- lebih reliable daripada andalin atribut `autoPlay`
  // karena video-nya baru dipasang/di-mount saat itu juga.
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // browser kadang block autoplay dengan suara -- kalau gagal,
        // biarin user pencet tombol native control video buat mutar manual.
      });
    }
  }, [isPlaying]);

  function handlePlayClick() {
    if (!hasVideo) return; // video belum diupload admin — tombol nggak ngapa-ngapain dulu
    setIsPlaying(true);
  }

  function handleStop() {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-black"
    >
      {/* VIDEO — ukurannya selalu ikut ukuran kartu (w-full h-full object-cover),
          bukan video yang menentukan ukuran kartu. */}
      {hasVideo && (
        <video
          ref={videoRef}
          src={work.videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          controls={isPlaying}
          onEnded={handleStop}
        />
      )}

      {/* THUMBNAIL — gradient khas Creator + grain, di-fade in/out pakai AnimatePresence.
          Ini yang dipertahankan sesuai request, cuma sekarang jadi animasi
          fade bukan cuma dekorasi statis. */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            key="thumbnail"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0" style={{ background: work.gradient }} />
            <div className="absolute inset-0 bg-grain opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />

            {/* tombol play di tengah */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={handlePlayClick}
                aria-label={`Putar ${work.title}`}
                disabled={!hasVideo}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 enabled:group-hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Play className="h-5 w-5 translate-x-0.5 text-creator-to" fill="currentColor" />
              </button>
            </div>

            {/* judul karya, pojok atas */}
            <div className="absolute inset-x-0 top-0 p-3 sm:p-4">
              <p className="font-display font-bold text-sm sm:text-base text-white leading-tight drop-shadow">
                {work.title}
              </p>
              <p className="font-body text-xs text-white/80 mt-0.5">{work.subtitle}</p>
            </div>

            {/* like count & logo, pojok bawah */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-pink-400" fill="currentColor" />
                <span className="font-body font-semibold text-sm text-white">
                  {formatLikes(work.likes)}
                </span>
              </div>
              <span className="shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-white/90 shadow-md">
                <Image alt="Sopan Team" src="/sopan-logo-black.png" width={12} height={15} />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* tombol stop kecil, muncul cuma pas video lagi diputar */}
      <AnimatePresence>
        {isPlaying && (
          <motion.button
            key="stop-btn"
            type="button"
            onClick={handleStop}
            aria-label={`Hentikan ${work.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm"
          >
            <Pause className="h-3.5 w-3.5" fill="currentColor" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
