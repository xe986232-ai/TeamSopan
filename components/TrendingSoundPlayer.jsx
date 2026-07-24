"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

// Data kartu (title, creator, cover, audio, panelColor) sekarang datang dari
// database (tabel `trending_sounds` di Supabase) lewat prop `tracks`, dikirim
// dari TrendingSoundSection.jsx (Server Component). Diedit oleh admin lewat
// /dashboard/trending-sound -- bukan hardcode di file ini lagi.
//
// ARSITEKTUR (revisi): kontrol audio (progress bar + tombol play/pause/skip)
// SENGAJA dipisah total dari kartu carousel 3D. Sebelumnya kontrol itu hidup
// di dalam kartu yang kena `rotateY` / `translateZ` / `preserve-3d` -- browser
// mobile (WebKit/Safari khususnya) punya riwayat bug hit-testing (area yang
// kedaftar kena tap jadi salah/nggak presisi) untuk elemen interaktif yang
// duduk di dalam context transform 3D kayak gitu. Supaya nggak ketebak-tebak
// lagi, kontrolnya sekarang dipindah ke "dock" biasa di bawah carousel --
// tanpa transform sama sekali di ancestor-nya. Kartu di carousel jadi murni
// visual + tombol fokus/play pakai <button> asli (bukan div role="button").
// Audio-nya juga disatukan jadi 1 elemen <audio> saja (src ganti sesuai lagu
// yang lagi fokus), bukan 1 <audio> per kartu.

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

// Kartu carousel -- MURNI VISUAL + 1 tombol fokus/play. Nggak ada <audio>,
// nggak ada progress bar, nggak ada state playback di sini sama sekali.
function PlayerCard({ track, index, delta, isFocused, isPlaying, isDesktop, onTap }) {
  const stage = getStageTransform(delta, isDesktop);

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
      <button
        type="button"
        onClick={onTap}
        aria-label={
          isFocused ? (isPlaying ? `Jeda ${track.title}` : `Putar ${track.title}`) : `Fokuskan & putar ${track.title}`
        }
        className="block w-full overflow-hidden rounded-none shadow-2xl shadow-black/50 outline-none text-left focus-visible:ring-2 focus-visible:ring-white/70"
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
          {/* logo Sopan Team, pojok kanan atas */}
          <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 shrink-0 flex items-center justify-center h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-white/90 shadow-md">
            <Image
              alt="Sopan Team"
              src="/sopan-logo-black.png"
              width={12}
              height={15}
              className="h-[8px] w-auto sm:h-[12px]"
            />
          </span>
          {/* indikator play/pause -- cuma tampil di kartu yang lagi fokus,
              murni visual (bukan target tap terpisah, tap-nya ditangani sama
              <button> pembungkus di atas) */}
          {isFocused && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-black" fill="currentColor" />
                ) : (
                  <Play className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 ml-0.5 text-black" fill="currentColor" />
                )}
              </span>
            </span>
          )}
        </div>

        {/* title/creator saja -- nggak ada kontrol di sini lagi */}
        <div className="px-2.5 pt-2 pb-2.5 sm:px-5 sm:pt-4 sm:pb-5" style={{ background: track.panelColor }}>
          <p className="font-display font-bold text-[11px] sm:text-lg text-white leading-tight truncate">
            {track.title}
          </p>
          <p className="font-body text-[9px] sm:text-sm text-white/55 mt-0.5 truncate">{track.creator}</p>
        </div>
      </button>
    </motion.div>
  );
}

// Dock kontrol -- SELALU di luar area transform 3D. Cuma nge-render 1 lagu
// yang lagi fokus (activeTrack), terlepas dari animasi carousel-nya.
function ControlDock({
  track,
  isPlaying,
  currentTime,
  duration,
  trackRef,
  showTooltip,
  onPointerDown,
  onMouseEnter,
  onMouseLeave,
  onTogglePlay,
  onSkip,
}) {
  const progress = duration ? currentTime / duration : 0;

  return (
    <div className="relative mx-auto mt-8 w-full max-w-xs sm:max-w-sm px-6">
      <p className="text-center font-display font-bold text-sm sm:text-base text-ink truncate">{track.title}</p>
      <p className="text-center font-body text-xs sm:text-sm text-ink-muted mt-0.5 truncate">{track.creator}</p>

      {/* progress bar -- plain div, tanpa ancestor transform 3D apapun */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        data-lenis-prevent
        aria-label={`Seek posisi audio ${track.title}`}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration || 0)}
        aria-valuenow={Math.round(currentTime)}
        onPointerDown={onPointerDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative mt-4 h-4 flex items-center cursor-pointer touch-none select-none"
      >
        <div className="relative h-1 w-full rounded-full bg-ink/15">
          <div className="absolute inset-y-0 left-0 rounded-full bg-ink" style={{ width: `${progress * 100}%` }} />
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-ink shadow"
          style={{ left: `calc(${progress * 100}% - 6px)` }}
        />
        {showTooltip && (
          <span
            className="absolute -top-7 -translate-x-1/2 rounded-md bg-ink px-1.5 py-0.5 text-[11px] font-semibold text-base shadow"
            style={{ left: `${progress * 100}%` }}
          >
            {formatTime(currentTime)}
          </span>
        )}
      </div>

      <div className="mt-1.5 flex items-center justify-between text-xs tabular-nums text-ink-muted">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div data-lenis-prevent className="mt-4 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => onSkip(-10)}
          aria-label={`Mundur 10 detik - ${track.title}`}
          className="text-ink-muted hover:text-ink transition-colors"
        >
          <SkipBack className="h-4 w-4" fill="currentColor" />
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? `Jeda ${track.title}` : `Putar ${track.title}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-ink shadow-lg transition-transform active:scale-95"
        >
          {isPlaying ? (
            <Pause className="h-4.5 w-4.5 text-base" fill="currentColor" />
          ) : (
            <Play className="h-4.5 w-4.5 ml-0.5 text-base" fill="currentColor" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSkip(10)}
          aria-label={`Maju 10 detik - ${track.title}`}
          className="text-ink-muted hover:text-ink transition-colors"
        >
          <SkipForward className="h-4 w-4" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

export default function TrendingSoundPlayer({ tracks }) {
  const initialIndex = Math.min(1, tracks.length - 1);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [duration, setDuration] = useState(tracks[initialIndex]?.durationFallback || 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const audioRef = useRef(null);
  const trackRef = useRef(null);

  const activeTrack = tracks[activeIndex];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Satu-satunya tempat yang manggil audio.play()/.pause(), untuk SATU
  // elemen <audio> bersama. Jalan ulang tiap kali isPlaying berubah ATAU
  // activeIndex berubah (karena src-nya ganti lagu).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, activeIndex]);

  // Pindah fokus (klik titik indikator) -- audio yang lagi jalan berhenti,
  // waktu & durasi direset ke lagu baru (durasi asli nyusul lewat
  // onLoadedMetadata pas audio-nya kepanggil).
  function focusIndex(i) {
    if (i === activeIndex) return;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(tracks[i].durationFallback || 0);
    setActiveIndex(i);
  }

  // Tap kartu / tombol play: kartu yang sama -> toggle play/pause. Kartu
  // beda -> pindah fokus SEKALIGUS langsung main.
  function handlePlayIndex(i) {
    if (i === activeIndex) {
      setIsPlaying((p) => !p);
      return;
    }
    setCurrentTime(0);
    setDuration(tracks[i].durationFallback || 0);
    setActiveIndex(i);
    setIsPlaying(true);
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
        <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 text-ink">Trending Sound</h2>
        <p className="mt-3 text-ink-muted">Karya remix yang lagi rame didengar dari komunitas SOPAN TEAM.</p>
      </motion.div>

      <div className="relative mx-auto max-w-5xl px-0 sm:px-6">
        <div className="relative overflow-hidden rounded-none sm:rounded-[2rem] py-14 sm:py-24">
          {/* glow di belakang carousel -- warnanya ikut panelColor lagu yang
              lagi fokus/main (activeTrack), bukan fixed ungu-biru lagi.
              Transisi background di-animate pakai motion.div biar pindah
              warna antar lagu halus (fade), bukan "kaget" langsung ganti. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              className="h-56 w-80 sm:h-96 sm:w-[36rem] rounded-full opacity-60 blur-3xl"
              animate={{
                background: `radial-gradient(ellipse at center, ${activeTrack.panelColor}b3, ${activeTrack.panelColor}59 55%, transparent 75%)`,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>

          {/* stage 3D -- MURNI VISUAL, nggak ada elemen interaktif audio di
              dalamnya sama sekali lagi. */}
          <div
            className="relative mx-auto flex w-full max-w-md items-center justify-center overflow-visible gap-1 sm:gap-6"
            style={{ perspective: isDesktop ? "1600px" : "900px" }}
          >
            {tracks.map((track, i) => {
              const delta = getCircularDelta(i, activeIndex, tracks.length);
              return (
                <PlayerCard
                  key={track.id}
                  track={track}
                  index={i}
                  delta={delta}
                  isFocused={i === activeIndex}
                  isPlaying={i === activeIndex && isPlaying}
                  isDesktop={isDesktop}
                  onTap={() => handlePlayIndex(i)}
                />
              );
            })}
          </div>

          {/* indikator titik */}
          <div className="relative mt-6 flex items-center justify-center gap-2">
            {tracks.map((track, i) => (
              <button
                key={track.id}
                type="button"
                onClick={() => focusIndex(i)}
                aria-label={`Fokuskan ${track.title}`}
                aria-current={i === activeIndex}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-6 bg-ink" : "w-1.5 bg-ink/25 hover:bg-ink/40"
                }`}
              />
            ))}
          </div>

          {/* dock kontrol -- di luar total dari stage 3D di atas */}
          <ControlDock
            track={activeTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            trackRef={trackRef}
            showTooltip={showTooltip}
            onPointerDown={handlePointerDown}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => !isDragging && setShowTooltip(false)}
            onTogglePlay={() => handlePlayIndex(activeIndex)}
            onSkip={skip}
          />

          <audio
            ref={audioRef}
            src={activeTrack.src}
            preload="metadata"
            onLoadedMetadata={(e) => {
              if (Number.isFinite(e.currentTarget.duration)) {
                setDuration(e.currentTarget.duration);
              }
            }}
            onTimeUpdate={(e) => {
              if (!isDragging) setCurrentTime(e.currentTarget.currentTime);
            }}
            onEnded={() => {
              setCurrentTime(0);
              setIsPlaying(false);
            }}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
}
