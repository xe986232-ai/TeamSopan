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
