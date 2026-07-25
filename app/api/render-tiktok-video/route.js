import { NextResponse } from "next/server";
import os from "os";
import path from "path";
import { promises as fs } from "fs";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { getBundleLocation } from "@/lib/remotion-bundle";

// ============================================================================
// /api/render-tiktok-video -- endpoint render server-side (Remotion), dipanggil
// oleh handleExport() & handleExportVideo() di tiktok-preview-scene.jsx.
//
// ?mode=image -> renderStill(), balikin PNG 1080x1920 (satu frame).
// ?mode=video -> renderMedia(), balikin MP4 1080x1920, frame-by-frame,
//                audio disisipkan lewat <Audio> di dalam komposisi.
//
// Kenapa file audio/sampul dikonversi ke data URL (bukan disimpan permanen
// di /public lalu dikasih path): permintaan render ini sifatnya sekali
// pakai & per-user (upload lokal di browser), jadi gak perlu nyimpen file
// jangka panjang di server -- data URL cukup buat SEKALI proses render,
// lalu dibuang begitu proses selesai (tidak ada file yang tertinggal).
//
// PENTING (harus jalan di Node.js runtime, BUKAN Edge): renderMedia/
// renderStill butuh akses filesystem & child_process (Chromium headless +
// ffmpeg), yang tidak tersedia di Edge runtime.
// ============================================================================

export const runtime = "nodejs";
// render video bisa makan waktu lebih dari default 10s di banyak host --
// naikkan batas durasi function (cek juga limit platform hosting kamu,
// mis. Vercel Hobby capped di 60s, Pro bisa lebih).
export const maxDuration = 300;

async function fileToDataUrl(file) {
  if (!file) return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = file.type || "application/octet-stream";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") === "video" ? "video" : "image";

  let tempOutputDir = null;

  try {
    const form = await request.formData();
    const meta = JSON.parse(form.get("meta") || "{}");
    const coverFile = form.get("cover");
    const audioFile = mode === "video" ? form.get("audio") : null;

    if (mode === "video" && !audioFile) {
      return NextResponse.json({ error: "File audio wajib untuk ekspor video." }, { status: 400 });
    }

    const [coverUrl, audioUrl] = await Promise.all([fileToDataUrl(coverFile), fileToDataUrl(audioFile)]);

    const inputProps = {
      coverUrl,
      audioUrl,
      title: meta.title || "Belum ada lagu",
      artist: meta.artist || "@artist",
      bgOpacity: typeof meta.bgOpacity === "number" ? meta.bgOpacity : 55,
      bgBlur: typeof meta.bgBlur === "number" ? meta.bgBlur : 64,
      durationInSeconds: typeof meta.durationInSeconds === "number" ? meta.durationInSeconds : 10,
    };

    const serveUrl = await getBundleLocation();
    const compositionId = mode === "video" ? "TiktokOverlayVideo" : "TiktokOverlayImage";

    // selectComposition menjalankan `calculateMetadata` komposisi (lihat
    // remotion/Root.jsx) supaya durationInFrames video ikut durasi lagu
    // ASLI (dari `meta.durationInSeconds`), bukan nilai default 10 detik.
    const composition = await selectComposition({
      serveUrl,
      id: compositionId,
      inputProps,
    });

    tempOutputDir = await fs.mkdtemp(path.join(os.tmpdir(), "sopan-tiktok-render-"));

    if (mode === "video") {
      const outputLocation = path.join(tempOutputDir, "output.mp4");
      await renderMedia({
        composition,
        serveUrl,
        codec: "h264",
        outputLocation,
        inputProps,
      });

      const videoBuffer = await fs.readFile(outputLocation);
      return new NextResponse(videoBuffer, {
        status: 200,
        headers: {
          "Content-Type": "video/mp4",
          "Content-Disposition": 'attachment; filename="sopan-tiktok-overlay.mp4"',
        },
      });
    }

    const outputLocation = path.join(tempOutputDir, "output.png");
    await renderStill({
      composition,
      serveUrl,
      output: outputLocation,
      inputProps,
    });

    const imageBuffer = await fs.readFile(outputLocation);
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="sopan-tiktok-overlay.png"',
      },
    });
  } catch (err) {
    console.error(`Gagal me-render (${mode}):`, err);
    return NextResponse.json(
      { error: err?.message || "Gagal me-render di server. Coba lagi." },
      { status: 500 }
    );
  } finally {
    if (tempOutputDir) {
      await fs.rm(tempOutputDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
