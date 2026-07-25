"use client";

import html2canvas from "html2canvas";

// ============================================================================
// export-stage-video.js -- render isi `stageRef` (background blur + kartu
// musik, TANPA overlay chrome TikTok -- overlay-nya emang di luar stageRef)
// jadi file video (.webm) berisi gambar diam + progress bar/waktu yang
// jalan beneran sinkron sama audio aslinya.
//
// Strategi:
//   1. Background di-"bake" jadi PNG blur sekali di awal (persis logika
//      ekspor gambar yang udah ada) -- gak perlu diulang tiap frame karena
//      background-nya statis.
//   2. Kartu musik (cover, judul, subtitle, tombol, slider volume) di-
//      screenshot SEKALI pakai html2canvas -- tapi baris progress bar &
//      waktu (ditandai `data-export-progress-row` / `data-export-time-row`
//      di music-player-card.jsx) disembunyikan dulu sebelum screenshot,
//      lalu kita gambar ulang SENDIRI tiap frame di posisi yang sama
//      (dihitung dari getBoundingClientRect elemen aslinya, sebelum
//      disembunyikan).
//   3. Kedua gambar statis itu ditumpuk ke <canvas>, plus progress bar +
//      teks waktu yang di-update tiap frame lewat requestAnimationFrame,
//      disinkronkan ke audio.currentTime yang BENERAN lagi diputar.
//   4. `canvas.captureStream()` (video) digabung sama audio (lewat Web
//      Audio API -- MediaElementAudioSourceNode -> MediaStreamDestination)
//      jadi satu MediaStream, direkam pakai MediaRecorder.
//
// KETERBATASAN: ini rekam REAL-TIME (bukan render cepat kayak ffmpeg), jadi
// proses ekspor makan waktu SAMA PERSIS kayak durasi lagu.
// ============================================================================

function pickMimeType() {
  const candidates = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(type)) {
      return type;
    }
  }
  return "";
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatRemaining(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "-0:00";
  return `-${formatTime(seconds)}`;
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

async function loadImage(src, crossOrigin) {
  const img = new Image();
  if (crossOrigin) img.crossOrigin = crossOrigin;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error("Gagal memuat gambar."));
    img.src = src;
  });
  return img;
}

async function bakeBlurredBackground(coverUrl, blurPx, width, height) {
  if (!coverUrl) return null;
  const img = await loadImage(coverUrl, "anonymous");

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");

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
  ctx.globalAlpha = 1;
  ctx.filter = "none";
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return loadImage(canvas.toDataURL("image/png"));
}

async function bakeStaticCard(stageEl, scaleFactor) {
  const progressEl = stageEl.querySelector("[data-export-progress-row]");
  const timeEl = stageEl.querySelector("[data-export-time-row]");
  const stageRect = stageEl.getBoundingClientRect();

  function relRect(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: (r.left - stageRect.left) * scaleFactor,
      y: (r.top - stageRect.top) * scaleFactor,
      w: r.width * scaleFactor,
      h: r.height * scaleFactor,
    };
  }

  // catat posisi SEBELUM disembunyikan -- elemen yang disembunyikan lewat
  // onclone cuma mempengaruhi clone-nya html2canvas, bukan DOM asli, jadi
  // aman ngukur dari DOM asli di sini.
  const progressRect = relRect(progressEl);
  const timeRect = relRect(timeEl);

  const onclone = (clonedDoc, clonedNode) => {
    clonedNode.querySelectorAll('[class*="backdrop-blur"]').forEach((el) => {
      el.style.backdropFilter = "none";
      el.style.webkitBackdropFilter = "none";
    });
    clonedNode.querySelectorAll("[data-export-progress-row], [data-export-time-row]").forEach((el) => {
      el.style.visibility = "hidden";
    });
    // background asli gak usah ikut ke-screenshot -- kita gambar sendiri
    // pakai versi yang udah di-bake blur di atas
    clonedNode.querySelectorAll("[data-export-ambient-bg]").forEach((el) => {
      el.style.visibility = "hidden";
    });
  };

  const canvas = await html2canvas(stageEl, {
    backgroundColor: null,
    useCORS: true,
    logging: false,
    scale: scaleFactor,
    onclone,
  });

  const cardImage = await loadImage(canvas.toDataURL("image/png"));
  return { cardImage, progressRect, timeRect };
}

/**
 * @param {Object} opts
 * @param {HTMLElement} opts.stageEl - node `stageRef.current` (background+card, TANPA overlay TikTok)
 * @param {HTMLAudioElement} opts.audioEl
 * @param {string|null} opts.coverUrl
 * @param {number} opts.bgBlurPx - blur css asli (px, belum discale ke resolusi ekspor)
 * @param {number} [opts.targetWidth] - lebar video output, default 1080 (rasio 9:16 -> tinggi 1920)
 * @param {(info:{currentTime:number, duration:number}) => void} [opts.onProgress]
 * @returns {Promise<{blob: Blob, mimeType: string}>}
 */
export async function exportStageAsVideo({ stageEl, audioEl, coverUrl, bgBlurPx, targetWidth = 1080, onProgress }) {
  if (!stageEl) throw new Error("Panggung (stage) tidak ditemukan.");
  if (!audioEl || !audioEl.src) throw new Error("Belum ada lagu yang diputar.");
  if (typeof MediaRecorder === "undefined") throw new Error("Browser ini tidak mendukung perekaman video (MediaRecorder).");

  const duration = audioEl.duration;
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error("Durasi audio tidak valid -- coba tunggu sampai lagu selesai dimuat.");
  }

  const scaleFactor = targetWidth / stageEl.offsetWidth;
  const targetHeight = Math.round(stageEl.offsetHeight * scaleFactor);

  const wasPlaying = !audioEl.paused;
  audioEl.pause();

  const [bgImage, staticCard] = await Promise.all([
    bakeBlurredBackground(coverUrl, bgBlurPx * scaleFactor, targetWidth, targetHeight),
    bakeStaticCard(stageEl, scaleFactor),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgImage) {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(staticCard.cardImage, 0, 0, canvas.width, canvas.height);

    const cur = audioEl.currentTime || 0;
    const pct = Math.min(1, Math.max(0, cur / duration));

    if (staticCard.progressRect) {
      const { x, y, w, h } = staticCard.progressRect;
      const barY = y + h / 2;
      const barH = Math.max(2, h * 0.22);

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      roundedRect(ctx, x, barY - barH / 2, w, barH, barH / 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.95)";
      roundedRect(ctx, x, barY - barH / 2, Math.max(barH, w * pct), barH, barH / 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + w * pct, barY, h * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }

    if (staticCard.timeRect) {
      const { x, y, w, h } = staticCard.timeRect;
      ctx.font = `600 ${Math.round(h * 0.85)}px -apple-system, system-ui, "Segoe UI", sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText(formatTime(cur), x, y + h / 2);
      ctx.textAlign = "right";
      ctx.fillText(formatRemaining(duration - cur), x + w, y + h / 2);
    }

    onProgress?.({ currentTime: cur, duration });
  }

  // ---- audio: dialirkan lewat Web Audio API biar bisa digabung ke
  //      stream video jadi satu file ----
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioCtx();
  const source = audioCtx.createMediaElementSource(audioEl);
  const dest = audioCtx.createMediaStreamDestination();
  source.connect(dest);
  source.connect(audioCtx.destination); // biar tetap kedengeran pas proses render jalan

  const canvasStream = canvas.captureStream(30);
  const combinedStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);

  const mimeType = pickMimeType();
  const recorder = new MediaRecorder(combinedStream, mimeType ? { mimeType } : undefined);
  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const stopped = new Promise((resolve) => {
    recorder.onstop = resolve;
  });

  let rafId = null;
  function loop() {
    drawFrame();
    rafId = requestAnimationFrame(loop);
  }

  async function cleanup() {
    if (rafId) cancelAnimationFrame(rafId);
    try {
      source.disconnect();
    } catch {}
    try {
      await audioCtx.close();
    } catch {}
  }

  try {
    audioEl.currentTime = 0;
    await audioEl.play();
    recorder.start();
    loop();

    await new Promise((resolve) => {
      audioEl.addEventListener("ended", resolve, { once: true });
    });

    recorder.stop();
    await stopped;
  } finally {
    await cleanup();
    if (wasPlaying) {
      audioEl.play().catch(() => {});
    }
  }

  return { blob: new Blob(chunks, { type: mimeType || "video/webm" }), mimeType: mimeType || "video/webm" };
}
