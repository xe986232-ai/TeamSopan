// ============================================================================
// tiktok-stage-canvas.js -- "renderer" manual buat export video.
//
// KENAPA INI ADA:
// Percobaan sebelumnya migrasi dari html2canvas -> Remotion (server-side,
// Chromium headless) bikin build Vercel gagal terus (lihat commit
// b1bdcb5 "hapus engine Remotion penyebab build gagal"). html2canvas versi
// pertama juga gagal reproduksi backdrop-filter/blur dengan akurat.
//
// Solusinya (sama seperti music-player.html referensi): gambar ULANG
// tampilan TiktokStage + MusicPlayerCard secara manual ke <canvas> pakai
// Canvas 2D API, dengan proporsi (padding, radius, ukuran font, gap) yang
// dihitung SAMA PERSIS dari angka Tailwind di komponen aslinya. Ini murni
// client-side -- tidak nyentuh server sama sekali, jadi tidak akan pernah
// bikin build gagal seperti Remotion.
//
// Kalau tampilan TiktokStage / MusicPlayerCard (components/ui/tiktok-stage.jsx,
// components/ui/music-player-card.jsx) berubah, angka referensi di bawah ini
// (STAGE_REF_W, CARD_REF_W, dan semua metric di getCardMetrics) HARUS
// disesuaikan juga supaya hasil export tetap sinkron sama preview.
// ============================================================================

// Lebar referensi stage & card, dihitung supaya PERSIS sama proporsinya
// dengan yang benar-benar tampil di browser (bukan cuma dari className
// literal-nya) -- lihat penjelasan di bawah untuk STAGE_REF_W.
//
// STAGE_REF_W:
// TiktokStage dibungkus di dalam layar mockup <Iphone15Pro> (SVG dengan
// viewBox="0 0 433 882" -- lihat components/ui/iphone-15-pro.jsx). Area
// "layar" (foreignObject) di dalamnya cuma selebar 389.5 dari total viewBox
// 433, jadi konten di dalamnya otomatis ikut mengecil ~90% karena bezel HP
// (foreignObject-nya diskalakan ikut ukuran SVG luar, bukan 1:1 CSS px).
// Di TiktokPreviewScene, <Iphone15Pro> pakai className "w-[240px]
// sm:w-[280px]" -- breakpoint sm: (>=640px) HANYA aktif di desktop; di HP
// (kasus utama pemakaian, mockup TikTok) yang aktif adalah "w-[240px]".
// Jadi lebar TiktokStage yang SEBENARNYA tampil di HP = 240 * (389.5/433),
// BUKAN 280 mentah seperti sebelumnya -- selisih ini kecil di preview kecil,
// tapi ikut membesar signifikan saat di-scale ke resolusi export (720/1080px),
// makanya card hasil export kelihatan lebih besar/ke-zoom dibanding preview.
const IPHONE_OUTER_REF_W = 240; // w-[240px] Iphone15Pro di breakpoint mobile (dasar, bukan sm:)
const IPHONE_VIEWBOX_W = 433; // viewBox SVG asli Iphone15Pro (width default prop)
const IPHONE_SCREEN_VIEWBOX_W = 389.5; // lebar foreignObject "layar" dalam unit viewBox yang sama
export const STAGE_REF_W = IPHONE_OUTER_REF_W * (IPHONE_SCREEN_VIEWBOX_W / IPHONE_VIEWBOX_W);
export const CARD_REF_W = 272; // max-w-[272px] di MusicPlayerCard
export const CARD_SIDE_PADDING = 12; // px-3 pembungkus card di TiktokStage

export function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawCoverFit(ctx, img, x, y, w, h, r, extraScale = 1) {
  ctx.save();
  roundRectPath(ctx, x, y, w, h, r);
  ctx.clip();
  if (img) {
    const scale = Math.max(w / img.width, h / img.height) * extraScale;
    const iw = img.width * scale;
    const ih = img.height * scale;
    ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  } else {
    ctx.fillStyle = "#141414";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = `${Math.floor(Math.min(w, h) * 0.28)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("\u266A", x + w / 2, y + h / 2);
    ctx.textBaseline = "alphabetic";
  }
  ctx.restore();
}

function truncateText(ctx, text, maxWidth) {
  if (!text) return "";
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 0 && ctx.measureText(t + "\u2026").width > maxWidth) {
    t = t.slice(0, -1);
  }
  return t + "\u2026";
}

// ---- ikon-ikon transport, digambar manual (bukan font icon) supaya hasil
// render konsisten lintas browser, sama pendekatannya kayak reference. ----
function drawPlayIcon(ctx, cx, cy, size) {
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.42, cy - size * 0.55);
  ctx.lineTo(cx - size * 0.42, cy + size * 0.55);
  ctx.lineTo(cx + size * 0.55, cy);
  ctx.closePath();
  ctx.fill();
}
function drawPauseIcon(ctx, cx, cy, size) {
  const barW = size * 0.26;
  const barH = size * 1.05;
  const gap = size * 0.22;
  ctx.fillRect(cx - gap / 2 - barW, cy - barH / 2, barW, barH);
  ctx.fillRect(cx + gap / 2, cy - barH / 2, barW, barH);
}
function drawSkipIcon(ctx, cx, cy, size, isNext) {
  const dir = isNext ? 1 : -1;
  ctx.beginPath();
  const triCx = cx - dir * size * 0.28;
  ctx.moveTo(triCx - dir * size * 0.3, cy - size * 0.42);
  ctx.lineTo(triCx - dir * size * 0.3, cy + size * 0.42);
  ctx.lineTo(triCx + dir * size * 0.32, cy);
  ctx.closePath();
  ctx.fill();
  const barX = cx + dir * size * 0.42;
  ctx.fillRect(barX - size * 0.06, cy - size * 0.42, size * 0.12, size * 0.84);
}
function drawCastIcon(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.11;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx - size * 0.42, cy + size * 0.42, size * 0.14, -Math.PI / 2, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx - size * 0.42, cy + size * 0.42, size * 0.32, -Math.PI / 2, 0);
  ctx.stroke();
  roundRectPath(ctx, cx - size * 0.5, cy - size * 0.4, size, size * 0.72, size * 0.08);
  ctx.stroke();
  ctx.restore();
}
function drawSpeakerIcon(ctx, x, y, size, loud, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.28);
  ctx.lineTo(x + size * 0.3, y - size * 0.28);
  ctx.lineTo(x + size * 0.62, y - size * 0.58);
  ctx.lineTo(x + size * 0.62, y + size * 0.58);
  ctx.lineTo(x + size * 0.3, y + size * 0.28);
  ctx.lineTo(x, y + size * 0.28);
  ctx.closePath();
  ctx.fill();
  if (loud) {
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.1;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(x + size * 0.62, y, size * 0.78, -Math.PI * 0.3, Math.PI * 0.3);
    ctx.stroke();
  }
}

// Semua angka di bawah adalah px ASLI dari kelas Tailwind di
// MusicPlayerCard pada lebar referensi CARD_REF_W = 272.
function getCardMetrics(scale) {
  return {
    pad: 14 * scale,
    radius: 28 * scale,
    coverGapAfter: 12 * scale, // mt-3
    titleFont: 14 * scale,
    titleLineH: 14 * 1.375 * scale, // leading-snug
    subtitleFont: 11 * scale,
    subtitleLineH: 11 * 1.375 * scale,
    castSize: 16 * scale,
    gapAfterTitleBlock: 12 * scale, // mt-3 (progress row)
    progressRowH: 12 * scale, // h-3
    trackH: 3 * scale,
    thumbR: 6 * scale,
    gapAfterProgress: 2 * scale, // mt-0.5
    timeFont: 10.5 * scale,
    timeRowH: 10.5 * 1.3 * scale,
    gapAfterTime: 12 * scale, // mt-3 (controls)
    controlsH: 25 * scale, // tinggi ikon play terbesar
    controlsGap: 28 * scale, // gap-7
    gapAfterControls: 12 * scale, // mt-3 (volume)
    volumeIconL: 13 * scale,
    volumeIconR: 15 * scale,
    volumeGap: 8 * scale, // gap-2
    volumeRowH: 15 * scale,
  };
}

export function computeCardHeight(cardW, scaleFromRef) {
  // PENTING: skala metrik internal card (padding, font, gap, dst) HARUS
  // pakai `scaleFromRef` (skala seluruh panggung terhadap STAGE_REF_W),
  // BUKAN `cardW / CARD_REF_W`. Keduanya beda nilai karena cardW nyaris
  // selalu lebih kecil dari CARD_REF_W (272) -- di preview asli, card
  // TIDAK pernah benar-benar dirender di lebar 272px (dibatasi lebar layar
  // mockup HP yang cuma ~216px), tapi padding/font-nya tetap px ABSOLUT
  // (p-3.5=14px, text-[14px], dst -- bukan ikut menyusut proporsional
  // sama lebar card). Jadi skala yang benar buat "membesarkan" metrik itu
  // ke resolusi export adalah skala PANGGUNG (scaleFromRef), sama seperti
  // background & posisi card di-skalakan. Pakai cardW/CARD_REF_W di sini
  // bikin metrik (padding/font) hasil export lebih KECIL dari seharusnya
  // relatif terhadap card, sehingga elemen di dalam card (cover, teks)
  // kelihatan lebih "penuh"/ke-zoom dibanding preview asli.
  const m = getCardMetrics(scaleFromRef);
  const innerW = cardW - m.pad * 2;
  const coverH = innerW * (9 / 10); // aspect-[10/9]
  return (
    m.pad * 2 +
    coverH +
    m.coverGapAfter +
    m.titleLineH +
    m.subtitleLineH +
    m.gapAfterTitleBlock +
    m.progressRowH +
    m.gapAfterProgress +
    m.timeRowH +
    m.gapAfterTime +
    m.controlsH +
    m.gapAfterControls +
    m.volumeRowH
  );
}

// Hitung ukuran & posisi card di tengah stage, mengikuti aturan
// `px-3` (padding kiri/kanan) + `max-w-[272px]`, diskalakan dari
// `refW` (lebar CSS px stage yang BENERAN dipakai preview, diukur
// langsung dari DOM lewat getBoundingClientRect() -- lihat catatan
// panjang di drawStageFrame() kenapa ini lebih akurat daripada
// STAGE_REF_W konstan) supaya proporsinya identik dengan preview.
export function computeCardLayout(stageW, stageH, refW = STAGE_REF_W, sidePaddingRef = CARD_SIDE_PADDING) {
  const scaleFromRef = stageW / refW;
  const sidePad = sidePaddingRef * scaleFromRef;
  const maxCardW = CARD_REF_W * scaleFromRef;
  const cardW = Math.min(stageW - sidePad * 2, maxCardW);
  const cardH = computeCardHeight(cardW, scaleFromRef);
  return {
    cardX: (stageW - cardW) / 2,
    cardY: (stageH - cardH) / 2,
    cardW,
    cardH,
    scaleFromRef,
  };
}

// Gambar background ambient (blur cover / gradient fallback) + overlay
// gelap, persis seperti div background di TiktokStage.
export function drawStageBackground(ctx, stageW, stageH, coverImg, bgBlurPx, scaleFromRef) {
  ctx.save();
  ctx.clearRect(0, 0, stageW, stageH);
  if (coverImg) {
    ctx.save();
    ctx.filter = `blur(${bgBlurPx * scaleFromRef}px) saturate(150%)`;
    ctx.globalAlpha = 0.9;
    const scale = Math.max(stageW / coverImg.width, stageH / coverImg.height) * 1.25;
    const iw = coverImg.width * scale;
    const ih = coverImg.height * scale;
    ctx.drawImage(coverImg, (stageW - iw) / 2, (stageH - ih) / 2, iw, ih);
    ctx.restore();
  } else {
    const grad = ctx.createLinearGradient(0, 0, stageW * 0.6, stageH);
    grad.addColorStop(0, "#404040");
    grad.addColorStop(0.55, "#171717");
    grad.addColorStop(1, "#000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, stageW, stageH);
  }
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, stageW, stageH);
  ctx.restore();
}

// Gambar MusicPlayerCard lengkap (cover, judul/artist, progress, transport,
// volume) pada koordinat & ukuran dari computeCardLayout().
export function drawMusicPlayerCard(ctx, layout, cardState) {
  const { cardX, cardY, cardW, cardH, scaleFromRef } = layout;
  const {
    coverImg,
    title = "Belum ada lagu",
    subtitle = "Tambahkan lagu di panel bawah",
    bgOpacity = 85,
    currentTime = 0,
    duration = 0,
    volume = 70,
  } = cardState;

  // scale metrik internal (padding/font/gap) HARUS ikut scaleFromRef
  // (skala panggung), bukan cardW/CARD_REF_W -- lihat catatan panjang di
  // computeCardHeight() untuk penjelasan lengkap kenapa.
  const scale = scaleFromRef ?? cardW / CARD_REF_W;
  const m = getCardMetrics(scale);
  const innerW = cardW - m.pad * 2;

  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, m.radius);
  ctx.clip();
  ctx.fillStyle = `rgba(0,0,0,${Math.max(0, Math.min(100, bgOpacity)) / 100})`;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  let cx = cardX + m.pad;
  let cy = cardY + m.pad;

  // cover art (aspect 10/9)
  const coverH = innerW * (9 / 10);
  drawCoverFit(ctx, coverImg, cx, cy, innerW, coverH, 18.4 * scale);
  cy += coverH + m.coverGapAfter;

  // judul + subtitle + cast icon
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 ${m.titleFont}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = "left";
  const titleMaxW = innerW - m.castSize - 8 * scale;
  ctx.fillText(truncateText(ctx, title, titleMaxW), cx, cy + m.titleFont);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = `400 ${m.subtitleFont}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText(truncateText(ctx, subtitle, titleMaxW), cx, cy + m.titleLineH + m.subtitleFont);
  drawCastIcon(ctx, cx + innerW - m.castSize / 2, cy + m.castSize / 2, m.castSize, "rgba(255,255,255,0.7)");
  cy += m.titleLineH + m.subtitleLineH + m.gapAfterTitleBlock;

  // progress bar
  const dur = duration || 0;
  const pct = dur ? Math.min(1, Math.max(0, currentTime / dur)) : 0;
  const trackY = cy + m.progressRowH / 2 - m.trackH / 2;
  roundRectPath(ctx, cx, trackY, innerW, m.trackH, m.trackH / 2);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fill();
  if (pct > 0) {
    roundRectPath(ctx, cx, trackY, innerW * pct, m.trackH, m.trackH / 2);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx + innerW * pct, trackY + m.trackH / 2, m.thumbR, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  cy += m.progressRowH + m.gapAfterProgress;

  // time row
  ctx.font = `400 ${m.timeFont}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.textAlign = "left";
  ctx.fillText(formatTime(currentTime), cx, cy + m.timeFont);
  ctx.textAlign = "right";
  ctx.fillText("-" + formatTime(Math.max(dur - currentTime, 0)), cx + innerW, cy + m.timeFont);
  ctx.textAlign = "left";
  cy += m.timeRowH + m.gapAfterTime;

  // transport controls (statis: play/pause sesuai isPlaying)
  const ctrlY = cy + m.controlsH / 2;
  const centerX = cx + innerW / 2;
  ctx.fillStyle = "#ffffff";
  drawSkipIcon(ctx, centerX - m.controlsGap - 19 * scale, ctrlY, 19 * scale, false);
  if (cardState.isPlaying) {
    drawPauseIcon(ctx, centerX, ctrlY, 25 * scale);
  } else {
    drawPlayIcon(ctx, centerX, ctrlY, 25 * scale);
  }
  drawSkipIcon(ctx, centerX + m.controlsGap + 19 * scale, ctrlY, 19 * scale, true);
  cy += m.controlsH + m.gapAfterControls;

  // volume row
  const volY = cy + m.volumeRowH / 2;
  drawSpeakerIcon(ctx, cx + m.volumeIconL / 2, volY, m.volumeIconL, false, "rgba(255,255,255,0.6)");
  const volBarX = cx + m.volumeIconL + m.volumeGap;
  const volBarW = innerW - m.volumeIconL - m.volumeIconR - m.volumeGap * 2;
  const volTrackY = volY - m.trackH / 2;
  roundRectPath(ctx, volBarX, volTrackY, volBarW, m.trackH, m.trackH / 2);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fill();
  const volPct = Math.max(0, Math.min(100, volume)) / 100;
  if (volPct > 0) {
    roundRectPath(ctx, volBarX, volTrackY, volBarW * volPct, m.trackH, m.trackH / 2);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fill();
  }
  drawSpeakerIcon(ctx, volBarX + volBarW + m.volumeGap + m.volumeIconR / 2, volY, m.volumeIconR, true, "rgba(255,255,255,0.6)");

  ctx.restore();
}

export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Gambar 1 frame utuh (background + card) -- dipanggil tiap
// requestAnimationFrame saat merekam, dan juga bisa dipakai buat export
// gambar diam (PNG).
//
// `state.refStageWidth` (opsional): lebar CSS px stage NYATA di preview,
// diukur langsung dari DOM (getBoundingClientRect()) oleh TiktokPreviewScene
// lewat ref yang ditempel ke <TiktokStage>, lalu dioper tiap frame lewat
// getExportState(). Ini dipakai (bukan STAGE_REF_W yang konstan/tebakan)
// supaya rasio card:stage hasil export SELALU sama persis dengan yang
// BENERAN tampil di layar user saat itu -- gak lagi bergantung asumsi
// breakpoint Tailwind mana yang aktif (w-[240px] vs sm:w-[280px]), yang
// gampang meleset kalau className mockup HP berubah di masa depan.
// STAGE_REF_W tetap dipertahankan sebagai fallback kalau ref belum terukur
// (mis. dipanggil di luar konteks TiktokPreviewScene).
export function drawStageFrame(ctx, stageW, stageH, state) {
  const refW = state.refStageWidth || STAGE_REF_W;
  const scaleFromRef = stageW / refW;
  drawStageBackground(ctx, stageW, stageH, state.coverImg, state.bgBlur, scaleFromRef);
  const layout = computeCardLayout(stageW, stageH, refW, state.sidePadding);
  drawMusicPlayerCard(ctx, layout, state);
}

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(null);
      return;
    }
    // JANGAN set img.crossOrigin di sini -- sampul lagu berasal dari file
    // lokal (blob: URL hasil upload user), dan di banyak browser Android,
    // ngasih crossOrigin ke blob: URL bikin gambar gagal dimuat secara
    // diam-diam (onerror tanpa pesan jelas), sehingga coverImg jadi null
    // pas export walau tampil normal di preview (<img> biasa tanpa
    // crossOrigin). Referensi music-player.html juga tidak pakai ini.
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
