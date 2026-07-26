"use client";

import * as React from "react";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";
import { TiktokOverlay } from "@/components/ui/tiktok-overlay";
import { TiktokStage } from "@/components/ui/tiktok-stage";
import { PlaylistPanel } from "@/components/ui/playlist-panel";
import { CardStylePanel } from "@/components/ui/card-style-panel";
import { TrackMetaPanel } from "@/components/ui/track-meta-panel";
import { useLocalPlaylist } from "@/hooks/use-local-playlist";

// ============================================================================
// TiktokPreviewScene -- mockup HP + overlay chrome TikTok, dengan
// `TiktokStage` (background blur + MusicPlayerCard) sebagai "konten utama"
// (layer di BAWAH overlay, persis posisi video kalau ini beneran TikTok).
//
// CATATAN: fitur ekspor Gambar/Video/Project (.xml) yang dulu render lewat
// Remotion (server, Chromium headless) SUDAH DIHAPUS -- itu yang bikin
// build Vercel gagal. Halaman ini sekarang murni PREVIEW + UPLOAD lagu,
// tanpa render engine apa pun.
//
// TiktokOverlay -- chrome TikTok (status bar, tab, aksi kanan, bottom nav),
// transparan di tengah, ditaruh DI LUAR/DI ATAS <TiktokStage> (bukan anak
// dari stage), murni visual di browser.
//
// PlaylistPanel (upload lagu, ganti sampul) & CardStylePanel (opacity card +
// blur background) tetap di LUAR mockup HP -- nyambung ke instance
// useLocalPlaylist() & state style yang sama, jadi berubah langsung
// ke-refleksi ke card di dalam HP.
// ============================================================================
export function TiktokPreviewScene() {
  const controller = useLocalPlaylist();
  const {
    audioRef,
    current,
    duration,
    isPlaying,
    currentTime,
    seekPct,
    volume,
    setVolume,
    togglePlay,
    skip,
    handleSeekChange,
    setSeeking,
  } = controller;

  const [bgOpacity, setBgOpacity] = React.useState(55);
  const [bgBlur, setBgBlur] = React.useState(64);

  // ---- metadata judul/artist yang tampil di card musik ----
  const [trackTitle, setTrackTitle] = React.useState("");
  const [trackArtist, setTrackArtist] = React.useState("@artist");
  const titleTouchedRef = React.useRef(false);

  // judul default ngikutin nama file lagu yang lagi aktif, TAPI cuma
  // selama user belum pernah ngetik manual di kolom judul (biar gak
  // ketimpa terus tiap ganti lagu setelah user isi sendiri)
  React.useEffect(() => {
    if (!titleTouchedRef.current && current?.name) {
      setTrackTitle(current.name);
    }
  }, [current?.name]);

  function handleTrackTitleChange(value) {
    titleTouchedRef.current = true;
    setTrackTitle(value);
  }

  const displayTitle = trackTitle.trim() ? trackTitle : current ? current.name : "Belum ada lagu";
  const displaySubtitle = trackArtist.trim() ? trackArtist : current ? "File lokal" : "Tambahkan lagu di panel bawah";

  return (
    <div className="flex flex-col items-center gap-8">
      <Iphone15Pro className="h-auto w-[240px] drop-shadow-2xl sm:w-[280px]">
        <div className="relative h-full w-full overflow-hidden bg-black">
          {/* ---- 1. panggung 9:16 (background + card) ---- */}
          <div className="absolute inset-0 flex items-center justify-center">
            <TiktokStage
              coverUrl={current?.coverUrl || null}
              bgBlur={bgBlur}
              bgOpacityCard={bgOpacity}
              title={displayTitle}
              subtitle={displaySubtitle}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              seekPct={seekPct}
              volume={volume}
              interactive
              onTogglePlay={togglePlay}
              onSkip={skip}
              onSeekChange={handleSeekChange}
              onSetSeeking={setSeeking}
              onVolumeChange={setVolume}
            />
          </div>

          {/* ---- 2. overlay chrome TikTok, nempel di atas semuanya, di LUAR
                     TiktokStage supaya nggak ikut ke-ekspor ---- */}
          <TiktokOverlay likeCount={53} commentCount={5} saveCount={13} shareCount={28} />
        </div>
      </Iphone15Pro>

      {/* ---- panel kustomisasi (upload lagu, tampilan card, info judul/artist)
                 -- langsung kelihatan hasilnya di mockup HP di atas. Sudah
                 tanpa fitur ekspor/render (dihapus bareng engine Remotion). ---- */}
      <div className="flex w-full max-w-[280px] flex-col gap-4">
        <PlaylistPanel controller={controller} />
        <CardStylePanel
          bgOpacity={bgOpacity}
          onBgOpacityChange={setBgOpacity}
          bgBlur={bgBlur}
          onBgBlurChange={setBgBlur}
        />
        <TrackMetaPanel
          title={trackTitle}
          onTitleChange={handleTrackTitleChange}
          artist={trackArtist}
          onArtistChange={setTrackArtist}
        />
      </div>

      <audio ref={audioRef} preload="metadata" className="hidden" />
    </div>
  );
}
