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
// ============================================================================

let bundlePromise = null;

export function getBundleLocation() {
  if (!bundlePromise) {
    bundlePromise = bundle({
      entryPoint: path.join(process.cwd(), "remotion", "index.js"),
      webpackOverride: (config) => enableTailwind(config),
    }).catch((err) => {
      // reset supaya percobaan render berikutnya bisa nyoba bundle ulang,
      // bukan stuck di promise yang udah gagal selamanya
      bundlePromise = null;
      throw err;
    });
  }
  return bundlePromise;
}
