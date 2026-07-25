import * as React from "react";
import { AbsoluteFill, Audio, Img, continueRender, delayRender, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";
import { TiktokStage } from "../components/ui/tiktok-stage";

// ============================================================================
// TiktokOverlayComposition -- SATU-SATUNYA "versi export" yang ada, dan
// isinya cuma pembungkus tipis: dia render <TiktokStage> yang SAMA PERSIS
// dipakai di preview browser (lihat components/ui/tiktok-preview-scene.jsx).
// Tidak ada duplikasi tampilan di sini -- kalau kartu musiknya berubah di
// satu tempat, otomatis berubah juga di sini.
//
// Aturan dari spec migrasi (WAJIB dipatuhi):
//   - Progress bar & waktu dihitung dari `currentFrame / fps` (frame-based),
//     BUKAN dari audio.currentTime / requestAnimationFrame browser.
//   - Audio dikontrol lewat <Audio> milik Remotion, bukan `new Audio()`.
//   - Gambar (cover) dimuat lewat <Img> milik Remotion supaya Remotion
//     otomatis menunggu gambar selesai load sebelum men-capture frame
//     (delayRender/continueRender bawaan komponen itu).
//   - Font (Outfit, dipakai lewat class `font-display`) dimuat & ditunggu
//     lewat @remotion/google-fonts sebelum frame pertama di-render, biar
//     lebar teks & line-break-nya identik dengan preview browser (yang
//     memuat font itu lewat next/font).
// ============================================================================

const { fontFamily } = loadFont();

export function TiktokOverlayComposition({
  coverUrl = null,
  audioUrl = null,
  title = "Belum ada lagu",
  artist = "@artist",
  bgOpacity = 55,
  bgBlur = 64,
  durationInSeconds = 0,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -- pastikan font Outfit selesai dimuat sebelum frame pertama dirender --
  const [fontHandle] = React.useState(() => delayRender("Menunggu font Outfit siap"));
  React.useEffect(() => {
    let cancelled = false;
    document.fonts?.ready
      ?.then(() => {
        if (!cancelled) continueRender(fontHandle);
      })
      .catch(() => {
        if (!cancelled) continueRender(fontHandle);
      });
    return () => {
      cancelled = true;
    };
  }, [fontHandle]);

  const currentTime = frame / fps;
  const seekPct = durationInSeconds > 0 ? Math.min(100, (currentTime / durationInSeconds) * 100) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily }}>
      <TiktokStage
        className="relative h-full w-full overflow-hidden bg-black"
        coverUrl={coverUrl}
        bgBlur={bgBlur}
        bgOpacityCard={bgOpacity}
        title={title}
        subtitle={artist}
        isPlaying
        currentTime={currentTime}
        duration={durationInSeconds}
        seekPct={seekPct}
        interactive={false}
        ImgTag={Img}
      />
      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  );
}
