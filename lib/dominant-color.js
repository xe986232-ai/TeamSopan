import "server-only";
import sharp from "sharp";

// Ekstraksi warna dominan dari buffer gambar, dipakai pas admin upload cover
// trending sound (lib/dominant-color.js -> dipanggil dari
// app/dashboard/trending-sound/actions.js). Tujuannya: `panel_color` di
// tabel `trending_sounds` keisi otomatis sesuai warna gambar, jadi kartu +
// gradient bawahnya nyambung visual sama cover-nya, nggak perlu pilih warna
// manual.
//
// Pendekatan: resize gambar ke ukuran kecil (kotak 48x48) biar proses cepat,
// lalu quantize tiap piksel ke "bucket" warna (rounding per channel) dan
// hitung bucket mana yang paling sering muncul. Ini lebih representatif
// dibanding sekadar rata-rata semua piksel, karena rata-rata gampang jadi
// abu-abu/coklat kusam kalau gambarnya kontras (background gelap + subjek
// terang, dsb).
//
// Warna hasil ekstraksi juga di-"gelapkan" (darken) sedikit karena
// panel_color dipakai sebagai gradient panel BELAKANG teks putih (title/
// creator) di kartu -- kalau warna dominannya terang, teks putih jadi nggak
// kebaca. Lihat DARKEN_FACTOR di bawah.

const SAMPLE_SIZE = 48; // sisi kotak resize, cukup kecil buat cepat & representatif
const BUCKET_STEP = 24; // lebar bucket per channel (0-255) buat quantize warna
const DARKEN_FACTOR = 0.55; // 1 = warna asli, makin kecil makin gelap
const FALLBACK_COLOR = "#111827";

function clamp255(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function toHex(r, g, b) {
  return `#${[r, g, b].map((c) => clamp255(c).toString(16).padStart(2, "0")).join("")}`;
}

/**
 * @param {Buffer} imageBuffer - buffer gambar asli (dari file.arrayBuffer())
 * @returns {Promise<string>} warna hex, misal "#2b1911". Fallback ke
 *   FALLBACK_COLOR kalau proses gagal (format nggak didukung, dll) -- upload
 *   cover tetap harus sukses walau ekstraksi warna gagal.
 */
export async function extractDominantColor(imageBuffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: "cover" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels; // 3 (RGB) karena sudah removeAlpha
    const buckets = new Map(); // key: "r,g,b" (sudah di-bucket) -> { count, rSum, gSum, bSum }

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // lewatin piksel yang terlalu gelap/terang polos (border/shadow/highlight
      // flat) supaya bucket-nya nggak didominasi warna "kosong"
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max < 18 || min > 245) continue;

      const key = `${Math.floor(r / BUCKET_STEP)},${Math.floor(g / BUCKET_STEP)},${Math.floor(b / BUCKET_STEP)}`;
      const entry = buckets.get(key) || { count: 0, rSum: 0, gSum: 0, bSum: 0 };
      entry.count += 1;
      entry.rSum += r;
      entry.gSum += g;
      entry.bSum += b;
      buckets.set(key, entry);
    }

    let best = null;
    for (const entry of buckets.values()) {
      if (!best || entry.count > best.count) best = entry;
    }

    // semua piksel kefilter (misal gambar putih/hitam polos) -- fallback ke
    // rata-rata seluruh piksel tanpa filter
    if (!best) {
      let rSum = 0, gSum = 0, bSum = 0, n = 0;
      for (let i = 0; i < data.length; i += channels) {
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
        n += 1;
      }
      if (n === 0) return FALLBACK_COLOR;
      best = { count: n, rSum, gSum, bSum };
    }

    const r = (best.rSum / best.count) * DARKEN_FACTOR;
    const g = (best.gSum / best.count) * DARKEN_FACTOR;
    const b = (best.bSum / best.count) * DARKEN_FACTOR;

    return toHex(r, g, b);
  } catch (err) {
    console.error("[extractDominantColor] Gagal ekstrak warna dominan:", err);
    return FALLBACK_COLOR;
  }
}
