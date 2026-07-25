"use client";

import * as React from "react";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";
import { TiktokOverlay } from "@/components/ui/tiktok-overlay";
import { MusicPlayerCard } from "@/components/ui/music-player-card";
import { PlaylistPanel } from "@/components/ui/playlist-panel";
import { CardStylePanel } from "@/components/ui/card-style-panel";
import { useLocalPlaylist } from "@/hooks/use-local-playlist";

// ============================================================================
// TiktokPreviewScene -- mockup HP + overlay chrome TikTok, dengan
// MusicPlayerCard sebagai "konten utama" (layer di BAWAH overlay, persis
// posisi video kalau ini beneran TikTok). Background ambient (sampul aktif
// yang di-blur, penuh 1 layar) tetap dipertahankan dari now-playing-scene
// supaya area kosong di sekitar card nggak keliatan kosong-hitam-polos.
//
// Layer (dari bawah ke atas):
//   1. background ambient (blur sampul aktif) -- blur-nya dinamis, dikontrol
//      lewat CardStylePanel (bgBlur, satuan px, bukan class Tailwind statis)
//   2. MusicPlayerCard -- lebar dibuat mengisi hampir penuh area layar
//      (cuma dikasih sedikit inset kiri-kanan-atas-bawah) supaya
//      proporsinya nggak "lonjong"/kekecilan kayak sebelumnya. Kolom aksi
//      kanan & caption dari overlay boleh numpuk tipis di atas tepi card --
//      ini normal & sama seperti TikTok asli (video full-screen, chrome
//      UI melayang tipis di atasnya). Opacity background card juga dinamis
//      (bgOpacity) supaya bisa "nyatu" sama background ambient.
//   3. TiktokOverlay -- chrome TikTok, transparan di tengah jadi card di
//      bawahnya tetap keliatan
//
// PlaylistPanel (upload lagu, ganti sampul) & CardStylePanel (opacity card +
// blur background) tetap di LUAR mockup HP -- nyambung ke instance
// useLocalPlaylist() & state style yang sama, jadi berubah langsung
// ke-refleksi ke card di dalam HP.
// ============================================================================
export function TiktokPreviewScene() {
  const controller = useLocalPlaylist();
  const { audioRef, current } = controller;

  const [bgOpacity, setBgOpacity] = React.useState(55);
  const [bgBlur, setBgBlur] = React.useState(64);

  return (
    <div className="flex flex-col items-center gap-8">
      <Iphone15Pro className="h-auto w-[240px] drop-shadow-2xl sm:w-[280px]">
        <div className="relative h-full w-full overflow-hidden bg-black">
          {/* ---- 1. background ambient: sampul aktif, di-blur & penuh 1 layar ---- */}
          <div className="absolute inset-0">
            {current?.coverUrl ? (
              <img
                src={current.coverUrl}
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

          {/* ---- 2. konten utama: MusicPlayerCard, mengisi hampir penuh
                     lebar layar, diposisikan di antara top bar & bottom nav ---- */}
          <div className="absolute inset-x-2 top-[42px] bottom-[100px] flex items-center justify-center">
            <MusicPlayerCard controller={controller} bgOpacity={bgOpacity} />
          </div>

          {/* ---- 3. overlay chrome TikTok, nempel di atas semuanya ---- */}
          <TiktokOverlay likeCount={53} commentCount={5} saveCount={13} shareCount={28} />
        </div>
      </Iphone15Pro>

      <div className="flex w-full max-w-[280px] flex-col gap-4">
        <PlaylistPanel controller={controller} />
        <CardStylePanel
          bgOpacity={bgOpacity}
          onBgOpacityChange={setBgOpacity}
          bgBlur={bgBlur}
          onBgBlurChange={setBgBlur}
        />
      </div>

      <audio ref={audioRef} preload="metadata" className="hidden" />
    </div>
  );
}
