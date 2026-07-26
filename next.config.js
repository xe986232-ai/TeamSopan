/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
    // Konfigurasi khusus Remotion (server-side render engine) sudah dihapus
    // bareng /api/render-tiktok-video, lib/remotion-bundle.js, dan panel
    // ekspor di halaman /preview-tiktokoverlay -- fitur itu yang bikin
    // build Vercel gagal, dan sekarang halamannya murni preview + upload.
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
