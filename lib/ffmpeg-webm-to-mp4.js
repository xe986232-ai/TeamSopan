// ============================================================================
// ffmpeg-webm-to-mp4.js -- transcode WebM (hasil MediaRecorder) -> MP4,
// full client-side lewat ffmpeg.wasm.
//
// SENGAJA dimuat dinamis dari CDN saat runtime (bukan `import` statis /
// dependency npm) supaya TIDAK ikut ke-bundle ke build Next.js/Vercel --
// ini pelajaran dari kegagalan migrasi Remotion sebelumnya (server-side
// rendering bikin build gagal terus). Pendekatan ini sama persis dengan
// referensi music-player.html yang sudah terbukti jalan.
//
// MediaRecorder browser modern belum konsisten dukung audio kalau langsung
// merekam ke MP4 (video/mp4 mimeType sering silent/tanpa suara), makanya
// kita SELALU rekam ke WebM (vp9/vp8 + opus) dulu, baru dikonversi ke MP4
// (h264 + aac) di sini.
// ============================================================================

const FFMPEG_SOURCES = [
  {
    script: "https://unpkg.com/@ffmpeg/[email protected]/dist/ffmpeg.min.js",
    core: "https://unpkg.com/@ffmpeg/[email protected]/dist/ffmpeg-core.js",
  },
  {
    script: "https://cdn.jsdelivr.net/npm/@ffmpeg/[email protected]/dist/ffmpeg.min.js",
    core: "https://cdn.jsdelivr.net/npm/@ffmpeg/[email protected]/dist/ffmpeg-core.js",
  },
];

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Gagal memuat " + src));
    document.head.appendChild(s);
  });
}

let ffmpegInstance = null;

async function getFFmpeg() {
  if (ffmpegInstance) return ffmpegInstance;
  let lastError = null;
  for (const source of FFMPEG_SOURCES) {
    try {
      await loadScriptOnce(source.script);
      const { createFFmpeg } = window.FFmpeg;
      const instance = createFFmpeg({ log: false, corePath: source.core });
      await instance.load();
      ffmpegInstance = instance;
      return ffmpegInstance;
    } catch (err) {
      lastError = err;
      // eslint-disable-next-line no-console
      console.warn("Gagal memuat ffmpeg dari", source.script, err);
    }
  }
  throw lastError || new Error("Semua sumber ffmpeg gagal dimuat");
}

export async function transcodeWebmToMp4(webmBlob, onProgress) {
  const ffmpeg = await getFFmpeg();
  const { fetchFile } = window.FFmpeg;
  ffmpeg.setProgress(({ ratio }) => {
    if (ratio >= 0 && ratio <= 1 && onProgress) onProgress(Math.round(ratio * 100));
  });
  ffmpeg.FS("writeFile", "input.webm", await fetchFile(webmBlob));
  await ffmpeg.run(
    "-i",
    "input.webm",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "23",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "output.mp4"
  );
  const data = ffmpeg.FS("readFile", "output.mp4");
  ffmpeg.FS("unlink", "input.webm");
  ffmpeg.FS("unlink", "output.mp4");
  return new Blob([data.buffer], { type: "video/mp4" });
}
