"use client";

import * as React from "react";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";
import { MusicPlayerCard } from "@/components/ui/music-player-card";
import { PlaylistPanel } from "@/components/ui/playlist-panel";
import { useLocalPlaylist } from "@/hooks/use-local-playlist";

// ============================================================================
// NowPlayingScene -- gabungan mockup HP + panel kontrol untuk halaman
// /preview-nowplaying. Dipecah jadi client component terpisah dari page.js
// karena page.js butuh tetap jadi server component (buat `export const
// metadata`), sementara bagian ini butuh state/hook interaktif.
//
// Layout:
//   - Di DALAM layar HP: cuma MusicPlayerCard (kecil) + 1 layer background
//     yang isinya sampul lagu yang lagi aktif, di-blur & di-scale gede biar
//     penuh 1 layar HP (efek ambient ala Apple Music/Android Now Playing).
//   - Di LUAR mockup HP: PlaylistPanel buat upload lagu, ganti sampul, dan
//     kelola daftar putar.
// Keduanya nempel ke 1 instance hook `useLocalPlaylist()` yang sama, jadi
// begitu upload/pilih lagu di panel luar, card di dalam HP langsung update.
// ============================================================================
export function NowPlayingScene() {
  const controller = useLocalPlaylist();
  const { audioRef, current } = controller;

  return (
    <div className="flex flex-col items-center gap-10">
      <Iphone15Pro className="w-[240px] sm:w-[280px] h-auto drop-shadow-2xl">
        <div className="relative h-full w-full overflow-hidden bg-black">
          {/* ---- background ambient: sampul aktif, di-blur & penuh 1 layar ---- */}
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

          {/* ---- card musik player, sengaja kecil biar background keliatan ---- */}
          <div className="relative flex h-full w-full items-center justify-center p-6">
            <MusicPlayerCard controller={controller} />
          </div>
        </div>
      </Iphone15Pro>

      <PlaylistPanel controller={controller} />

      <audio ref={audioRef} preload="metadata" className="hidden" />
    </div>
  );
}
