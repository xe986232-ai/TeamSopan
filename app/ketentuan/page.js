import { SiteNavbar } from "@/components/ui/site-navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Ketentuan Layanan",
  description: "Ketentuan layanan dan keanggotaan komunitas SOPAN TEAM.",
};

const navItems = [
  { name: "Tentang", link: "/#tentang" },
  { name: "Divisi", link: "/#divisi" },
];

const mobileGroups = [
  {
    label: "Menu",
    items: [
      { name: "Beranda", link: "/" },
      { name: "Tentang", link: "/#tentang" },
      { name: "Divisi", link: "/#divisi" },
    ],
  },
];

export default function KetentuanPage() {
  return (
    <main className="relative bg-base">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />

      <section className="px-6 sm:px-10 py-28 sm:py-32 max-w-3xl mx-auto">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mb-2">
          Ketentuan Layanan
        </h1>
        <p className="font-body text-sm text-ink-dim mb-10">
          Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="font-body font-normal text-ink-muted space-y-6 leading-relaxed">
          <p>
            Dengan mendaftar atau bergabung ke SOPAN TEAM, kamu dianggap
            menyetujui ketentuan berikut. Mohon dibaca sebelum mengisi
            formulir pendaftaran.
          </p>

          <div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">
              1. Keanggotaan
            </h2>
            <p>
              Keanggotaan SOPAN TEAM bersifat sukarela dan terbuka untuk
              siapa pun yang tertarik berkarya di divisi Remix, Creator,
              atau Leadis. Tim admin berhak menyeleksi calon member sesuai
              kebutuhan komunitas.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">
              2. Kewajiban member
            </h2>
            <p>
              Setiap member diharapkan berperilaku sopan, saling menghargai
              antar sesama kreator, dan tidak menyalahgunakan nama SOPAN
              TEAM untuk kepentingan pribadi yang merugikan komunitas.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">
              3. Konten &amp; karya
            </h2>
            <p>
              Karya yang dibuat member tetap menjadi hak milik masing-masing
              pembuat, kecuali disepakati lain. SOPAN TEAM dapat menampilkan
              karya member di situs atau media sosial resmi sebagai bagian
              dari showcase komunitas, dengan mencantumkan kredit yang
              sesuai.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">
              4. Pengunduran diri &amp; sanksi
            </h2>
            <p>
              Member bisa mengundurkan diri kapan saja. Tim admin berhak
              mengeluarkan member yang melanggar ketentuan ini setelah
              melalui proses peringatan yang wajar.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">
              5. Perubahan ketentuan
            </h2>
            <p>
              Ketentuan ini bisa diperbarui sewaktu-waktu. Perubahan akan
              diumumkan lewat halaman ini dan/atau kanal komunikasi resmi
              SOPAN TEAM.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
