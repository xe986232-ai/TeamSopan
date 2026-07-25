import path from "path";
import { bundle } from "@remotion/bundler";
import { enableTailwind } from "@remotion/tailwind";

// ============================================================================
// __traceRemotionSourceForBundling -- SENGAJA GAK PERNAH DIPANGGIL beneran
// (dibungkus kondisi yang selalu false saat runtime). Satu-satunya fungsi
// baris ini adalah jadi "jangkar" statis: Next.js nge-trace file yang perlu
// ikut ke serverless bundle (/var/task) lewat @vercel/nft, yang cara
// kerjanya BACA KODE SECARA STATIS (parse AST), BUKAN nge-eksekusi-nya --
// jadi require() di bawah ini tetap ke-detect & bikin Next ikut nyertain
// remotion/index.js -> Root.jsx -> TiktokOverlayComposition.jsx -> SEMUA
// komponen bersama yang dia pakai (tiktok-stage, music-player-card, dst,
// termasuk yang belum ada sekarang) -> dan SEMUA node_modules yang mereka
// import (termasuk resolusi exports-field yang benar, mis.
// @remotion/google-fonts/Outfit -- otomatis kepilih varian cjs/esm yang
// tepat, gak perlu kita tebak manual lagi).
//
// Kenapa harus dibungkus kondisi (bukan `if (false)` polos): minifier
// produksi bisa nge-hapus blok `if (false)` sebelum nft sempat baca file
// hasil build. `process.env.__NEXT_TRACE_ONLY_NEVER_SET` gak bisa
// dipastikan false saat build (nilainya cuma diketahui saat runtime),
// jadi blok ini SELAMANYA lolos dari dead-code elimination, tapi juga
// SELAMANYA gak pernah benar-benar jalan (env var itu emang gak pernah
// di-set di mana pun) -- termasuk loadFont() di baris atas
// TiktokOverlayComposition.jsx yang seharusnya cuma jalan di dalam
// Chromium headless-nya Remotion, bukan di proses Node ini.
function __traceRemotionSourceForBundling() {
  if (process.env.__NEXT_TRACE_ONLY_NEVER_SET) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../remotion/index.js");
  }
}
// Panggil sekali di module scope -- biar minifier produksi (Terser) gak
// nganggep fungsi di atas "gak kepake" terus dihapus sebelum nft sempat
// baca require() di dalamnya. Pemanggilan ini sendiri no-op (guard-nya
// tetap false), jadi gak ada efek samping apa pun saat runtime.
__traceRemotionSourceForBundling();

// getBundleLocation -- bundle remotion/index.js SEKALI (webpack), lalu
// cache hasilnya (path folder statis) di memori proses Node ini. Semua
// request render (gambar & video) berikutnya makai bundle yang sama --
// cuma inputProps (judul, artist, file audio/sampul, dst) yang beda per
// request, jadi gak perlu bundling ulang tiap kali user klik ekspor.
//
// enableTailwind: dipasang eksplisit di sini (bukan cuma lewat
// remotion.config.js, yang dibaca CLI seperti `npx remotion studio`) supaya
// class Tailwind (font-display, backdrop-blur-xl, dst) yang dipakai
// TiktokStage/MusicPlayerCard tetap ke-compile walau bundle() dipanggil
// programatik dari API route, bukan dari CLI.
// ============================================================================

let bundlePromise = null;

export function getBundleLocation() {
  if (!bundlePromise) {
    bundlePromise = bundle({
      entryPoint: path.join(process.cwd(), "remotion", "index.js"),
      webpackOverride: (config) => {
        const withTailwind = enableTailwind(config);
        // /var/task read-only di Vercel production -- webpack gak boleh
        // nyoba nulis cache ke node_modules/.cache (EROFS), jadi cache
        // di-nonaktifin biar bundling jalan murni di memori tiap kali.
        return { ...withTailwind, cache: false };
      },
    }).catch((err) => {
      // reset supaya percobaan render berikutnya bisa nyoba bundle ulang,
      // bukan stuck di promise yang udah gagal selamanya
      bundlePromise = null;
      throw err;
    });
  }
  return bundlePromise;
}
