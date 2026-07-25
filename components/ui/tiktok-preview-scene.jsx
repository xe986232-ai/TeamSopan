"use client";

import * as React from "react";
import html2canvas from "html2canvas";
import { Download, Loader2 } from "lucide-react";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";
import { TiktokOverlay } from "@/components/ui/tiktok-overlay";
import { MusicPlayerCard } from "@/components/ui/music-player-card";
import { PlaylistPanel } from "@/components/ui/playlist-panel";
import { CardStylePanel } from "@/components/ui/card-style-panel";
import { useLocalPlaylist } from "@/hooks/use-local-playlist";

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
  const { audioRef, current } = controller;

  const [bgOpacity, setBgOpacity] = React.useState(55);
  const [bgBlur, setBgBlur] = React.useState(64);
  const [isExporting, setIsExporting] = React.useState(false);

  const stageRef = React.useRef(null);

  async function handleExport() {
    if (!stageRef.current || isExporting) return;
    setIsExporting(true);

    const node = stageRef.current;
    const targetWidth = 1080; // ekspor di resolusi tinggi, rasio 9:16 asli

    try {
      let canvas;
      try {
        // percobaan 1: resolusi tinggi (~1080px lebar)
        const scale = targetWidth / node.offsetWidth;
        canvas = await html2canvas(node, {
          backgroundColor: "#000000",
          scale,
          useCORS: true,
          logging: false,
        });
      } catch (firstErr) {
        console.warn("Ekspor resolusi tinggi gagal, coba ulang di resolusi standar:", firstErr);
        // percobaan 2 (fallback): resolusi natural device
        canvas = await html2canvas(node, {
          backgroundColor: "#000000",
          scale: window.devicePixelRatio || 1,
          useCORS: true,
          logging: false,
        });
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
                <MusicPlayerCard controller={controller} bgOpacity={bgOpacity} />
              </div>
            </div>
          </div>

          {/* ---- 2. overlay chrome TikTok, nempel di atas semuanya, di LUAR
                     stageRef supaya nggak ikut ke-ekspor ---- */}
          <TiktokOverlay likeCount={53} commentCount={5} saveCount={13} shareCount={28} />
        </div>
      </Iphone15Pro>

      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-base shadow-lg shadow-black/10 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {isExporting ? "Mengekspor..." : "Ekspor Gambar (9:16)"}
      </button>

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
