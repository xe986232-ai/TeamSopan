"use client";

import * as React from "react";
import { Cast } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Icon custom (bukan lucide-react) -- bentuknya disamain persis sama SVG di
// referensi HTML music player yang dikasih user: play/pause standar, tapi
// prev/next berupa DOUBLE TRIANGLE tanpa garis batang (beda dari
// SkipBack/SkipForward bawaan lucide), dan speaker kiri/kanan tanpa vs
// dengan gelombang suara.
// ============================================================================
function PlayIcon({ size = 24, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ size = 24, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}

function PrevIcon({ size = 24, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.5 12 22 5v14zM3 12l9.5-7v14z" />
    </svg>
  );
}

function NextIcon({ size = 24, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.5 12 2 19V5zM21 12l-9.5 7V5z" />
    </svg>
  );
}

function VolumeLowIcon({ size = 24, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3 9v6h4l5 5V4L7 9z" />
    </svg>
  );
}

function VolumeHighIcon({ size = 24, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3 9v6h4l5 5V4L7 9zM16.5 12A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

// ============================================================================
// MusicPlayerCard -- CUMA tampilan player-nya (cover, judul, progress,
// transport, volume). Sengaja dibikin kecil (max-w rendah) supaya kalau
// dipasang di dalam mockup HP, ada ruang kosong di sekitarnya buat
// ngeliatin background ambient yang di-blur di belakangnya -- persis
// referensi gambar yang dikasih user.
//
// PENTING (Remotion migration): komponen ini SENGAJA dibikin "bodoh" / pure
// -- cuma nerima primitif (angka, string, boolean) & callback lewat props,
// TIDAK pernah baca DOM (getBoundingClientRect, dst) atau nyimpen state
// sendiri. Ini SATU-SATUNYA versi MusicPlayerCard yang ada -- dipakai
// PERSIS SAMA baik oleh:
//   1. Preview browser (TiktokPreviewScene) -- lewat props `interactive`
//      terhubung ke instance useLocalPlaylist() beneran (bisa diklik/geser).
//   2. Komposisi Remotion (remotion/TiktokOverlayComposition.jsx) -- posisi
//      progress bar & waktu dihitung dari `currentFrame / fps`, bukan dari
//      audio.currentTime real-time, dan `interactive=false` (statis, gak
//      ada event handler yang dipasang).
// Jangan pernah bikin varian lain (mis. MusicPlayerCardExport.jsx) -- kalau
// ada perubahan tampilan, cukup ubah di sini, otomatis kepakai di preview
// maupun hasil render video/gambar.
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

export function MusicPlayerCard({
  className,
  // ---- konten ----
  coverUrl = null,
  title = "Belum ada lagu",
  subtitle = "Tambahkan lagu di panel bawah",
  bgOpacity = 85,
  // ---- transport state (semuanya angka/boolean polos, bukan objek DOM) ----
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  seekPct = 0,
  volume = 70,
  // ---- interaktivitas: true = preview browser (tombol & slider aktif),
  //      false = render Remotion (statis, tanpa event handler) ----
  interactive = true,
  onTogglePlay,
  onSkip,
  onSeekChange,
  onSetSeeking,
  onVolumeChange,
  // ---- tag pembungkus gambar: default <img> biasa (preview browser).
  //      Remotion mengoper komponen `Img` miliknya sendiri di sini supaya
  //      frame ditunggu sampai gambar selesai dimuat sebelum di-capture. ----
  ImgTag = "img",
}) {
  const remaining = Math.max((duration || 0) - currentTime, 0);

  return (
    <div className={cn("relative w-full max-w-[272px]", className)}>
      <div
        className="rounded-[1.75rem] backdrop-blur-xl p-3.5 shadow-2xl shadow-black/50 text-white"
        style={{ backgroundColor: `rgba(0, 0, 0, ${bgOpacity / 100})` }}
      >
        {/* ---- cover art ---- */}
        <div className="relative aspect-[10/9] w-full overflow-hidden rounded-[1.15rem] bg-white/5">
          {coverUrl ? (
            <ImgTag src={coverUrl} alt={`Sampul ${title}`} className="h-full w-full object-cover" draggable={false} />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-4 text-center text-[11px] text-white/30">
              {title ? "Belum ada sampul" : "Belum ada lagu diputar"}
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

        {/* ---- progress bar ----
            data-export-progress-row: dulu dipakai lib/export-stage-video.js
            (html2canvas) buat nemu koordinat progress bar biar bisa digambar
            ulang manual di atas canvas. Sekarang gak kepakai lagi (renderer
            Remotion ngerender komponen ini APA ADANYA, gak perlu diakalin),
            tapi atribut-nya dibiarin nempel siapa tau berguna buat targeting
            CSS/testing di masa depan. */}
        <div data-export-progress-row className="relative mt-3 flex h-3 items-center">
          {interactive ? (
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={seekPct}
              onChange={onSeekChange}
              onPointerDown={() => onSetSeeking?.(true)}
              onPointerUp={() => onSetSeeking?.(false)}
              aria-label="Posisi audio"
              className="mpc-range w-full"
              style={{ "--pct": `${seekPct}%` }}
            />
          ) : (
            // versi statis (non-interaktif) buat render Remotion -- visual
            // identik sama <input type="range"> di atas (track + thumb bulat)
            // tapi dibangun dari <div> polos, jadi hasilnya konsisten lintas
            // OS/browser headless (native range widget bisa beda tampilan
            // antar platform).
            <div className="mpc-range-static w-full" style={{ "--pct": `${seekPct}%` }}>
              <div className="mpc-range-static-thumb" />
            </div>
          )}
        </div>
        {/* data-export-time-row: keterangan sama kayak di atas -- sisa
            penanda lama, gak lagi dipakai buat capture manual. */}
        <div data-export-time-row className="mt-0.5 flex items-center justify-between text-[10.5px] tabular-nums text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatRemaining(remaining)}</span>
        </div>

        {/* ---- transport controls ---- */}
        <div className="mt-3 flex items-center justify-center gap-7">
          <button
            type="button"
            onClick={interactive ? () => onSkip?.(-10) : undefined}
            aria-label="Mundur 10 detik"
            tabIndex={interactive ? 0 : -1}
            className="text-white transition-opacity hover:opacity-70"
          >
            <PrevIcon size={19} />
          </button>
          <button
            type="button"
            onClick={interactive ? onTogglePlay : undefined}
            aria-label={isPlaying ? "Jeda" : "Putar"}
            tabIndex={interactive ? 0 : -1}
            className="text-white transition-opacity hover:opacity-70"
          >
            {isPlaying ? <PauseIcon size={25} /> : <PlayIcon size={25} />}
          </button>
          <button
            type="button"
            onClick={interactive ? () => onSkip?.(10) : undefined}
            aria-label="Maju 10 detik"
            tabIndex={interactive ? 0 : -1}
            className="text-white transition-opacity hover:opacity-70"
          >
            <NextIcon size={19} />
          </button>
        </div>

        {/* ---- volume ---- */}
        <div className="mt-3 flex items-center gap-2">
          <VolumeLowIcon size={13} className="shrink-0 text-white/60" />
          {interactive ? (
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => onVolumeChange?.(Number(e.target.value))}
              aria-label="Volume"
              className="mpc-range w-full"
              style={{ "--pct": `${volume}%` }}
            />
          ) : (
            <div className="mpc-range-static w-full" style={{ "--pct": `${volume}%` }}>
              <div className="mpc-range-static-thumb" />
            </div>
          )}
          <VolumeHighIcon size={15} className="shrink-0 text-white/60" />
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

        /* padanan visual <input type="range"> di atas, versi non-interaktif
           (dipakai render Remotion) -- posisi & style thumb HARUS senilai
           sama kayak .mpc-range di atas biar preview = export. */
        .mpc-range-static {
          position: relative;
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
        .mpc-range-static-thumb {
          position: absolute;
          top: 50%;
          left: var(--pct);
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
  );
}
