"use client";

import * as React from "react";
import { Play, Pause, SkipBack, SkipForward, Cast, Volume1, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// MusicPlayerCard -- CUMA tampilan player-nya (cover, judul, progress,
// transport, volume). Sengaja dibikin kecil (max-w rendah) supaya kalau
// dipasang di dalam mockup HP, ada ruang kosong di sekitarnya buat
// ngeliatin background ambient yang di-blur di belakangnya -- persis
// referensi gambar yang dikasih user.
//
// Semua state & fungsi (play/pause/seek/volume/dst) DATANG dari luar lewat
// prop `controller`, yaitu hasil return dari hook `useLocalPlaylist()`.
// Komponen ini sendiri gak nyimpen state apa pun -- jadi upload lagu/sampul
// bisa dikontrol dari panel yang letaknya di luar mockup HP, sementara card
// ini cuma nampilin & ngerespon.
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

export function MusicPlayerCard({ controller, className }) {
  const { current, isPlaying, currentTime, remaining, seekPct, volume, setVolume, togglePlay, skip, handleSeekChange, setSeeking } =
    controller;

  const cover = current?.coverUrl || null;
  const title = current ? current.name : "Belum ada lagu";
  const subtitle = current ? "File lokal" : "Tambahkan lagu di panel bawah";

  return (
    <div className={cn("relative w-full max-w-[230px]", className)}>
      <div className="rounded-[1.75rem] bg-gradient-to-b from-white/[0.12] via-black/85 via-30% to-black/90 backdrop-blur-xl p-3.5 shadow-2xl shadow-black/50 text-white">
        {/* ---- cover art ---- */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.15rem] bg-white/5">
          {cover ? (
            <img src={cover} alt={`Sampul ${title}`} className="h-full w-full object-cover" draggable={false} />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-4 text-center text-[11px] text-white/30">
              {current ? "Belum ada sampul" : "Belum ada lagu diputar"}
            </div>
          )}
        </div>

        {/* ---- judul + cast icon ---- */}
        <div className="mt-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-extrabold text-[14px] leading-snug truncate">{title}</h3>
            <p className="text-[11px] text-white/60 truncate">{subtitle}</p>
          </div>
          <Cast size={16} className="mt-0.5 shrink-0 text-white/70" />
        </div>

        {/* ---- progress bar ---- */}
        <div className="relative mt-3 flex h-3 items-center">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={seekPct}
            onChange={handleSeekChange}
            onPointerDown={() => setSeeking(true)}
            onPointerUp={() => setSeeking(false)}
            aria-label="Posisi audio"
            className="mpc-range w-full"
            style={{ "--pct": `${seekPct}%` }}
          />
        </div>
        <div className="mt-0.5 flex items-center justify-between text-[10.5px] tabular-nums text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatRemaining(remaining)}</span>
        </div>

        {/* ---- transport controls ---- */}
        <div className="mt-3 flex items-center justify-center gap-7">
          <button type="button" onClick={() => skip(-10)} aria-label="Mundur 10 detik" className="text-white transition-opacity hover:opacity-70">
            <SkipBack size={19} fill="currentColor" />
          </button>
          <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Jeda" : "Putar"} className="text-white transition-opacity hover:opacity-70">
            {isPlaying ? <Pause size={25} fill="currentColor" /> : <Play size={25} fill="currentColor" />}
          </button>
          <button type="button" onClick={() => skip(10)} aria-label="Maju 10 detik" className="text-white transition-opacity hover:opacity-70">
            <SkipForward size={19} fill="currentColor" />
          </button>
        </div>

        {/* ---- volume ---- */}
        <div className="mt-3 flex items-center gap-2">
          <Volume1 size={13} className="shrink-0 text-white/60" />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="mpc-range w-full"
            style={{ "--pct": `${volume}%` }}
          />
          <Volume2 size={15} className="shrink-0 text-white/60" />
        </div>
      </div>

      <style jsx>{`
        .mpc-range {
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
        .mpc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          cursor: pointer;
        }
        .mpc-range::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border: none;
          border-radius: 9999px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          cursor: pointer;
        }
        .mpc-range::-moz-range-track {
          height: 3px;
          border-radius: 9999px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
