"use client";

import * as React from "react";
import { Download, Loader2, FileCode2, Video } from "lucide-react";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";
import { TiktokOverlay } from "@/components/ui/tiktok-overlay";
import { TiktokStage } from "@/components/ui/tiktok-stage";
import { PlaylistPanel } from "@/components/ui/playlist-panel";
import { CardStylePanel } from "@/components/ui/card-style-panel";
import { TrackMetaPanel } from "@/components/ui/track-meta-panel";
import { LayerPanel } from "@/components/ui/layer-panel";
import { useLocalPlaylist } from "@/hooks/use-local-playlist";
import { generateAlightMotionXml, ALIGHT_MOTION_LAYERS } from "@/lib/alightmotion-template";

// ============================================================================
// TiktokPreviewScene -- mockup HP + overlay chrome TikTok, dengan
// `TiktokStage` (background blur + MusicPlayerCard) sebagai "konten utama"
// (layer di BAWAH overlay, persis posisi video kalau ini beneran TikTok).
//
// RENDER ENGINE (Remotion): ekspor Gambar & Video TIDAK LAGI screenshot DOM
// (html2canvas) -- itu sebabnya dulu background blur/backdrop-blur harus
// di-"bake" manual ke canvas dan progress bar/waktu digambar ulang manual
// per-frame (lihat riwayat lib/export-stage-video.js, sekarang dihapus).
// Sekarang tombol ekspor cuma ngirim state editor (judul, artist, opacity,
// blur, file audio, file sampul) ke /api/render-tiktok-video, yang
// me-render ULANG komponen <TiktokStage> yang SAMA PERSIS lewat Chromium
// headless (Remotion) di server -- jadi CSS blur/backdrop-filter otomatis
// akurat, dan preview di layar = hasil file export, karena keduanya berasal
// dari komponen React yang sama. Lihat remotion/TiktokOverlayComposition.jsx.
//
// TiktokOverlay -- chrome TikTok (status bar, tab, aksi kanan, bottom nav),
// transparan di tengah, ditaruh DI LUAR/DI ATAS <TiktokStage> (bukan anak
// dari stage) supaya server render cuma ngerender isi stage-nya doang
// (background + card), TANPA chrome TikTok ikut ke-render.
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
  const [isExporting, setIsExporting] = React.useState(false);
  const [isExportingXml, setIsExportingXml] = React.useState(false);
  const [isExportingVideo, setIsExportingVideo] = React.useState(false);
  const [videoExportProgress, setVideoExportProgress] = React.useState(0); // 0-100

  // ---- metadata buat generate project Alight Motion (.xml) & buat render ----
  const [trackTitle, setTrackTitle] = React.useState("");
  const [trackArtist, setTrackArtist] = React.useState("@artist");
  const [deviceName, setDeviceName] = React.useState("iPhone");
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

  // ---- layer project Alight Motion yang mau disembunyikan dari .xml ----
  const [hiddenLayerIds, setHiddenLayerIds] = React.useState(() => new Set());

  function handleToggleLayer(id) {
    setHiddenLayerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const displayTitle = trackTitle.trim() ? trackTitle : current ? current.name : "Belum ada lagu";
  const displaySubtitle = trackArtist.trim() ? trackArtist : current ? "File lokal" : "Tambahkan lagu di panel bawah";

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  // blob: URL (hasil URL.createObjectURL di useLocalPlaylist) bisa di-fetch
  // ulang buat dapetin isi File-nya lagi -- dipakai buat ngirim file
  // audio/sampul asli ke endpoint render server.
  async function blobUrlToBlob(url) {
    const res = await fetch(url);
    return res.blob();
  }

  async function readErrorMessage(res, fallback) {
    try {
      const data = await res.json();
      return data?.error || fallback;
    } catch {
      return fallback;
    }
  }

  // ekspor GAMBAR (PNG, 1080x1920) -- render server-side via Remotion
  // (renderStill), bukan html2canvas.
  async function handleExport() {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const form = new FormData();
      if (current?.coverUrl) {
        const coverBlob = await blobUrlToBlob(current.coverUrl);
        form.append("cover", coverBlob, "cover.png");
      }
      form.append(
        "meta",
        JSON.stringify({
          title: displayTitle,
          artist: displaySubtitle,
          bgOpacity,
          bgBlur,
        })
      );

      const res = await fetch("/api/render-tiktok-video?mode=image", { method: "POST", body: form });
      if (!res.ok) throw new Error(await readErrorMessage(res, "Gagal membuat file gambar."));

      const blob = await res.blob();
      downloadBlob(blob, `sopan-tiktok-overlay-${Date.now()}.png`);
    } catch (err) {
      console.error("Gagal mengekspor gambar:", err);
      alert(`Gagal mengekspor gambar: ${err?.message || "penyebab tidak diketahui"}. Coba lagi.`);
    } finally {
      setIsExporting(false);
    }
  }

  function handleExportXml() {
    if (isExportingXml) return;

    if (!current) {
      alert("Tambahkan lagu terlebih dahulu di panel Daftar Putar sebelum generate project.");
      return;
    }

    setIsExportingXml(true);
    try {
      const xml = generateAlightMotionXml({
        title: trackTitle || current.name,
        artist: trackArtist,
        device: deviceName,
        durationSeconds: duration || 0,
        bgOpacity,
        bgBlur,
        excludedLayerIds: Array.from(hiddenLayerIds),
      });

      const blob = new Blob([xml], { type: "application/xml" });
      downloadBlob(blob, `sopan-tiktok-overlay-${Date.now()}.xml`);
    } catch (err) {
      console.error("Gagal generate project Alight Motion:", err);
      alert(`Gagal generate project: ${err?.message || "penyebab tidak diketahui"}. Coba lagi.`);
    } finally {
      setIsExportingXml(false);
    }
  }

  // ekspor VIDEO (MP4) -- dulu direkam real-time di browser pakai
  // MediaRecorder + html2canvas (lihat riwayat lib/export-stage-video.js).
  // Sekarang: kirim file lagu + sampul + metadata style ke server, Remotion
  // yang me-render <TiktokStage> frame-by-frame (currentFrame/fps, BUKAN
  // audio.currentTime) lalu encode ke MP4 lewat FFmpeg bawaannya. Progress
  // di bawah ini estimasi (indikator sibuk), karena render jalan di server,
  // bukan di timeline lagu di browser -- jadi gak lagi "makan waktu sama
  // persis kayak durasi lagu" seperti sebelumnya.
  async function handleExportVideo() {
    if (isExportingVideo) return;
    if (!current?.url) {
      alert("Tambahkan lagu terlebih dahulu di panel Daftar Putar sebelum ekspor video.");
      return;
    }

    setIsExportingVideo(true);
    setVideoExportProgress(5);
    const progressTimer = setInterval(() => {
      setVideoExportProgress((p) => (p < 90 ? Math.min(90, p + Math.random() * 6) : p));
    }, 900);

    try {
      const form = new FormData();
      const audioBlob = await blobUrlToBlob(current.url);
      form.append("audio", audioBlob, current.name || "audio");

      if (current.coverUrl) {
        const coverBlob = await blobUrlToBlob(current.coverUrl);
        form.append("cover", coverBlob, "cover.png");
      }

      form.append(
        "meta",
        JSON.stringify({
          title: displayTitle,
          artist: displaySubtitle,
          bgOpacity,
          bgBlur,
          durationInSeconds: duration || 0,
        })
      );

      const res = await fetch("/api/render-tiktok-video?mode=video", { method: "POST", body: form });
      if (!res.ok) throw new Error(await readErrorMessage(res, "Gagal merender video."));

      const blob = await res.blob();
      setVideoExportProgress(100);
      downloadBlob(blob, `sopan-tiktok-overlay-${Date.now()}.mp4`);
    } catch (err) {
      console.error("Gagal mengekspor video:", err);
      alert(`Gagal mengekspor video: ${err?.message || "penyebab tidak diketahui"}. Coba lagi.`);
    } finally {
      clearInterval(progressTimer);
      setIsExportingVideo(false);
      setVideoExportProgress(0);
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <Iphone15Pro className="h-auto w-[240px] drop-shadow-2xl sm:w-[280px]">
        <div className="relative h-full w-full overflow-hidden bg-black">
          {/* ---- 1. panggung 9:16 (background + card) -- ini yang di-ekspor ---- */}
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

      {/* ---- panel kustomisasi (playlist, tampilan card, info judul/artist,
                 layer project) -- ditaruh DI ATAS tombol export supaya alur
                 kerjanya: atur dulu semuanya di sini (langsung kelihatan
                 hasilnya di mockup HP di atas), baru ekspor di bawah ---- */}
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
          device={deviceName}
          onDeviceChange={setDeviceName}
        />
        <LayerPanel layers={ALIGHT_MOTION_LAYERS} hiddenLayerIds={hiddenLayerIds} onToggleLayer={handleToggleLayer} />
      </div>

      {/* ---- tombol export -- ditaruh PALING BAWAH, setelah semua
                 pengaturan di atas selesai diisi ---- */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-base shadow-lg shadow-black/10 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {isExporting ? "Merender..." : "Ekspor Gambar (9:16)"}
        </button>

        <button
          type="button"
          onClick={handleExportXml}
          disabled={isExportingXml}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-base-elevated px-5 py-2.5 text-sm font-semibold text-ink shadow-lg shadow-black/5 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExportingXml ? <Loader2 size={16} className="animate-spin" /> : <FileCode2 size={16} />}
          {isExportingXml ? "Membuat project..." : "Generate Project (.xml)"}
        </button>

        <button
          type="button"
          onClick={handleExportVideo}
          disabled={isExportingVideo}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-base-elevated px-5 py-2.5 text-sm font-semibold text-ink shadow-lg shadow-black/5 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExportingVideo ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
          {isExportingVideo ? `Merender... ${Math.round(videoExportProgress)}%` : "Ekspor Video"}
        </button>
      </div>

      {isExportingVideo && (
        <p className="max-w-[280px] text-center text-[11px] leading-relaxed text-ink/50">
          Video dirender di server (Remotion) supaya hasilnya sama persis dengan preview -- mohon tunggu, jangan
          tutup tab.
        </p>
      )}

      <p className="max-w-[280px] text-center text-[11px] leading-relaxed text-ink/50">
        Setelah file .xml diimpor ke Alight Motion, pilih ulang 2 foto (background &amp; sampul album) dari galeri --
        Alight Motion tidak bisa membawa foto secara otomatis, hanya teks &amp; angka.
      </p>

      <audio ref={audioRef} preload="metadata" className="hidden" />
    </div>
  );
}
