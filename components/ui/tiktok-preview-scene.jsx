"use client";

import * as React from "react";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";
import { TiktokOverlay } from "@/components/ui/tiktok-overlay";
import { MusicPlayerCard } from "@/components/ui/music-player-card";
import { PlaylistPanel } from "@/components/ui/playlist-panel";
import { useLocalPlaylist } from "@/hooks/use-local-playlist";

// ============================================================================
// TiktokPreviewScene -- mockup HP + overlay chrome TikTok, dengan
// MusicPlayerCard sebagai "konten utama" (layer di BAWAH overlay, persis
// posisi video kalau ini beneran TikTok). Background ambient (sampul aktif
// yang di-blur, penuh 1 layar) tetap dipertahankan dari now-playing-scene
// supaya area kosong di sekitar card nggak keliatan kosong-hitam-polos.
//
// Layer (dari bawah ke atas):
//   1. background ambient (blur sampul aktif)
//   2. MusicPlayerCard -- diposisikan center, dikecilin (max-w) & digeser
//      supaya nggak numpuk sama kolom aksi kanan (like/komen/simpan/share)
//      atau baris username/caption/bottom-nav dari overlay
//   3. TiktokOverlay -- chrome TikTok, transparan di tengah jadi card di
//      bawahnya tetap keliatan
//
// PlaylistPanel (upload lagu, ganti sampul) tetap di LUAR mockup HP, sama
// seperti /preview-nowplaying -- nyambung ke instance useLocalPlaylist()
// yang sama, jadi begitu upload/pilih lagu di panel, card di dalam HP
// langsung update.
// ============================================================================
export function TiktokPreviewScene() {
  const controller = useLocalPlaylist();
  const { audioRef, current } = controller;

  return (
    <div className="flex flex-col items-center gap-10">
      <Iphone15Pro className="h-auto w-[240px] drop-shadow-2xl sm:w-[280px]">
        <div className="relative h-full w-full overflow-hidden bg-black">
          {/* ---- 1. background ambient: sampul aktif, di-blur & penuh 1 layar ---- */}
          <div className="absolute inset-0">
            {current?.coverUrl ? (
              <img
                src={current.coverUrl}
                alt=""
                aria-hidden="true"
                className="h-full w-full scale-125 object-cover opacity-90 blur-3xl saturate-150"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-neutral-800 via-neutral-900 to-black" />
            )}
            <div className="absolute inset-0 bg-black/35" />
          </div>

          {/* ---- 2. konten utama: MusicPlayerCard, diposisikan di ruang
                     kosong overlay (di bawah top bar, di atas caption +
                     bottom nav, di kiri kolom aksi kanan) ---- */}
          <div className="absolute inset-x-3 top-[46px] bottom-[130px] right-[52px] flex items-center justify-center">
            <MusicPlayerCard controller={controller} className="max-w-[165px]" />
          </div>

          {/* ---- 3. overlay chrome TikTok, nempel di atas semuanya ---- */}
          <TiktokOverlay likeCount={53} commentCount={5} saveCount={13} shareCount={28} />
        </div>
      </Iphone15Pro>

      <PlaylistPanel controller={controller} />

      <audio ref={audioRef} preload="metadata" className="hidden" />
    </div>
  );
}
