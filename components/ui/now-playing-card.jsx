"use client";

import * as React from "react";
import { Play, Pause, SkipBack, SkipForward, Cast, Volume1, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// NowPlayingCard -- widget "sedang memutar" gaya media player Android/iOS
// (referensi: screenshot yang dikirim -- cover besar, judul tebal, progress
// tipis, tombol transport, slider volume). Dibikin FULL BERFUNGSI (bukan
// cuma tampilan): kalau dikasih prop `src` (URL audio), komponen ini
// nge-handle play/pause, seek (drag di progress bar), skip mundur/maju 10
// detik, dan volume sendiri lewat 1 elemen <audio> internal.
//
// Background di belakang kartu = cover art yang sama, di-blur & discale
// gede (trik "ambient background" ala Apple Music/Android Now Playing) --
// jadi otomatis nyambung warna sama cover apa pun yang dipasang, nggak
// perlu ekstraksi warna dominan terpisah.
//
// Pemakaian:
//   <NowPlayingCard
//     cover="/covers/hey-kamu-gufron.jpg"
//     artist="ZuraRmx"
//     title="DJ HEY KAMU GUFRON"
//     subtitle="delynmybini"
//     src="/audio/hey-kamu-gufron.mp3"
//   />
// ============================================================================

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatRemaining(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "-0:00";
  return `-${formatTime(seconds)}`;
}

export function NowPlayingCard({ cover, artist, title, subtitle, src, className }) {
  const audioRef = React.useRef(null);
  const seekTrackRef = React.useRef(null);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(0.7);
  const [isSeeking, setIsSeeking] = React.useState(false);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      const p = audio.play();
      if (p && typeof p.catch === "function") p.catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  React.useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function togglePlay() {
    setIsPlaying((p) => !p);
  }

  function skip(deltaSeconds) {
    const audio = audioRef.current;
    const next = Math.min(Math.max(currentTime + deltaSeconds, 0), duration || 0);
    setCurrentTime(next);
    if (audio && Number.isFinite(audio.duration)) audio.currentTime = next;
  }

  const seekFromClientX = React.useCallback(
    (clientX) => {
      const el = seekTrackRef.current;
      if (!el || !duration) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const next = ratio * duration;
      setCurrentTime(next);
      if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
        audioRef.current.currentTime = next;
      }
    },
    [duration]
  );

  function handleSeekPointerDown(e) {
    setIsSeeking(true);
    seekFromClientX(e.clientX);
  }

  React.useEffect(() => {
    if (!isSeeking) return;
    const move = (e) => seekFromClientX(e.clientX);
    const up = () => setIsSeeking(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [isSeeking, seekFromClientX]);

  const progress = duration ? currentTime / duration : 0;
  const remaining = Math.max((duration || 0) - currentTime, 0);

  return (
    <div className={cn("relative w-full max-w-sm mx-auto", className)}>
      {/* ---- ambient background: cover yang sama, di-blur + di-scale ---- */}
      {cover && (
        <div className="pointer-events-none absolute -inset-10 -z-10 overflow-hidden rounded-[2.5rem]">
          <img
            src={cover}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-125 object-cover opacity-80 blur-3xl saturate-150"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      )}

      <div className="rounded-[2rem] bg-black/85 backdrop-blur-xl p-4 sm:p-5 shadow-2xl shadow-black/40 text-white">
        {/* ---- cover art ---- */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.4rem] bg-white/5">
          {cover ? (
            <img src={cover} alt={`Cover ${title}`} className="h-full w-full object-cover" draggable={false} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/30 text-xs">No cover</div>
          )}
        </div>

        {/* ---- meta: artist / title / subtitle + cast icon ---- */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] text-white/60 truncate">{artist}</p>
            <h3 className="font-display font-extrabold text-lg leading-snug truncate">{title}</h3>
            {subtitle && <p className="text-[13px] text-white/60 truncate">{subtitle}</p>}
          </div>
          <Cast size={20} className="shrink-0 mt-1 text-white/70" />
        </div>

        {/* ---- progress bar ---- */}
        <div
          ref={seekTrackRef}
          role="slider"
          tabIndex={0}
          aria-label="Posisi audio"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration || 0)}
          aria-valuenow={Math.round(currentTime)}
          onPointerDown={handleSeekPointerDown}
          className="relative mt-5 h-4 flex items-center cursor-pointer touch-none select-none"
        >
          <div className="relative h-[3px] w-full rounded-full bg-white/25">
            <div className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs tabular-nums text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatRemaining(remaining)}</span>
        </div>

        {/* ---- transport controls ---- */}
        <div className="mt-4 flex items-center justify-center gap-10">
          <button
            type="button"
            onClick={() => skip(-10)}
            aria-label="Mundur 10 detik"
            className="text-white hover:opacity-70 transition-opacity"
          >
            <SkipBack size={26} fill="currentColor" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Jeda" : "Putar"}
            className="text-white hover:opacity-70 transition-opacity"
          >
            {isPlaying ? <Pause size={34} fill="currentColor" /> : <Play size={34} fill="currentColor" />}
          </button>
          <button
            type="button"
            onClick={() => skip(10)}
            aria-label="Maju 10 detik"
            className="text-white hover:opacity-70 transition-opacity"
          >
            <SkipForward size={26} fill="currentColor" />
          </button>
        </div>

        {/* ---- volume ---- */}
        <div className="mt-5 flex items-center gap-3">
          <Volume1 size={16} className="shrink-0 text-white/60" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="now-playing-volume-range w-full"
            style={{ "--pct": `${volume * 100}%` }}
          />
          <Volume2 size={18} className="shrink-0 text-white/60" />
        </div>
      </div>

      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onLoadedMetadata={(e) => {
            if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration);
          }}
          onTimeUpdate={(e) => {
            if (!isSeeking) setCurrentTime(e.currentTarget.currentTime);
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
          className="hidden"
        />
      )}

      {/* Styling native <input type="range"> biar keliatan kayak slider di
          screenshot (thumb bulat putih, track terisi putih di kiri thumb) --
          nggak bisa full lewat Tailwind utility karena pseudo-element
          ::-webkit-slider-thumb / ::-moz-range-thumb. */}
      <style jsx>{`
        .now-playing-volume-range {
          -webkit-appearance: none;
          appearance: none;
          height: 3px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.95) var(--pct),
            rgba(255, 255, 255, 0.25) var(--pct),
            rgba(255, 255, 255, 0.25) 100%
          );
        }
        .now-playing-volume-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          cursor: pointer;
        }
        .now-playing-volume-range::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border: none;
          border-radius: 9999px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          cursor: pointer;
        }
        .now-playing-volume-range::-moz-range-track {
          height: 3px;
          border-radius: 9999px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
