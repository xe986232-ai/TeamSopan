// Skeleton grid buat halaman anggota. Bentuknya SENGAJA mengikuti markup
// asli di components/TeamSectionSimple01.jsx (avatar bulat, bukan card
// kotak generik) — dipakai di 2 tempat:
// 1. app/anggota/loading.js -> muncul kalau Next.js beneran lagi nunggu
//    data (mis. cache miss / regenerate ISR).
// 2. components/AnggotaReveal.jsx -> muncul sebentar (jeda sengaja) biar
//    transisi loading tetep kelihatan walau datanya udah siap duluan
//    (kejadian di Vercel karena halaman ini di-cache lewat `revalidate`).
const SKELETON_COUNT = 8;

function MemberSkeletonItem() {
  return (
    <li className="flex flex-col items-center gap-2">
      <div className="skeleton-shimmer h-20 w-20 rounded-full border border-black/10 md:h-24 md:w-24" />

      <div className="flex flex-col items-center gap-1.5 pt-0.5">
        <div className="skeleton-shimmer h-4 w-24 rounded-full" />
        <div className="skeleton-shimmer h-3 w-16 rounded-full" />
        <div className="skeleton-shimmer h-3 w-20 rounded-full" />
      </div>

      <div className="flex items-center gap-3 pt-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-4 w-4 rounded-full" />
        ))}
      </div>
    </li>
  );
}

export default function AnggotaSkeleton() {
  return (
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
  );
}
