"use client";

import * as React from "react";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";
import { TiktokOverlay } from "@/components/ui/tiktok-overlay";
import { TiktokStage } from "@/components/ui/tiktok-stage";
import { PlaylistPanel } from "@/components/ui/playlist-panel";
import { CardStylePanel } from "@/components/ui/card-style-panel";
import { TrackMetaPanel } from "@/components/ui/track-meta-panel";
import { TiktokExportPanel } from "@/components/ui/tiktok-export-panel";
import { TiktokExportOverlay } from "@/components/ui/tiktok-export-overlay";
import { useLocalPlaylist } from "@/hooks/use-local-playlist";
import { useTiktokStageExport, EXPORT_RESOLUTIONS, DEFAULT_EXPORT_RESOLUTION } from "@/hooks/use-tiktok-stage-export";

// ============================================================================
// TiktokPreviewScene -- mockup HP + overlay chrome TikTok, dengan
// `TiktokStage` (background blur + MusicPlayerCard) sebagai "konten utama"
// (layer di BAWAH overlay, persis posisi video kalau ini beneran TikTok).
//
// CATATAN EXPORT: percobaan sebelumnya (html2canvas, lalu Remotion/server
// Chromium headless) dihapus karena bikin build Vercel gagal & hasilnya
// gampang meleset dari preview. Export sekarang pakai pendekatan baru yang
// SEPENUHNYA client-side: canvas 2D digambar ulang manual tiap frame
// (lib/tiktok-stage-canvas.js, proporsinya dihitung dari kelas Tailwind
// yang sama dipakai MusicPlayerCard/TiktokStage) + Web Audio API +
// MediaRecorder + ffmpeg.wasm buat transcode ke MP4
// (hooks/use-tiktok-stage-export.js). Tidak ada render server sama sekali,
// jadi tidak akan bikin build gagal, dan proporsinya dijamin sinkron sama
// preview karena angkanya berasal dari sumber yang sama.
//
// TiktokOverlay -- chrome TikTok (status bar, tab, aksi kanan, bottom nav),
// transparan di tengah, ditaruh DI LUAR/DI ATAS <TiktokStage> (bukan anak
// dari stage), murni visual di browser -- SENGAJA tidak ikut ke-export,
// sama seperti TikTok asli (chrome UI bukan bagian dari video).
//
// PlaylistPanel (upload lagu, ganti sampul) & CardStylePanel (opacity card +
// blur background) tetap di LUAR mockup HP -- nyambung ke instance
// useLocalPlaylist() & state style yang sama, jadi berubah langsung
// ke-refleksi ke card di dalam HP (dan ke hasil export).
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

  // ---- export video: state ini dibaca ulang tiap frame oleh canvas
  // renderer (lib/tiktok-stage-canvas.js) lewat ref, bukan closure biasa,
  // supaya nggak "basi" (stale) selama proses rekam yang bisa berlangsung
  // lama (durasi 1 lagu penuh). ----
  const exportStateRef = React.useRef({});
  exportStateRef.current = {
    coverUrl: current?.coverUrl || null,
    title: displayTitle,
    subtitle: displaySubtitle,
    bgOpacity,
    bgBlur,
    volume,
  };
  const getExportState = React.useCallback(() => exportStateRef.current, []);

  const [resolutionKey, setResolutionKey] = React.useState(DEFAULT_EXPORT_RESOLUTION);

  const { status, progress, statusMessage, isExporting, startExport, stopExport } = useTiktokStageExport({
    audioRef,
    getExportState,
    trackName: current?.name,
    resolutionKey,
  });

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

          {/* ---- 3. overlay loading export, paling atas -- nutupin layar
                     mockup HP selama proses rekam/konversi video, sama
                     seperti #2 murni dekor UI & tidak ikut ke-ekspor ---- */}
          <TiktokExportOverlay status={status} progress={progress} statusMessage={statusMessage} />
        </div>
      </Iphone15Pro>

      {/* ---- panel kustomisasi (upload lagu, tampilan card, info judul/artist)
                 -- langsung kelihatan hasilnya di mockup HP di atas & di hasil
                 export. Di-nonaktifkan sementara (opacity-50, pointer-events-none)
                 selagi proses export berjalan. ---- */}
      <div
        className={isExporting ? "pointer-events-none flex w-full max-w-[280px] flex-col gap-4 opacity-50" : "flex w-full max-w-[280px] flex-col gap-4"}
      >
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

      <TiktokExportPanel
        status={status}
        progress={progress}
        statusMessage={statusMessage}
        onExport={startExport}
        onStop={stopExport}
        resolutionKey={resolutionKey}
        onResolutionChange={setResolutionKey}
        resolutionOptions={Object.entries(EXPORT_RESOLUTIONS)}
      />

      <audio ref={audioRef} preload="metadata" className="hidden" />
    </div>
  );
}
