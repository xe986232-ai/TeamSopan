"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

// ============================================================================
// GANTI DI SINI kalau karya remix asli sudah siap:
// - cover: sekarang masih placeholder (picsum.photos, foto acak tapi stabil
//   per-seed). Ganti ke foto artwork asli (Supabase Storage / /public) begitu
//   sudah ada, tinggal timpa field `cover`.
// - src: sekarang masih placeholder (SoundHelix demo track, dipakai umum buat
//   testing audio player). Taruh file asli di /public/audio/ atau Supabase
//   Storage lalu timpa field `src`.
// ============================================================================
const TRACKS = [
  {
    id: "trend-01",
    title: "Shiver",
    creator: "John Summit & Hayla",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    durationFallback: 234,
    cover: "https://picsum.photos/seed/sopan-shiver/700/800",
    panelColor: "#0d2530",
  },
  {
    id: "trend-02",
    title: "Say Nothing",
    creator: "Flume & MAY-A",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    durationFallback: 233,
    cover: "https://picsum.photos/seed/sopan-saynothing/700/800",
    panelColor: "#2b1911",
  },
  {
    id: "trend-03",
    title: "Innerbloom",
    creator: "RÜFÜS DU SOL",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    durationFallback: 238,
    cover: "https://picsum.photos/seed/sopan-innerbloom/700/800",
    panelColor: "#211a29",
  },
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Posisi kartu dalam "panggung" 3D, dihitung dari jarak (delta) terhadap
// kartu yang lagi fokus di tengah. delta 0 = tengah, -1 = kiri, +1 = kanan.
function getStageTransform(delta, isDesktop) {
  if (delta === 0) {
    return { x: 0, rotateY: 0, z: isDesktop ? 90 : 30, scale: isDesktop ? 1.08 : 1.14, opacity: 1 };
  }
  const dir = delta > 0 ? 1 : -1;
  // dir positif (kartu kanan) diputar rotateY positif -> sisi dalam (kiri
  // kartu) maju ke arah penonton, sisi luar mundur. dir negatif (kartu kiri)
  // kebalikannya. Efeknya kartu "melipat masuk" ke tengah, bukan membuka.
  // Di mobile jaraknya udah didekatkan lewat negative margin di layout
  // (lihat wrapper kartu), jadi di sini nggak perlu translateX tambahan lagi
  // -- kalau ditambah, jaraknya malah dobel / jauhan.
  const offsetX = isDesktop ? 218 : 0;
  const rotateY = dir * (isDesktop ? 28 : 22);
  const z = isDesktop ? -30 : -14;
  const scale = isDesktop ? 0.86 : 0.8;
  return { x: dir * offsetX, rotateY, z, scale, opacity: isDesktop ? 0.7 : 0.55 };
}

// delta melingkar: supaya kartu "sebelah" selalu di kiri/kanan terdekat,
// bukan lompat jauh ke ujung array.
function getCircularDelta(index, activeIndex, length) {
  let delta = index - activeIndex;
  if (delta > length / 2) delta -= length;
  if (delta < -length / 2) delta += length;
  return delta;
}

function PlayerCard({ track, index, delta, isActive, isFocused, isDesktop, onPlay, onPause, onFocus }) {
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const startTimestampRef = useRef(0);

  const [duration, setDuration] = useState(track.durationFallback);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const progress = duration ? currentTime / duration : 0;
  const stage = getStageTransform(delta, isDesktop);

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

  function handleTogglePlay(e) {
    e.stopPropagation();
    onFocus();
    if (isActive) {
      audioRef.current?.pause();
      stopClock();
      onPause();
      return;
    }
    onPlay(track.id);
    audioRef.current?.play().catch(() => {
      // audio placeholder mungkin gagal load (offline dll) -- biarin, clock
      // internal tetap jalan supaya UI tidak terasa macet.
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
    e.stopPropagation();
    onFocus();
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
      initial={false}
      animate={{
        x: stage.x,
        rotateY: stage.rotateY,
        z: stage.z,
        scale: stage.scale,
        opacity: stage.opacity,
      }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      style={{ zIndex: isFocused ? 30 : 20 - Math.abs(delta), transformStyle: "preserve-3d" }}
      className={`relative shrink-0 w-[132px] sm:w-[250px] ${index > 0 ? "-ml-12 sm:ml-0" : ""}`}
    >
      <div
        role="button"
        tabIndex={isFocused ? -1 : 0}
        aria-label={`Fokuskan kartu ${track.title}`}
        onClick={() => !isFocused && onFocus()}
        onKeyDown={(e) => {
          if (!isFocused && (e.key === "Enter" || e.key === " ")) onFocus();
        }}
        className={`overflow-hidden rounded-none shadow-2xl shadow-black/50 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-white/70 ${
          isFocused ? "cursor-default" : "cursor-pointer"
        }`}
      >
        {/* cover */}
        <div className="relative h-24 sm:h-48 w-full bg-black/40">
          <img
            src={track.cover}
            alt={`Cover ${track.title} - ${track.creator}`}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover select-none"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-16"
            style={{ background: `linear-gradient(to top, ${track.panelColor}, transparent)` }}
          />
        </div>

        {/* panel info + kontrol */}
        <div className="px-2.5 pt-2 pb-2.5 sm:px-5 sm:pt-4 sm:pb-5" style={{ background: track.panelColor }}>
          <audio
            ref={audioRef}
            src={track.src}
            preload="metadata"
            onLoadedMetadata={(e) => {
              if (Number.isFinite(e.currentTarget.duration)) {
                setDuration(e.currentTarget.duration);
              }
            }}
            className="hidden"
          />

          <p className="font-display font-bold text-[11px] sm:text-lg text-white leading-tight truncate">
            {track.title}
          </p>
          <p className="font-body text-[9px] sm:text-sm text-white/55 mt-0.5 truncate">{track.creator}</p>

          {/* progress bar */}
          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label={`Seek posisi audio ${track.title}`}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration || 0)}
            aria-valuenow={Math.round(currentTime)}
            onPointerDown={handlePointerDown}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => !isDragging && setShowTooltip(false)}
            className="relative mt-2 sm:mt-5 h-3 sm:h-4 flex items-center cursor-pointer touch-none select-none"
          >
            <div className="relative h-[3px] sm:h-1 w-full rounded-full bg-white/20">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white shadow"
              style={{ left: `calc(${progress * 100}% - 4px)` }}
            />
            {showTooltip && (
              <span
                className="absolute -top-6 -translate-x-1/2 rounded-md bg-white px-1.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-black shadow"
                style={{ left: `${progress * 100}%` }}
              >
                {formatTime(currentTime)}
              </span>
            )}
          </div>

          <div className="mt-1 sm:mt-1.5 flex items-center justify-between text-[9px] sm:text-xs tabular-nums text-white/50">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* kontrol prev / play-pause / next */}
          <div className="mt-1.5 sm:mt-4 flex items-center justify-center gap-2.5 sm:gap-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFocus();
                skip(-10);
              }}
              aria-label={`Mundur 10 detik - ${track.title}`}
              className="text-white/70 hover:text-white transition-colors"
            >
              <SkipBack className="h-2.5 w-2.5 sm:h-4 sm:w-4" fill="currentColor" />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isActive ? `Jeda ${track.title}` : `Putar ${track.title}`}
              className="flex h-7 w-7 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-lg transition-transform active:scale-95"
            >
              {isActive ? (
                <Pause className="h-3 w-3 sm:h-4.5 sm:w-4.5 text-black" fill="currentColor" />
              ) : (
                <Play className="h-3 w-3 sm:h-4.5 sm:w-4.5 ml-0.5 text-black" fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFocus();
                skip(10);
              }}
              aria-label={`Maju 10 detik - ${track.title}`}
              className="text-white/70 hover:text-white transition-colors"
            >
              <SkipForward className="h-2.5 w-2.5 sm:h-4 sm:w-4" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrendingSoundSection() {
  const [playingId, setPlayingId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
      <div className="relative mx-auto max-w-5xl px-0 sm:px-6">
        <div className="relative overflow-hidden rounded-none sm:rounded-[2rem] bg-[#0b0710] py-14 sm:py-24">
          {/* background: duplikat cover 3 kartu, disusun flat sejajar rata
              (tanpa efek 3D), opacity diturunin + di-blur jadi ambient
              backdrop. Kartu utama di depan (3D carousel) sama sekali nggak
              disentuh. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center gap-4 sm:gap-10 opacity-30 blur-md sm:blur-lg"
          >
            {TRACKS.map((track) => (
              <div
                key={`bg-${track.id}`}
                className="h-36 w-36 sm:h-64 sm:w-64 shrink-0 overflow-hidden rounded-2xl"
                style={{ background: track.panelColor }}
              >
                <img
                  src={track.cover}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* stage 3D: perspective di parent, tiap kartu diposisikan lewat
              rotateY + translateZ supaya kelihatan "melipat" ke belakang.
              Tinggi container ngikutin konten (bukan angka fix) supaya kartu
              selalu center vertikal, di semua ukuran layar. */}
          <div
            className="relative mx-auto flex w-full max-w-md items-center justify-center overflow-visible gap-1 sm:gap-6"
            style={{ perspective: isDesktop ? "1600px" : "900px" }}
          >
            {TRACKS.map((track, i) => {
              const delta = getCircularDelta(i, activeIndex, TRACKS.length);
              return (
                <PlayerCard
                  key={track.id}
                  track={track}
                  index={i}
                  delta={delta}
                  isFocused={i === activeIndex}
                  isDesktop={isDesktop}
                  isActive={playingId === track.id}
                  onPlay={setPlayingId}
                  onPause={() => setPlayingId(null)}
                  onFocus={() => setActiveIndex(i)}
                />
              );
            })}
          </div>

          {/* indikator titik — pilih kartu tanpa klik langsung ke kartunya */}
          <div className="relative mt-6 flex items-center justify-center gap-2">
            {TRACKS.map((track, i) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Fokuskan ${track.title}`}
                aria-current={i === activeIndex}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
