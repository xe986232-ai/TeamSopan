import PortfolioHero from "./ui/portfolio-hero";

// Hero section homepage — pakai desain "portfolio card" (nama besar +
// logo overlap + menu dropdown sendiri), gantiin versi SoftGlowBackground
// yang lama. Menu & toggle tema di sini terpisah dari <SiteNavbar />
// yang sudah tampil di atasnya; lihat catatan di app/page.js kalau mau
// menyembunyikan salah satunya supaya nggak dobel.
export default function Hero() {
  return <PortfolioHero />;
}
