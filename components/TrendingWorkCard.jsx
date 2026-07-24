"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Play, Pause } from "lucide-react";

function formatLikes(n) {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}rb`;
  }
  return `${n}`;
}

// Satu kartu "Trending Edit".
//
// Struktur layer dari belakang ke depan:
// 1. <video> - selalu ke-mount di belakang (object-cover, absolute inset-0),
//    ukurannya SELALU ngikutin ukuran kartu, bukan sebaliknya.
// 2. Gradient warna khas Creator + grain - ini yang FADE OUT pas video
//    diputar (jadi berasa "gradient memudar, video keliatan").
// 3. Dark gradient buat kontras teks - tetap ada terus (baik pas thumbnail
//    maupun pas video jalan) biar judul/like tetep kebaca di atas video.
// 4. Judul, subtitle, like count, logo Sopan Team, tombol play/pause -
//    SEMUA INI OVERLAY PERMANEN, tidak pernah hilang/fade, baik lagi
//    nampilin gradient atau lagi muter video. Cuma ikon tombol tengah yang
//    ganti antara Play <-> Pause.
export default function TrendingWorkCard({ work, index }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const hasVideo = Boolean(work.videoUrl);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {
        // browser kadang block autoplay -- kalau gagal, biarin state balik
        // ke "paused" biar ikon tombol tetep sinkron sama kondisi asli video.
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  function handleTogglePlay() {
    if (!hasVideo) return; // video belum diupload admin — tombol nggak ngapa-ngapain dulu
    setIsPlaying((prev) => !prev);
  }

  function handleEnded() {
    setIsPlaying(false);
    if (videoRef.current) {
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
      {/* VIDEO — ukurannya selalu ikut ukuran kartu (w-full h-full object-cover) */}
      {hasVideo && (
        <video
          ref={videoRef}
          src={work.videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          onEnded={handleEnded}
          onClick={handleTogglePlay}
        />
      )}

      {/* GRADIENT WARNA + GRAIN — ini doang yang fade out pas video main */}
      <motion.div
        animate={{ opacity: isPlaying ? 0 : 1 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0" style={{ background: work.gradient }} />
        <div className="absolute inset-0 bg-grain opacity-40" />
      </motion.div>

      {/* dark gradient buat kontras teks — permanen, di atas video maupun gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />

      {/* tombol play/pause di tengah — overlay permanen, cuma ikonnya yang ganti */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? `Jeda ${work.title}` : `Putar ${work.title}`}
          disabled={!hasVideo}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 enabled:group-hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-creator-to" fill="currentColor" />
          ) : (
            <Play className="h-5 w-5 translate-x-0.5 text-creator-to" fill="currentColor" />
          )}
        </button>
      </div>

      {/* judul karya, pojok atas — overlay permanen */}
      <div className="absolute inset-x-0 top-0 p-3 sm:p-4">
        <p className="font-display font-bold text-sm sm:text-base text-white leading-tight drop-shadow">
          {work.title}
        </p>
        <p className="font-body text-xs text-white/80 mt-0.5">{work.subtitle}</p>
      </div>

      {/* like count & logo, pojok bawah — overlay permanen */}
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
  );
}
