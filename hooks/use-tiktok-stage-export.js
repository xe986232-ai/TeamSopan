"use client";

import * as React from "react";
import { drawStageFrame, loadImage } from "@/lib/tiktok-stage-canvas";
import { transcodeWebmToMp4 } from "@/lib/ffmpeg-webm-to-mp4";

// ============================================================================
// useTiktokStageExport -- pipeline export video (MP4) buat panggung TikTok
// (background blur + MusicPlayerCard), TANPA chrome TikTok (status bar/tab/
// aksi kanan/dst -- itu cuma dekor preview, bukan bagian dari "konten").
//
// Cara kerjanya PERSIS seperti music-player.html referensi, murni di
// browser (bukan server/Remotion), supaya:
//   1. Hasil export dijamin identik proporsinya sama preview (lihat
//      lib/tiktok-stage-canvas.js -- proporsi dihitung dari kelas Tailwind
//      yang sama dipakai MusicPlayerCard/TiktokStage).
//   2. Nggak akan bikin build Vercel gagal (semua kerjaan di browser
//      user, tidak ada Chromium headless di server).
//
// Alur:
//   1. Canvas offscreen digambar ulang tiap frame (requestAnimationFrame)
//      lewat drawStageFrame().
//   2. canvas.captureStream(30) -> jadi video track.
//   3. Audio elemen <audio> yang sama dipakai player (audioRef) di-hook ke
//      Web Audio API (MediaElementSource -> AnalyserNode/Destination),
//      lalu di-tap ke MediaStreamAudioDestinationNode buat jadi audio
//      track yang bisa direkam.
//   4. MediaRecorder merekam video+audio track itu jadi WebM (vp9/vp8 +
//      opus) -- format WebM dipilih karena rekam MP4 langsung dengan audio
//      belum konsisten didukung banyak browser.
//   5. Hasil WebM dikonversi ke MP4 (h264 + aac) lewat ffmpeg.wasm
//      (lib/ffmpeg-webm-to-mp4.js), lalu otomatis diunduh.
// ============================================================================

const EXPORT_W = 720;
const EXPORT_H = 1280; // rasio 9:16, sama seperti panggung TiktokStage

export function useTiktokStageExport({ audioRef, getExportState, trackName }) {
  const [status, setStatus] = React.useState("idle"); // idle | recording | converting | done | error
  const [progress, setProgress] = React.useState(0);
  const [statusMessage, setStatusMessage] = React.useState("");

  const canvasRef = React.useRef(null);
  const audioCtxRef = React.useRef(null);
  const sourceNodeRef = React.useRef(null);
  const destNodeRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const recordedChunksRef = React.useRef([]);
  const rafRef = React.useRef(null);
  const coverImgRef = React.useRef(null);
  const lastCoverUrlRef = React.useRef(null);

  const isExporting = status === "recording" || status === "converting";

  function ensureCanvas() {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    canvasRef.current.width = EXPORT_W;
    canvasRef.current.height = EXPORT_H;
    return canvasRef.current;
  }

  function ensureAudioGraph() {
    const audio = audioRef.current;
    if (!audio) return null;
    if (audioCtxRef.current) return audioCtxRef.current;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const source = ctx.createMediaElementSource(audio);
      const dest = ctx.createMediaStreamDestination();
      // tetap connect ke speaker (destination) supaya user masih dengar
      // audio-nya jalan selama proses export, sekaligus ke `dest` biar
      // bisa direkam MediaRecorder.
      source.connect(ctx.destination);
      source.connect(dest);
      audioCtxRef.current = ctx;
      sourceNodeRef.current = source;
      destNodeRef.current = dest;
      return ctx;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Web Audio API gagal diinisialisasi:", err);
      return null;
    }
  }

  function stopFrameLoop() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function runFrameLoop() {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;
    const ctx = canvas.getContext("2d");

    function tick() {
      const state = getExportState();
      drawStageFrame(ctx, canvas.width, canvas.height, {
        ...state,
        coverImg: coverImgRef.current,
        currentTime: audio.currentTime,
        duration: Number.isFinite(audio.duration) ? audio.duration : state.duration || 0,
        isPlaying: !audio.paused,
      });

      const dur = Number.isFinite(audio.duration) ? audio.duration : 0;
      const pct = dur ? Math.min(100, (audio.currentTime / dur) * 100) : 0;
      setProgress(pct);
      setStatusMessage(`Merekam video... ${formatTime(audio.currentTime)} / ${formatTime(dur)}`);

      rafRef.current = requestAnimationFrame(tick);
    }
    tick();
  }

  async function loadCoverIfNeeded(coverUrl) {
    if (coverUrl === lastCoverUrlRef.current) return coverImgRef.current;
    lastCoverUrlRef.current = coverUrl;
    try {
      coverImgRef.current = await loadImage(coverUrl || null);
    } catch (err) {
      coverImgRef.current = null;
    }
    return coverImgRef.current;
  }

  async function startExport() {
    const audio = audioRef.current;
    if (!audio || !audio.src) {
      window.alert("Pilih atau tambahkan lagu terlebih dahulu sebelum export.");
      return;
    }
    if (typeof MediaRecorder === "undefined" || !ensureCanvas().captureStream) {
      window.alert("Maaf, browser ini tidak mendukung fitur export video.");
      return;
    }

    const ctx = ensureAudioGraph();
    if (!ctx) {
      window.alert("Web Audio API tidak tersedia di browser ini, export tidak bisa dilanjutkan.");
      return;
    }
    if (ctx.state === "suspended") await ctx.resume();

    const initialState = getExportState();
    await loadCoverIfNeeded(initialState.coverUrl);

    const canvas = ensureCanvas();
    const videoStream = canvas.captureStream(30);
    const audioTracks = destNodeRef.current ? destNodeRef.current.stream.getAudioTracks() : [];
    if (audioTracks.length === 0) {
      window.alert("Gagal mengambil track audio untuk direkam. Coba putar ulang lagunya lalu export lagi.");
      return;
    }

    const combined = new MediaStream([...videoStream.getVideoTracks(), ...audioTracks]);

    const preferredTypes = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
    const mimeType = preferredTypes.find((t) => MediaRecorder.isTypeSupported(t)) || "";

    recordedChunksRef.current = [];
    let recorder;
    try {
      recorder = new MediaRecorder(
        combined,
        mimeType ? { mimeType, videoBitsPerSecond: 4_000_000, audioBitsPerSecond: 192_000 } : undefined
      );
    } catch (err) {
      window.alert("Gagal memulai perekaman video: " + err.message);
      return;
    }
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
    };
    recorder.onstop = () => finalizeExport(mimeType);
    mediaRecorderRef.current = recorder;

    audio.currentTime = 0;
    setStatus("recording");
    setProgress(0);
    setStatusMessage("Menyiapkan perekaman...");

    recorder.start();
    try {
      await audio.play();
    } catch (err) {
      // gesture klik tombol export sudah cukup buat sebagian besar browser
    }

    // otomatis berhenti begitu lagu selesai
    const onEnded = () => stopExport();
    audio.addEventListener("ended", onEnded, { once: true });

    runFrameLoop();
  }

  function stopExport() {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  }

  async function finalizeExport(mimeType) {
    stopFrameLoop();
    const audio = audioRef.current;
    if (audio) audio.pause();

    const blob = new Blob(recordedChunksRef.current, { type: mimeType || "video/webm" });
    const safeName = (trackName && trackName.trim()) || "tiktok-overlay";

    if (mimeType && mimeType.startsWith("video/mp4")) {
      triggerDownload(blob, `${safeName}.mp4`);
      setStatus("done");
      setStatusMessage("Video MP4 berhasil diunduh!");
      setProgress(100);
      return;
    }

    setStatus("converting");
    setProgress(0);
    setStatusMessage("Mengonversi ke MP4... (0%)");
    try {
      const mp4Blob = await transcodeWebmToMp4(blob, (pct) => {
        setProgress(pct);
        setStatusMessage(`Mengonversi ke MP4... (${pct}%)`);
      });
      triggerDownload(mp4Blob, `${safeName}.mp4`);
      setStatus("done");
      setStatusMessage("Video MP4 berhasil diunduh!");
      setProgress(100);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Konversi MP4 gagal:", err);
      triggerDownload(blob, `${safeName}.webm`);
      setStatus("error");
      setStatusMessage(
        `Konversi MP4 gagal (${err?.message || err}). Video disimpan sebagai WebM -- pastikan koneksi internet aktif lalu coba export ulang.`
      );
    }
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  React.useEffect(() => {
    return () => {
      stopFrameLoop();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, progress, statusMessage, isExporting, startExport, stopExport };
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
