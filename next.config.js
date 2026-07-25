/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
    // Remotion (dipakai lewat lib/remotion-bundle.js -> app/api/render-tiktok-video)
    // bergantung ke binary native (Chromium headless, ffmpeg, @rspack/core lewat
    // @remotion/bundler) yang TIDAK boleh diproses/dibundel lewat webpack -- itu
    // sebabnya harus ditandai "external" di sini, biar Next.js cuma require() paket
    // ini langsung dari node_modules saat runtime (server), bukan coba nge-parse isi
    // file binary-nya sebagai modul JS.
    serverComponentsExternalPackages: [
      "@remotion/bundler",
      "@remotion/renderer",
      "@remotion/tailwind",
      "@remotion/google-fonts",
      "remotion",
    ],
    // Remotion (via lib/remotion-bundle.js) menjalankan webpack-nya SENDIRI
    // di runtime (terpisah dari webpack Next.js), target browser (headless
    // Chromium) -- dia butuh SEMUA source mentah komponen yang dipakai
    // TiktokOverlayComposition ADA SEBAGAI FILE FISIK di /var/task, karena
    // Next.js hanya nge-inline file yang di-require secara statis ke dalam
    // chunk-nya sendiri, bukan nyalin file aslinya terpisah.
    //
    // Daftar di bawah ini hasil trace MANUAL & LENGKAP dari seluruh rantai
    // import remotion/index.js -> Root.jsx -> TiktokOverlayComposition.jsx
    // -> components/ui/tiktok-stage.jsx -> components/ui/music-player-card.jsx
    // -> lib/utils.js, termasuk SEMUA paket node_modules yang mereka pakai
    // (clsx, tailwind-merge, lucide-react, @remotion/google-fonts/Outfit) --
    // bukan ditambah satu-satu tiap ada error baru.
    outputFileTracingIncludes: {
      "/api/render-tiktok-video": [
        "./remotion/**/*",
        "./components/ui/tiktok-stage.jsx",
        "./components/ui/music-player-card.jsx",
        "./lib/utils.js",
        // PENTING: semua paket di bawah pakai varian ESM (dist/esm /
        // *.mjs), bukan CJS -- Remotion bundle() ini target-nya browser,
        // jadi resolusi exports field-nya pakai kondisi "import"/"module".
        "./node_modules/@remotion/google-fonts/package.json",
        "./node_modules/@remotion/google-fonts/dist/esm/Outfit.mjs",
        "./node_modules/clsx/package.json",
        "./node_modules/clsx/dist/clsx.mjs",
        "./node_modules/tailwind-merge/package.json",
        "./node_modules/tailwind-merge/dist/bundle-mjs.mjs",
        // lucide-react: entry esm-nya (dist/esm/lucide-react.js) me-re-export
        // SEMUA ikon (~3000 file) lewat static export, jadi webpack Remotion
        // butuh SELURUH folder icons ada biar bisa resolve module graph-nya
        // (walau abis itu di-tree-shake, cuma 7 ikon yang beneran dipakai) --
        // gak bisa cuma nyertain file ikon yang dipakai doang.
        "./node_modules/lucide-react/package.json",
        "./node_modules/lucide-react/dist/esm/**/*",
        // @remotion/renderer nge-require() binary compositor (Rust, buat
        // composite frame) + ffmpeg/ffprobe berdasarkan process.platform/
        // arch saat runtime -- ini optionalDependency, jadi gak otomatis
        // ke-trace walau paketnya (@remotion/renderer) sendiri udah
        // "external". Server Vercel jalan di Linux x64 glibc, jadi butuh
        // varian -linux-x64-gnu ini secara spesifik.
        "./node_modules/@remotion/compositor-linux-x64-gnu/**/*",
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};
module.exports = nextConfig;
