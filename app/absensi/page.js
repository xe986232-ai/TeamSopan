import Link from "next/link";
import { SiteNavbar } from "@/components/ui/site-navbar";
import { Button } from "@/components/ui/button";
import { ParticleField } from "@/components/ui/particle-field";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Fingerprint } from "lucide-react";

export const metadata = {
  title: "Absensi",
  robots: { index: false, follow: false },
};

// Halaman ini DULU tempat generate link absensi acak. Sekarang generate
// sesi (pilih divisi + tanggal/jam + durasi) sepenuhnya pindah ke
// /dashboard/absensi (khusus admin). Halaman publik /absensi ini sekarang
// cuma informasi -- anggota harus buka link sesi (/absensi/{roomId}) yang
// dibagikan admin, bukan generate sendiri dari sini.
export default function AbsensiPage() {
  return (
    <main className="relative bg-base min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <ParticleField colorFrom="#B026FF" colorTo="#00E5FF" density={30} />
      </div>

      <SiteNavbar
        navItems={[{ name: "Beranda", link: "/" }]}
        mobileGroups={[{ label: "Menu", items: [{ name: "Beranda", link: "/" }] }]}
      />

      <section className="relative z-10 px-6 sm:px-10 py-24 sm:py-32 max-w-lg mx-auto">
        <SpotlightCard glowFrom="#B026FF" glowTo="#00E5FF">
          <div className="flex flex-col items-center text-center gap-5 px-6 py-10 sm:px-10 sm:py-12">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #B026FF, #00E5FF)" }}
            >
              <Fingerprint size={24} />
            </span>

            <span className="font-body font-semibold text-xs tracking-[0.3em] uppercase text-ink-muted">
              Absensi
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink">
              Butuh Link Sesi Absensi
            </h1>
            <p className="text-sm text-ink-muted">
              Sesi absensi sekarang dibuat lewat dashboard admin, lengkap
              dengan tanggal, jam mulai, dan durasi sesi. Buka link absensi
              yang dibagikan admin divisi kamu buat isi kehadiran -- halaman
              ini bukan tempat generate link lagi.
            </p>

            <Link href="/" className="inline-block mt-3">
              <Button variant="secondary">Kembali ke Beranda</Button>
            </Link>
          </div>
        </SpotlightCard>
      </section>
    </main>
  );
}
