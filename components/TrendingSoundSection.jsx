"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

// Ganti `src` dengan file audio asli karya divisi Remix begitu tersedia.
// Untuk sekarang pakai placeholder — taruh file di public/audio/ lalu
// update path di bawah (contoh: "/audio/remix-trending-01.mp3").
const TRENDING_SOUNDS = [
  {
    id: "trend-01",
    title: "Remix Closing Set",
    creator: "Divisi Remix",
    src: "/audio/placeholder-01.mp3",
  },
  {
    id: "trend-02",
    title: "Night Drive Edit",
    creator: "Divisi Remix",
    src: "/audio/placeholder-02.mp3",
  },
  {
    id: "trend-03",
    title: "Showcase Bumper",
    creator: "Divisi Remix",
    src: "/audio/placeholder-03.mp3",
  },
];

// Waveform statis untuk tampilan (tidak dianalisis dari file asli).
// Kalau nanti mau waveform real, bisa diganti pakai Web Audio API
// (decodeAudioData -> ambil peak amplitude per segmen).
function generateWaveform(seed = 1, bars = 56) {
  const heights = [];
  let value = seed * 137.5;
  for (let i = 0; i < bars; i++) {
    value = (value * 9301 + 49297) % 233280;
    const rand = value / 233280;
    heights.push(0.15 + rand * 0.85);
  }
  return heights;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function SoundCard({ sound, index, activeId, onPlay }) {
  const audioRef = useRef(null);
  const barsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const waveform = useRef(generateWaveform(index + 1));

  const isActive = activeId === sound.id;

  useEffect(() => {
    if (!isActive && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setCurrentTime(audio.currentTime);
    setProgress(audio.currentTime / audio.duration);
  }, []);

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
      onPlay(sound.id);
      audio.play().catch(() => {
        // Gagal play (misal file belum ada) — biarkan diam, jangan crash UI.
      });
      setIsPlaying(true);
    }
  };

  const seekFromClientX = (clientX) => {
    const audio = audioRef.current;
    const track = barsRef.current;
    if (!audio || !track || !duration) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * duration;
    setProgress(ratio);
    setCurrentTime(audio.currentTime);
  };

  const handleSeekClick = (e) => {
    seekFromClientX(e.clientX);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="rounded-2xl border border-base-line bg-base-elevated p-4 sm:p-5"
    >
      <audio
        ref={audioRef}
        src={sound.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />

      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-body font-semibold text-sm text-ink truncate">
            {sound.title}
          </h3>
          <p className="text-xs text-ink-muted truncate">{sound.creator}</p>
        </div>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-remix-from to-remix-to text-white transition active:scale-95"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4 ml-0.5 fill-current" aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        ref={barsRef}
        role="slider"
        tabIndex={0}
        aria-label="Seek posisi audio"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration || 0)}
        aria-valuenow={Math.round(currentTime)}
        aria-valuetext={`${formatTime(currentTime)} dari ${formatTime(duration)}`}
        onClick={handleSeekClick}
        className="relative flex h-16 items-center gap-[3px] cursor-pointer touch-none select-none"
      >
        {waveform.current.map((h, i) => {
          const barRatio = i / waveform.current.length;
          const isFilled = barRatio <= progress;
          return (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-full transition-colors",
                isFilled ? "bg-remix-to" : "bg-ink/15"
              )}
              style={{ height: `${h * 100}%` }}
            />
          );
        })}
      </div>

      <div className="mt-2 text-right text-xs tabular-nums text-ink-dim">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </motion.article>
  );
}

export default function TrendingSoundSection() {
  const [activeId, setActiveId] = useState(null);

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

      <div className="max-w-3xl mx-auto px-6 sm:px-10 grid gap-4 sm:grid-cols-2">
        {TRENDING_SOUNDS.map((sound, index) => (
          <SoundCard
            key={sound.id}
            sound={sound}
            index={index}
            activeId={activeId}
            onPlay={setActiveId}
          />
        ))}
      </div>
    </section>
  );
}
