import path from "path";
import { bundle } from "@remotion/bundler";
import { enableTailwind } from "@remotion/tailwind";

// ============================================================================
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
//
// PENTING soal file fisik di server (lihat next.config.js
// outputFileTracingIncludes): bundle() ini jalanin webpack-nya SENDIRI di
// runtime, terpisah total dari webpack punya Next.js -- dia butuh source
// mentah (remotion/*.jsx, components/ui/*.jsx, dst) ADA SEBAGAI FILE FISIK
// di /var/task, bukan cukup "ke-bundle" oleh Next.js. Next.js
// nge-inline/compile file yang di-require secara statis ke dalam chunk
// route ini -- itu TIDAK bikin file aslinya ikut ke-copy terpisah ke
// server. Makanya daftar file yang dibutuhkan Remotion harus didaftarkan
// eksplisit lewat outputFileTracingIncludes, bukan lewat require() biasa.
// ============================================================================

let bundlePromise = null;

export function getBundleLocation() {
  if (!bundlePromise) {
    bundlePromise = bundle({
      entryPoint: path.join(process.cwd(), "remotion", "index.js"),
      webpackOverride: (config) => {
        const withTailwind = enableTailwind(config);
        return {
          ...withTailwind,
          // /var/task read-only di Vercel production -- webpack gak boleh
          // nyoba nulis cache ke node_modules/.cache (EROFS), jadi cache
          // di-nonaktifin biar bundling jalan murni di memori tiap kali.
          cache: false,
          resolve: {
            ...withTailwind.resolve,
            alias: {
              ...withTailwind.resolve?.alias,
              // Next.js otomatis ngerti alias "@/*" -> "./*" (dari
              // jsconfig.json) buat build-nya sendiri, tapi bundle()
              // Remotion ini instance webpack yang TERPISAH -- dia gak
              // baca jsconfig.json sama sekali, jadi alias-nya harus
              // didaftarkan manual di sini juga. Tanpa ini,
              // "@/components/ui/music-player-card" (dipakai di
              // TiktokOverlayComposition.jsx / tiktok-stage.jsx) gagal
              // di-resolve walau file fisiknya udah ada di server.
              "@": process.cwd(),
            },
          },
        };
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
