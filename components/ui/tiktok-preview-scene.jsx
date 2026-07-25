"use client";

import * as React from "react";
import html2canvas from "html2canvas";
import { Download, Loader2, FileCode2, Video } from "lucide-react";
import { exportStageAsVideo } from "@/lib/export-stage-video";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";
import { TiktokOverlay } from "@/components/ui/tiktok-overlay";
import { MusicPlayerCard } from "@/components/ui/music-player-card";
import { PlaylistPanel } from "@/components/ui/playlist-panel";
import { CardStylePanel } from "@/components/ui/card-style-panel";
import { TrackMetaPanel } from "@/components/ui/track-meta-panel";
import { LayerPanel } from "@/components/ui/layer-panel";
import { useLocalPlaylist } from "@/hooks/use-local-playlist";
import { generateAlightMotionXml, ALIGHT_MOTION_LAYERS } from "@/lib/alightmotion-template";

// ============================================================================
// TiktokPreviewScene -- mockup HP + overlay chrome TikTok, dengan
// MusicPlayerCard sebagai "konten utama" (layer di BAWAH overlay, persis
// posisi video kalau ini beneran TikTok).
//
// Layer (dari bawah ke atas):
//   1. `stageRef` -- panggung rasio 9:16 (persis rasio video TikTok asli).
//      Dikunci lebarnya penuh selebar layar HP, tinggi mengikuti otomatis
//      lewat aspect-[9/16] -- karena rasio internal layar HP lebih "kurus"
//      dari 9:16, hasilnya panggung ini otomatis punya sedikit letterbox
//      hitam di atas & bawah (mirip video 9:16 di HP yang lebih tinggi).
//      Di dalam panggung ini ada:
//        a. background ambient (blur sampul aktif, object-cover, ngisi
//           penuh panggung 9:16) -- blur-nya dinamis lewat CardStylePanel
//        b. MusicPlayerCard, diposisikan di tengah panggung
//   2. TiktokOverlay -- chrome TikTok (status bar, tab, aksi kanan, bottom
//      nav), transparan di tengah, ditaruh DI LUAR/DI ATAS `stageRef` (bukan
//      anak dari stageRef) supaya pas tombol ekspor cuma nangkep isi
//      `stageRef` (background + card), overlay TikTok-nya otomatis nggak
//      ikut ke-capture.
//
// Tombol "Ekspor Gambar" pakai html2canvas buat nge-render `stageRef` jadi
// PNG ~1080x1920 (rasio 9:16 asli) lalu langsung didownload.
//
// PlaylistPanel (upload lagu, ganti sampul) & CardStylePanel (opacity card +
// blur background) tetap di LUAR mockup HP -- nyambung ke instance
// useLocalPlaylist() & state style yang sama, jadi berubah langsung
// ke-refleksi ke card di dalam HP.
// ============================================================================
export function TiktokPreviewScene() {
  const controller = useLocalPlaylist();
  const { audioRef, current, duration } = controller;

  const [bgOpacity, setBgOpacity] = React.useState(55);
  const [bgBlur, setBgBlur] = React.useState(64);
  const [isExporting, setIsExporting] = React.useState(false);
  const [isExportingXml, setIsExportingXml] = React.useState(false);
  const [isExportingVideo, setIsExportingVideo] = React.useState(false);
  const [videoExportProgress, setVideoExportProgress] = React.useState(0); // 0-100

  // ---- metadata buat generate project Alight Motion (.xml) ----
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

  const stageRef = React.useRef(null);

  // html2canvas (kayak hampir semua library screenshot-DOM) TIDAK mendukung
  // CSS `filter` (termasuk blur/saturate) maupun `backdrop-filter` -- itu
  // sebabnya hasil ekspor sebelumnya background-nya keliatan tajam/pecah,
  // beda sama preview yang blur. Solusinya: blur-nya di-"bake" duluan ke
  // piksel asli gambar lewat Canvas 2D (`ctx.filter`, yang DIDUKUNG penuh
  // buat operasi canvas biasa) sebelum di-screenshot, lalu hasilnya
  // dipasang gantiin <img> aslinya lewat `onclone` html2canvas.
  async function buildBlurredBackgroundDataUrl(coverUrl, blurPx, width, height) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Gagal memuat gambar sampul untuk background."));
      img.src = coverUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D tidak didukung di browser ini.");

    // tiru crop object-cover + scale-125 dari CSS aslinya
    const scale = 1.25;
    const boxRatio = canvas.width / canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let drawW, drawH;
    if (imgRatio > boxRatio) {
      drawH = canvas.height * scale;
      drawW = drawH * imgRatio;
    } else {
      drawW = canvas.width * scale;
      drawH = drawW / imgRatio;
    }
    const dx = (canvas.width - drawW) / 2;
    const dy = (canvas.height - drawH) / 2;

    ctx.filter = `blur(${blurPx}px) saturate(1.5)`;
    ctx.globalAlpha = 0.9;
    ctx.drawImage(img, dx, dy, drawW, drawH);

    return canvas.toDataURL("image/png");
  }

  async function handleExport() {
    if (!stageRef.current || isExporting) return;
    setIsExporting(true);

    const node = stageRef.current;
    const targetWidth = 1080; // ekspor di resolusi tinggi, rasio 9:16 asli

    try {
      const scaleFactor = targetWidth / node.offsetWidth;
      const exportHeight = node.offsetHeight * scaleFactor;

      // blur-nya perlu discale juga -- angka bgBlur (px) itu didefinisikan
      // relatif ke ukuran mockup HP yang kecil di layar, bukan ke resolusi
      // ekspor yang jauh lebih besar
      let bakedBgDataUrl = null;
      if (current?.coverUrl) {
        try {
          bakedBgDataUrl = await buildBlurredBackgroundDataUrl(
            current.coverUrl,
            bgBlur * scaleFactor,
            targetWidth,
            exportHeight
          );
        } catch (bakeErr) {
          console.warn("Gagal bikin background blur untuk ekspor, lanjut tanpa itu:", bakeErr);
        }
      }

      const onclone = (clonedDoc, clonedNode) => {
        // panel card pakai backdrop-blur (juga gak didukung html2canvas) --
        // matikan aja biar gak ke-render transparan/aneh, background rgba
        // solidnya sendiri tetap kepakai jadi teks tetap kebaca
        clonedNode.querySelectorAll('[class*="backdrop-blur"]').forEach((el) => {
          el.style.backdropFilter = "none";
          el.style.webkitBackdropFilter = "none";
        });

        // pasang background yang udah di-blur manual, gantiin <img> asli
        // yang masih tajam (karena CSS filter-nya diabaikan html2canvas)
        if (bakedBgDataUrl) {
          const bgImg = clonedNode.querySelector("img[data-export-ambient-bg]");
          if (bgImg) {
            bgImg.src = bakedBgDataUrl;
            bgImg.style.filter = "none";
            bgImg.style.transform = "none";
            bgImg.style.objectFit = "cover";
          }
        }
      };

      const captureOptions = {
        backgroundColor: "#000000",
        useCORS: true,
        logging: false,
        onclone,
      };

      let canvas;
      try {
        // percobaan 1: resolusi tinggi (~1080px lebar)
        canvas = await html2canvas(node, { ...captureOptions, scale: scaleFactor });
      } catch (firstErr) {
        console.warn("Ekspor resolusi tinggi gagal, coba ulang di resolusi standar:", firstErr);
        // percobaan 2 (fallback): resolusi natural device
        canvas = await html2canvas(node, { ...captureOptions, scale: window.devicePixelRatio || 1 });
      }

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Gagal membuat file gambar dari kanvas.");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `sopan-tiktok-overlay-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
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
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `sopan-tiktok-overlay-${Date.now()}.xml`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal generate project Alight Motion:", err);
      alert(`Gagal generate project: ${err?.message || "penyebab tidak diketahui"}. Coba lagi.`);
    } finally {
      setIsExportingXml(false);
    }
  }

  // ekspor VIDEO (bukan cuma gambar diam) -- panggung yang sama dipakai
  // ekspor PNG (`stageRef`, background+card, TANPA overlay chrome TikTok)
  // direkam real-time selama lagu diputar penuh, progress bar & waktu ikut
  // jalan beneran. Lihat lib/export-stage-video.js buat detail caranya.
  async function handleExportVideo() {
    if (!stageRef.current || isExportingVideo) return;
    if (!audioRef.current?.src) {
      alert("Tambahkan & putar lagu terlebih dahulu di panel Daftar Putar sebelum ekspor video.");
      return;
    }

    setIsExportingVideo(true);
    setVideoExportProgress(0);
    try {
      const { blob, mimeType } = await exportStageAsVideo({
        stageEl: stageRef.current,
        audioEl: audioRef.current,
        coverUrl: current?.coverUrl || null,
        bgBlurPx: bgBlur,
        onProgress: ({ currentTime, duration }) => {
          setVideoExportProgress(duration ? Math.round((currentTime / duration) * 100) : 0);
        },
      });

      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `sopan-tiktok-overlay-${Date.now()}.${ext}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mengekspor video:", err);
      alert(`Gagal mengekspor video: ${err?.message || "penyebab tidak diketahui"}. Coba lagi.`);
    } finally {
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
            <div ref={stageRef} className="relative aspect-[9/16] w-full overflow-hidden bg-black">
              {/* 1a. background ambient: sampul aktif, di-blur, ngisi penuh panggung */}
              <div className="absolute inset-0">
                {current?.coverUrl ? (
                  <img
                    data-export-ambient-bg
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

              {/* 1b. konten utama: MusicPlayerCard, di tengah panggung */}
              <div className="absolute inset-0 flex items-center justify-center px-3">
                <MusicPlayerCard
                  controller={controller}
                  bgOpacity={bgOpacity}
                  overrideTitle={trackTitle}
                  overrideArtist={trackArtist}
                />
              </div>
            </div>
          </div>

          {/* ---- 2. overlay chrome TikTok, nempel di atas semuanya, di LUAR
                     stageRef supaya nggak ikut ke-ekspor ---- */}
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
          {isExporting ? "Mengekspor..." : "Ekspor Gambar (9:16)"}
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
          {isExportingVideo ? `Merekam... ${videoExportProgress}%` : "Ekspor Video"}
        </button>
      </div>

      {isExportingVideo && (
        <p className="max-w-[280px] text-center text-[11px] leading-relaxed text-ink/50">
          Video direkam real-time sepanjang durasi lagu -- jangan tutup/pindah tab sampai selesai.
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
