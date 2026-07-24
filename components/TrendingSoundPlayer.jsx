"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

// Data kartu (title, creator, cover, audio, panelColor) sekarang datang dari
// database (tabel `trending_sounds` di Supabase) lewat prop `tracks`, dikirim
// dari TrendingSoundSection.jsx (Server Component). Diedit oleh admin lewat
// /dashboard/trending-sound -- bukan hardcode di file ini lagi.

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

function PlayerCard({ track, index, delta, isPlaying, isFocused, isDesktop, onTogglePlay, onPlaybackSync, onFocus }) {
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  // Nomor "permintaan" play/pause terakhir -- dipakai buat nge-drop hasil
  // play() yang telat/basi (misal user klik play lalu buru-buru pause
  // sebelum promise-nya resolve). Tanpa ini, play() yang telat resolve bisa
  // nyalain audio lagi padahal user udah mau pause -- itu penyebab utama
  // tombol "kadang gabisa di-play / abis di-play gabisa di-pause".
  const requestIdRef = useRef(0);

  const [duration, setDuration] = useState(track.durationFallback);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const progress = duration ? currentTime / duration : 0;
  const stage = getStageTransform(delta, isDesktop);

  // Satu-satunya tempat yang benar-benar manggil audio.play() / .pause().
  // "Kartu yang lagi diputar" sekarang SAMA PERSIS dengan "kartu yang lagi
  // fokus/terpilih" -- cuma ada 1 sumber state (isPlaying, dikelola di
  // parent), jadi nggak mungkin ada 2 kartu mikir dirinya sendiri yang
  // "aktif" di saat bersamaan. Effect ini tinggal nurut ke isPlaying.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const requestId = ++requestIdRef.current;

    if (isPlaying) {
      if (!audio.paused) return; // sudah main, tidak perlu play() lagi
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // audio placeholder mungkin gagal load (offline / autoplay
          // diblokir dll). Kalau ini masih permintaan terakhir, sinkronkan
          // balik state ke parent supaya ikon tombol tidak nyangkut di
          // "Pause" padahal audio sebenarnya diam.
          if (requestId === requestIdRef.current) {
            onPlaybackSync(false);
          }
        });
      }
    } else if (!audio.paused) {
      audio.pause();
    }
  }, [isPlaying, onPlaybackSync]);

  function handleTogglePlay(e) {
    e.stopPropagation();
    onTogglePlay();
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
    e.stopPropagation();
    e.preventDefault();
    onFocus();
    setIsDragging(true);
    setShowTooltip(true);
    seekFromClientX(e.clientX);
    // Pointer capture: pastikan gerakan jari/kursor tetap "nempel" ke
    // slider ini walau posisinya keluar dari batas elemen -- tanpa ini,
    // drag suka putus di tengah jalan (terutama di HP / gerakan cepat).
    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // beberapa browser lama bisa lempar error kalau pointerId sudah
        // tidak valid -- aman diabaikan, drag tetap jalan lewat listener
        // di window sebagai fallback.
      }
    }
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
          {/* logo Sopan Team, pojok kanan atas — sama kayak badge di kartu
              Trending Edit, cuma dipindah ke atas dan dibikin lebih kecil */}
          <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 shrink-0 flex items-center justify-center h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-white/90 shadow-md">
            <Image
              alt="Sopan Team"
              src="/sopan-logo-black.png"
              width={12}
              height={15}
              className="h-[8px] w-auto sm:h-[12px]"
            />
          </span>
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
            onTimeUpdate={(e) => {
              // Kalau lagi di-drag manual di progress bar, jangan ketimpa
              // sama posisi asli audio -- biar nggak "lompat balik" pas jari
              // masih nempel di slider.
              if (!isDragging) setCurrentTime(e.currentTarget.currentTime);
            }}
            onEnded={() => {
              setCurrentTime(0);
              onPlaybackSync(false);
            }}
            onPlay={() => onPlaybackSync(true)}
            onPause={() => onPlaybackSync(false)}
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
            data-lenis-prevent
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
          <div data-lenis-prevent className="mt-1.5 sm:mt-4 flex items-center justify-center gap-2.5 sm:gap-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFocus();
                skip(-5);
              }}
              aria-label={`Mundur 5 detik - ${track.title}`}
              className="text-white/70 hover:text-white transition-colors"
            >
              <SkipBack className="h-2.5 w-2.5 sm:h-4 sm:w-4" fill="currentColor" />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? `Jeda ${track.title}` : `Putar ${track.title}`}
              className="flex h-7 w-7 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? (
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
                skip(5);
              }}
              aria-label={`Maju 5 detik - ${track.title}`}
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

export default function TrendingSoundPlayer({ tracks }) {
  // "Kartu yang lagi diputar" digabung jadi satu sama "kartu yang lagi
  // fokus" -- cuma ada 1 flag boolean (isPlaying) buat activeIndex yang
  // sekarang, BUKAN id per-kartu kayak sebelumnya. Jadi nggak mungkin ada
  // 2 kartu yang mikir dirinya "aktif" secara bersamaan / tabrakan logic:
  // pindah fokus ke kartu lain otomatis mematikan audio kartu sebelumnya.
  const [activeIndex, setActiveIndex] = useState(Math.min(1, tracks.length - 1));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Pindah fokus ke kartu lain (klik kartu / titik indikator / geser) --
  // kalau kartu tujuannya beda dari yang sekarang fokus, audio yang lagi
  // jalan otomatis berhenti. Kalau kartu yang sama diklik ulang (misal
  // buat drag progress bar / skip), status main tidak diganggu.
  function focusIndex(i) {
    if (i !== activeIndex) {
      setIsPlaying(false);
    }
    setActiveIndex(i);
  }

  // Tombol play/pause: kartu yang dipencet play-nya otomatis jadi yang
  // fokus DAN yang main -- kartu lain otomatis berhenti (activeIndex-nya
  // berubah, jadi bukan lagi "yang main").
  function handlePlayIndex(i) {
    if (i === activeIndex && isPlaying) {
      setIsPlaying(false);
    } else {
      setActiveIndex(i);
      setIsPlaying(true);
    }
  }

  // Disinkronkan langsung dari event asli elemen <audio> (play/pause/ended)
  // -- bukan cuma dari klik tombol. Ini sumber kebenaran yang sesungguhnya:
  // kalau browser menolak/menunda play() (autoplay policy, buffering,
  // dsb), state di sini otomatis ikut kondisi audio yang sebenarnya,
  // jadi ikon tombol nggak pernah nyangkut beda dari kondisi asli.
  // Hanya kartu yang lagi fokus yang boleh mempengaruhi state -- kartu
  // lain seharusnya diam (isPlaying prop-nya sudah false), jadi event
  // dari kartu itu diabaikan supaya tidak tabrakan.
  function handlePlaybackSync(i, playing) {
    if (i !== activeIndex) return;
    setIsPlaying(playing);
  }

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

      {/* Nggak ada panel gelap lagi — section-nya transparan, ngikutin
          background halaman (light/dark mode otomatis). Cuma ada shadow
          gradien di belakang kartu sebagai pemanis. */}
      <div className="relative mx-auto max-w-5xl px-0 sm:px-6">
        <div className="relative overflow-hidden rounded-none sm:rounded-[2rem] py-14 sm:py-24">
          {/* shadow gradien di belakang kartu — soft glow warna brand (ungu
              remix -> biru creator), diperkuat dikit biar lebih kerasa
              manis, tapi tetap nggak nutupin kartu di depannya. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className="h-56 w-80 sm:h-96 sm:w-[36rem] rounded-full opacity-60 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(176,38,255,0.75), rgba(61,90,254,0.5) 55%, transparent 75%)",
              }}
            />
          </div>

          {/* stage 3D: perspective di parent, tiap kartu diposisikan lewat
              rotateY + translateZ supaya kelihatan "melipat" ke belakang.
              Tinggi container ngikutin konten (bukan angka fix) supaya kartu
              selalu center vertikal, di semua ukuran layar. */}
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
                  isDesktop={isDesktop}
                  isPlaying={i === activeIndex && isPlaying}
                  onTogglePlay={() => handlePlayIndex(i)}
                  onPlaybackSync={(playing) => handlePlaybackSync(i, playing)}
                  onFocus={() => focusIndex(i)}
                />
              );
            })}
          </div>

          {/* indikator titik — pilih kartu tanpa klik langsung ke kartunya */}
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
        </div>
      </div>
    </section>
  );
}
