import { SiteNavbar } from "@/components/ui/site-navbar";
import Footer from "@/components/Footer";

const navItems = [
  { name: "Tentang", link: "/#tentang" },
  { name: "Divisi", link: "/#divisi" },
  { name: "Anggota", link: "/anggota" },
];

const mobileGroups = [
  {
    label: "Menu",
    items: [
      { name: "Beranda", link: "/#top" },
      { name: "Tentang", link: "/#tentang" },
      { name: "Divisi", link: "/#divisi" },
      { name: "Anggota", link: "/anggota" },
    ],
  },
];

// Jumlah kartu skeleton yang ditampilkan sebelum data asli datang.
// Disamain kira-kira dengan jumlah anggota beneran biar grid-nya nggak
// "loncat" pas konten asli render.
const SKELETON_COUNT = 8;

// Satu item skeleton anggota — bentuknya SENGAJA dibuat mengikuti markup
// asli di components/TeamSectionSimple01.jsx (avatar bulat, bukan card
// kotak generik), supaya nggak ada layout shift pas data asli muncul.
function MemberSkeletonItem() {
  return (
    <li className="flex flex-col items-center gap-2">
      {/* Avatar bulat — ukuran sama persis dgn <Image> asli (80px / 96px md) */}
      <div className="skeleton-shimmer h-20 w-20 rounded-full border border-black/10 md:h-24 md:w-24" />

      <div className="flex flex-col items-center gap-1.5 pt-0.5">
        {/* Nama */}
        <div className="skeleton-shimmer h-4 w-24 rounded-full" />
        {/* Title (divisi singkat) */}
        <div className="skeleton-shimmer h-3 w-16 rounded-full" />
        {/* Divisi lengkap */}
        <div className="skeleton-shimmer h-3 w-20 rounded-full" />
      </div>

      {/* Baris ikon sosial */}
      <div className="flex items-center gap-3 pt-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-4 w-4 rounded-full" />
        ))}
      </div>
    </li>
  );
}

export default function AnggotaLoading() {
  return (
    <main className="relative bg-base">
      <SiteNavbar navItems={navItems} mobileGroups={mobileGroups} />

      <section className="bg-base py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            <span className="font-body font-semibold text-sm text-pink-500">Kenalan yuk</span>
            <h2 className="font-display font-extrabold mt-3 text-3xl text-ink sm:text-4xl">
              Anggota Komunitas Kami
            </h2>
            <p className="font-body font-normal mt-4 text-lg text-ink-muted">
              Kenalan sama member-member SOPAN TEAM — dari divisi Remix, Creator, sampai Leadis.
            </p>
          </div>

          <div className="mt-12 md:mt-16">
            <ul className="grid w-full grid-cols-2 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <MemberSkeletonItem key={i} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
