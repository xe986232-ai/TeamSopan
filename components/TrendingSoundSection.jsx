"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

// ============================================================================
// GANTI DI SINI kalau karya remix asli sudah siap:
// - cover: sekarang masih placeholder gradient (belum ada foto/artwork asli).
//   Ganti ke <img>/<Image> begitu ada artwork, atau pakai foto asli lewat
//   Supabase Storage (pola sama seperti fitur upload video Trending Edit).
// - src: path file audio. Taruh file di /public/audio/ lalu update path-nya.
// ============================================================================
const TRACKS = [
  {
    id: "trend-01",
    title: "Judul Remix 1",
    creator: "Nama Remixer",
    src: "/audio/placeholder-01.mp3",
    durationFallback: 234, // detik, dipakai kalau file audio belum ada / gagal load
    coverGradient: "linear-gradient(160deg, #123a4d 0%, #0c2430 60%, #081820 100%)",
    panelColor: "#0d2530",
  },
  {
    id: "trend-02",
    title: "Judul Remix 2",
    creator: "Nama Remixer",
    src: "/audio/placeholder-02.mp3",
    durationFallback: 233,
    coverGradient: "linear-gradient(160deg, #E8952E 0%, #7A3B1E 65%, #2E1710 100%)",
    panelColor: "#2b1911",
  },
  {
    id: "trend-03",
    title: "Judul Remix 3",
    creator: "Nama Remixer",
    src: "/audio/placeholder-03.mp3",
    durationFallback: 238,
    coverGradient: "linear-gradient(160deg, #6B4A7A 0%, #3A2B45 60%, #1C1622 100%)",
    panelColor: "#211a29",
  },
];

// Rotasi & posisi ala "kartu berserakan" — cuma aktif di layar >= sm,
// di mobile kartu berdiri lurus (lebih enak buat di-swipe).
const CARD_TILT = [
  { rotate: -6, y: 18, scale: 1, z: 0 },
  { rotate: 0, y: 0, scale: 1.06, z: 10 },
  { rotate: 6, y: 18, scale: 1, z: 0 },
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PlayerCard({ track, index, isActive, onPlay, onPause }) {
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const startTimestampRef = useRef(0);

  const [duration, setDuration] = useState(track.durationFallback);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const progress = duration ? currentTime / duration : 0;
  const tilt = CARD_TILT[index] || CARD_TILT[0];

  const stopClock = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const tick = useCallback(() => {
    const elapsed = (performance.now() - startTimestampRef.current) / 1000;
    if (elapsed >= duration) {
      setCurrentTime(0);
      startTimestampRef.current = 0;
      stopClock();
      onPause();
      return;
    }
    setCurrentTime(elapsed);
    rafRef.current = requestAnimationFrame(tick);
  }, [duration, onPause, stopClock]);

  // Begitu kartu lain di-play, kartu ini otomatis berhenti — cuma satu yang
  // boleh jalan bersamaan.
  useEffect(() => {
    if (!isActive) {
      audioRef.current?.pause();
      stopClock();
    }
  }, [isActive, stopClock]);

  useEffect(() => stopClock, [stopClock]);

  function handleTogglePlay() {
    if (isActive) {
      audioRef.current?.pause();
      stopClock();
      onPause();
      return;
    }
    onPlay(track.id);
    audioRef.current?.play().catch(() => {
      // file placeholder mungkin belum ada -- biarin, clock internal tetap
      // jalan supaya UI tidak terasa macet.
    });
    startTimestampRef.current = performance.now() - currentTime * 1000;
    rafRef.current = requestAnimationFrame(tick);
  }

  const seekFromClientX = useCallback(
    (clientX) => {
      const el = trackRef.current;
      if (!el || !duration) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const newTime = ratio * duration;
      if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
        audioRef.current.currentTime = newTime;
      }
      startTimestampRef.current = performance.now() - newTime * 1000;
      setCurrentTime(newTime);
    },
    [duration]
  );

  function handlePointerDown(e) {
    setIsDragging(true);
    setShowTooltip(true);
    seekFromClientX(e.clientX);
  }

  function skip(deltaSeconds) {
    const newTime = Math.min(Math.max(currentTime + deltaSeconds, 0), duration);
    setCurrentTime(newTime);
    startTimestampRef.current = performance.now() - newTime * 1000;
    if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = newTime;
    }
  }

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e) => seekFromClientX(e.clientX);
    const handleUp = () => {
      setIsDragging(false);
      setShowTooltip(false);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isDragging, seekFromClientX]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ zIndex: tilt.z }}
      className="relative shrink-0 snap-center w-[240px] sm:w-[250px]"
    >
      <motion.div
        animate={{
          rotate: isDesktop ? tilt.rotate : 0,
          y: isDesktop ? tilt.y : 0,
          scale: isDesktop ? tilt.scale : 1,
        }}
        whileHover={isDesktop ? { rotate: 0, y: 0, scale: 1.08 } : undefined}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <PlayerCardBody
          track={track}
          isActive={isActive}
          duration={duration}
          currentTime={currentTime}
          progress={progress}
          showTooltip={showTooltip}
          trackRef={trackRef}
          audioRef={audioRef}
          onTogglePlay={handleTogglePlay}
          onPointerDown={handlePointerDown}
          onSkip={skip}
          onLoadedMetadata={(d) => setDuration(d)}
          onMouseEnterTrack={() => setShowTooltip(true)}
          onMouseLeaveTrack={() => !isDragging && setShowTooltip(false)}
        />
      </motion.div>
    </motion.div>
  );
}

function PlayerCardBody({
  track,
  isActive,
  duration,
  currentTime,
  progress,
  showTooltip,
  trackRef,
  audioRef,
  onTogglePlay,
  onPointerDown,
  onSkip,
  onLoadedMetadata,
  onMouseEnterTrack,
  onMouseLeaveTrack,
}) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] shadow-2xl shadow-black/50">
      {/* cover placeholder */}
      <div
        className="relative h-44 sm:h-48 w-full"
        style={{ background: track.coverGradient }}
      >
        <div className="absolute inset-0 bg-grain opacity-30" />
        <div
          className="absolute inset-x-0 bottom-0 h-16"
          style={{
            background: `linear-gradient(to top, ${track.panelColor}, transparent)`,
          }}
        />
      </div>

      {/* panel info + kontrol */}
      <div
        className="px-5 pt-4 pb-5"
        style={{ background: track.panelColor }}
      >
        <audio
          ref={audioRef}
          src={track.src}
          preload="metadata"
          onLoadedMetadata={(e) => {
            if (Number.isFinite(e.currentTarget.duration)) {
              onLoadedMetadata(e.currentTarget.duration);
            }
          }}
          className="hidden"
        />

        <p className="font-display font-bold text-lg text-white leading-tight truncate">
          {track.title}
        </p>
        <p className="font-body text-sm text-white/55 mt-0.5 truncate">
          {track.creator}
        </p>

        {/* progress bar */}
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label={`Seek posisi audio ${track.title}`}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration || 0)}
          aria-valuenow={Math.round(currentTime)}
          onPointerDown={onPointerDown}
          onMouseEnter={onMouseEnterTrack}
          onMouseLeave={onMouseLeaveTrack}
          className="relative mt-5 h-4 flex items-center cursor-pointer touch-none select-none"
        >
          <div className="relative h-1 w-full rounded-full bg-white/20">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow"
            style={{ left: `calc(${progress * 100}% - 6px)` }}
          />
          {showTooltip && (
            <span
              className="absolute -top-7 -translate-x-1/2 rounded-md bg-white px-1.5 py-0.5 text-[11px] font-semibold text-black shadow"
              style={{ left: `${progress * 100}%` }}
            >
              {formatTime(currentTime)}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-center justify-between text-xs tabular-nums text-white/50">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* kontrol prev / play-pause / next */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => onSkip(-10)}
            aria-label={`Mundur 10 detik - ${track.title}`}
            className="text-white/70 hover:text-white transition-colors"
          >
            <SkipBack className="h-4 w-4" fill="currentColor" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isActive ? `Jeda ${track.title}` : `Putar ${track.title}`}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-transform active:scale-95"
          >
            {isActive ? (
              <Pause className="h-4.5 w-4.5 text-black" fill="currentColor" />
            ) : (
              <Play className="h-4.5 w-4.5 ml-0.5 text-black" fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onSkip(10)}
            aria-label={`Maju 10 detik - ${track.title}`}
            className="text-white/70 hover:text-white transition-colors"
          >
            <SkipForward className="h-4 w-4" fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TrendingSoundSection() {
  const [playingId, setPlayingId] = useState(null);

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

      {/* "panggung" gelap — background-nya sengaja fixed dark supaya kartu
          player selalu kontras & konsisten, terlepas dari light/dark mode
          situs. Blob blur warna-warni di belakang meniru efek bokeh. */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0b0710] py-14 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -left-10 h-72 w-72 rounded-full bg-[#E8952E] opacity-25 blur-[100px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-6 -right-10 h-72 w-72 rounded-full bg-[#3D5AFE] opacity-20 blur-[110px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-[#B026FF] opacity-20 blur-[100px]"
          />

          <div className="relative flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 pb-2 sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 sm:gap-6">
            {TRACKS.map((track, i) => (
              <PlayerCard
                key={track.id}
                track={track}
                index={i}
                isActive={playingId === track.id}
                onPlay={setPlayingId}
                onPause={() => setPlayingId(null)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
