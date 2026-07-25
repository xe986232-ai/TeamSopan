"use client";

import * as React from "react";
import { MusicPlayerCard } from "@/components/ui/music-player-card";

// ============================================================================
// TiktokStage -- "panggung" rasio 9:16 (background ambient blur + kartu
// musik di tengah), TANPA chrome TikTok (status bar/tab/aksi kanan/bottom
// nav -- itu urusan <TiktokOverlay>, dipasang terpisah di LUAR komponen
// ini). Ini persis konten yang di-render jadi gambar/video ekspor.
//
// SATU-SATUNYA versi -- dipakai identik oleh:
//   1. TiktokPreviewScene (browser) -- background pakai CSS `filter: blur()`
//      bawaan browser.
//   2. remotion/TiktokOverlayComposition.jsx -- Remotion me-render komponen
//      React yang SAMA PERSIS lewat Chromium headless, jadi CSS blur/
//      backdrop-filter yang gak didukung html2canvas dulu, sekarang otomatis
//      kepakai tanpa perlu di-"bake" manual ke canvas lagi.
//
// Kalau butuh ubah tampilan panggung (posisi card, gradient overlay, dst),
// cukup ubah di sini -- preview & hasil ekspor otomatis ikut berubah sama-
// sama, gak akan pernah beda lagi.
// ============================================================================
export function TiktokStage({
  className,
  coverUrl = null,
  bgBlur = 64,
  bgOpacityCard = 55,
  title = "Belum ada lagu",
  subtitle = "Tambahkan lagu di panel bawah",
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  seekPct = 0,
  volume = 70,
  interactive = true,
  onTogglePlay,
  onSkip,
  onSeekChange,
  onSetSeeking,
  onVolumeChange,
  ImgTag = "img",
  stageRef,
}) {
  return (
    <div ref={stageRef} className={className ?? "relative aspect-[9/16] w-full overflow-hidden bg-black"}>
      {/* background ambient: sampul aktif, di-blur, ngisi penuh panggung */}
      <div className="absolute inset-0">
        {coverUrl ? (
          <ImgTag
            data-export-ambient-bg
            src={coverUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-125 object-cover opacity-90 saturate-150"
            style={{ filter: `blur(${bgBlur}px)` }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-neutral-800 via-neutral-900 to-black" />
        )}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* konten utama: MusicPlayerCard, di tengah panggung */}
      <div className="absolute inset-0 flex items-center justify-center px-3">
        <MusicPlayerCard
          coverUrl={coverUrl}
          title={title}
          subtitle={subtitle}
          bgOpacity={bgOpacityCard}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          seekPct={seekPct}
          volume={volume}
          interactive={interactive}
          onTogglePlay={onTogglePlay}
          onSkip={onSkip}
          onSeekChange={onSeekChange}
          onSetSeeking={onSetSeeking}
          onVolumeChange={onVolumeChange}
          ImgTag={ImgTag}
        />
      </div>
    </div>
  );
}
