"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Youtube, ExternalLink } from "lucide-react";

// Ganti `src` dengan file audio asli karya divisi Remix begitu tersedia.
// Untuk sekarang pakai placeholder — taruh file di public/audio/ lalu
// update path di bawah (contoh: "/audio/remix-trending-01.mp3").
// `link` & `platform` = tujuan tombol "dengerin full version" (tiktok | youtube).
const TRENDING_SOUND = {
  id: "trend-01",
  title: "Remix Closing Set",
  creator: "Divisi Remix",
  src: "/audio/placeholder-01.mp3",
  durationFallback: 20,
  link: "https://www.tiktok.com/@sopanteam",
  platform: "tiktok", // "tiktok" | "youtube"
};

const BAR_COUNT = 150;
const BAR_WIDTH = 2;
const BAR_GAP = 1;
const VIEWBOX_WIDTH = BAR_COUNT * (BAR_WIDTH + BAR_GAP);
const VIEWBOX_HEIGHT = 80;

// Waveform statis untuk tampilan (tidak dianalisis dari file asli).
// Kalau nanti mau waveform real, bisa diganti pakai Web Audio API
// (decodeAudioData -> ambil peak amplitude per segmen).
function generateWaveform(seed = 1, bars = BAR_COUNT) {
  const heights = [];
  let value = seed * 137.5;
  for (let i = 0; i < bars; i++) {
    value = (value * 9301 + 49297) % 233280;
    const rand = value / 233280;
    const wave = Math.sin(i / 6) * 0.15;
    heights.push(Math.min(1, Math.max(0.05, 0.35 + rand * 0.55 + wave)));
  }
  return heights;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00.0";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toFixed(1).padStart(4, "0")}`;
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// Ikon TikTok yang disederhanakan (bukan reproduksi logo resmi) —
// dipakai supaya tombol CTA tetap jelas platformnya tanpa memakai aset pihak ketiga.
function TikTokGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.6 3c.42 2.2 1.94 3.86 4.2 4.14v3.02a7.2 7.2 0 0 1-4.2-1.36v6.93a6.27 6.27 0 1 1-6.27-6.27c.22 0 .43.01.64.04v3.1a3.16 3.16 0 1 0 2.2 3.01V3h3.43Z" />
    </svg>
  );
}

function WaveformBars({ heights, colorClass }) {
  return (
    <svg
      className="pointer-events-none h-full w-full"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {heights.map((h, i) => {
        const barHeight = h * VIEWBOX_HEIGHT;
        const x = i * (BAR_WIDTH + BAR_GAP);
        const y = (VIEWBOX_HEIGHT - barHeight) / 2;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={BAR_WIDTH}
            height={barHeight}
            rx={1}
            className={colorClass}
          />
        );
      })}
    </svg>
  );
}

export default function TrendingSoundSection() {
  const sound = TRENDING_SOUND;
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(sound.durationFallback);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const waveform = useMemo(() => generateWaveform(1), []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration || isDragging) return;
    setCurrentTime(audio.currentTime);
    setProgress(audio.currentTime / audio.duration);
  }, [isDragging]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
        // Gagal play (misal file belum ada) — biarkan diam, jangan crash UI.
      });
      setIsPlaying(true);
    }
  };

  const seekFromClientX = useCallback(
    (clientX) => {
      const audio = audioRef.current;
      const track = trackRef.current;
      if (!audio || !track || !duration) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      audio.currentTime = ratio * duration;
      setProgress(ratio);
      setCurrentTime(ratio * duration);
    },
    [duration]
  );

  const handlePointerDown = (e) => {
    setIsDragging(true);
    seekFromClientX(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e) => seekFromClientX(e.clientX);
    const handleUp = () => setIsDragging(false);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isDragging, seekFromClientX]);

  const handleKeyDown = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const step = duration * 0.02;
    if (e.key === "ArrowRight") {
      audio.currentTime = Math.min(duration, audio.currentTime + step);
      setProgress(audio.currentTime / duration);
      setCurrentTime(audio.currentTime);
    } else if (e.key === "ArrowLeft") {
      audio.currentTime = Math.max(0, audio.currentTime - step);
      setProgress(audio.currentTime / duration);
      setCurrentTime(audio.currentTime);
    }
  };

  const PlatformIcon = sound.platform === "youtube" ? Youtube : TikTokGlyph;
  const platformLabel = sound.platform === "youtube" ? "YouTube" : "TikTok";

  return (
    <section id="trending-sound" className="relative py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto px-6 sm:px-10 mb-10 text-center"
      >
        <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
          Divisi Remix
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 text-ink">
          Trending Sound
        </h2>
        <p className="mt-3 text-ink-muted">
          Karya remix yang lagi rame didengar dari komunitas SOPAN TEAM.
        </p>
      </motion.div>

      {/* Tidak dibungkus card besar — elemen berdiri sendiri di atas background section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto px-6 sm:px-10"
      >
        {/* Header: avatar kecil + nama artist, "Divisi Remix" pink di bawahnya, CTA di kanan */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #B026FF, #FF2E92)" }}
            >
              {initials(sound.creator)}
            </span>
            <div>
              <p className="font-body font-semibold text-sm text-ink leading-tight">
                {sound.creator}
              </p>
              <p className="font-accent text-xs font-semibold leading-tight mt-0.5 tracking-wide text-remix-to">
                Divisi Remix
              </p>
            </div>
          </div>

          <a
            href={sound.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative isolate shrink-0 inline-flex items-center gap-1.5 rounded-full p-[1.5px] transition"
            style={{ background: "linear-gradient(135deg, #B026FF, #FF2E92)" }}
          >
            <span className="flex items-center gap-1.5 rounded-full bg-base px-3 py-1.5 text-xs font-semibold text-ink transition group-hover:bg-transparent group-hover:text-white">
              <PlatformIcon
                className="h-3.5 w-3.5 text-remix-to transition group-hover:text-white"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Dengar di</span> {platformLabel}
              <ExternalLink
                className="h-3 w-3 text-ink-muted transition group-hover:text-white/80"
                aria-hidden="true"
              />
            </span>
          </a>
        </div>

        <audio
          ref={audioRef}
          src={sound.src}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          {/* Tombol play/pause — hitam putih monokrom */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition active:scale-95 dark:bg-white dark:text-black"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4 ml-0.5 fill-current" aria-hidden="true" />
            )}
          </button>

          {/* Waveform + progress overlay + playhead */}
          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Seek posisi audio"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration || 0)}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} dari ${formatTime(duration)}`}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            className="relative overflow-hidden rounded-lg bg-black/[0.06] dark:bg-white/[0.06] px-1 py-1.5 h-20 md:h-24 flex-1 cursor-pointer touch-none select-none"
          >
            <div className="pointer-events-none relative z-10 h-full w-full">
              <WaveformBars
                heights={waveform}
                colorClass="fill-black/35 dark:fill-white/35"
              />
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `inset(0px ${(1 - progress) * 100}% 0px 0px)`,
                }}
              >
                <WaveformBars heights={waveform} colorClass="fill-[#818cf8]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 text-right text-xs tabular-nums text-ink-dim">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </motion.div>
    </section>
  );
}
