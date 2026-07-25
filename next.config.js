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
    // remotion/Root.jsx & remotion/TiktokOverlayComposition.jsx cuma
    // direferensikan lewat string path (bundle() entryPoint di
    // lib/remotion-bundle.js), bukan import statis -- jadi Next.js gak
    // otomatis nyertain mereka ke serverless function bundle. Tanpa ini,
    // di /var/task cuma ada remotion/index.js, bikin webpack Remotion
    // gagal resolve "./Root" saat runtime di Vercel.
    outputFileTracingIncludes: {
      "/api/render-tiktok-video": [
        "./remotion/**/*",
        // @remotion/google-fonts/Outfit (dipakai di TiktokOverlayComposition.jsx)
        // cuma required lewat file yang di-copy manual di atas, jadi gak
        // ke-trace otomatis. Paket lengkapnya ~64MB (semua Google Fonts),
        // makanya cuma file yang benar-benar dipakai (Outfit + dependency
        // internalnya) yang disertakan, bukan seluruh folder paket.
        "./node_modules/@remotion/google-fonts/package.json",
        "./node_modules/@remotion/google-fonts/dist/cjs/base.js",
        "./node_modules/@remotion/google-fonts/dist/cjs/Outfit.js",
        "./node_modules/@remotion/google-fonts/dist/cjs/resolve-font-subsets.js",
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
