import Link from "next/link";
import { SiteNavbar } from "@/components/ui/site-navbar";
import { Button } from "@/components/ui/button";

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
    <main className="relative bg-base min-h-screen">
      <SiteNavbar
        navItems={[{ name: "Beranda", link: "/" }]}
        mobileGroups={[{ label: "Menu", items: [{ name: "Beranda", link: "/" }] }]}
      />

      <section className="relative px-6 sm:px-10 py-24 sm:py-32 max-w-lg mx-auto text-center">
        <span className="font-body font-semibold text-xs tracking-[0.3em] uppercase text-ink-muted">
          Absensi
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 text-ink">
          Butuh Link Sesi Absensi
        </h1>
        <p className="text-sm text-ink-muted mt-3">
          Sesi absensi sekarang dibuat lewat dashboard admin, lengkap
          dengan tanggal, jam mulai, dan durasi sesi. Buka link absensi
          yang dibagikan admin divisi kamu buat isi kehadiran -- halaman
          ini bukan tempat generate link lagi.
        </p>

        <Link href="/" className="inline-block mt-8">
          <Button variant="secondary">Kembali ke Beranda</Button>
        </Link>
      </section>
    </main>
  );
}
