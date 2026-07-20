import { SiteNavbar } from "@/components/ui/site-navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi SOPAN TEAM — bagaimana kami mengelola data pribadi member.",
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

export default function PrivasiPage() {
  return (
    <main className="relative bg-base">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />

      <section className="px-6 sm:px-10 py-28 sm:py-32 max-w-3xl mx-auto">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mb-2">
          Kebijakan Privasi
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
            SOPAN TEAM menghargai privasi setiap orang yang mengisi formulir
            pendaftaran atau berinteraksi dengan situs ini. Kebijakan ini
            menjelaskan data apa yang kami kumpulkan, bagaimana data itu
            dipakai, dan hak kamu sebagai pemilik data.
          </p>

          <div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">
              Data yang kami kumpulkan
            </h2>
            <p>
              Saat kamu mendaftar lewat halaman Gabung, kami mengumpulkan
              nama depan, nama belakang, alamat email, kata sandi (untuk
              akses akun, disimpan dalam bentuk terenkripsi), dan divisi yang
              kamu pilih.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">
              Bagaimana data digunakan
            </h2>
            <p>
              Data pendaftaran dipakai semata-mata untuk proses seleksi dan
              komunikasi terkait keanggotaan SOPAN TEAM — misalnya follow up
              lewat email yang kamu daftarkan. Kami tidak menjual atau
              membagikan data pribadi kamu ke pihak ketiga untuk tujuan
              pemasaran.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">
              Penyimpanan &amp; keamanan
            </h2>
            <p>
              Data disimpan pada sistem yang kami kelola dan dilindungi
              dengan langkah keamanan yang wajar. Meski begitu, tidak ada
              sistem yang 100% bebas risiko — kami akan memberi tahu kamu
              apabila terjadi insiden keamanan yang berdampak pada data kamu.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">
              Hak kamu
            </h2>
            <p>
              Kamu berhak meminta akses, koreksi, atau penghapusan data
              pribadi yang kami simpan. Untuk permintaan tersebut, silakan
              hubungi admin SOPAN TEAM melalui kanal sosial media resmi kami.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">
              Perubahan kebijakan
            </h2>
            <p>
              Kebijakan ini bisa berubah sewaktu-waktu seiring perkembangan
              SOPAN TEAM. Perubahan signifikan akan kami umumkan lewat
              halaman ini.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
