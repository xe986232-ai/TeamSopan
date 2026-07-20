import { UserPlus, CalendarCheck, Users } from "lucide-react";

const SUMMARY_ITEMS = [
  {
    icon: UserPlus,
    title: "Pendaftar Menunggu",
    desc: "4 formulir baru dari halaman Gabung butuh direview.",
  },
  {
    icon: CalendarCheck,
    title: "Sesi Absensi Aktif",
    desc: "Divisi Remix sedang membuka sesi absensi mingguan.",
  },
  {
    icon: Users,
    title: "Anggota Baru Bulan Ini",
    desc: "2 anggota baru resmi gabung minggu ini.",
  },
];

export default function DashboardRightPanel() {
  return (
    <aside className="hidden xl:flex w-[320px] shrink-0 flex-col gap-5">
      {/* Widget biru — identitas SOPAN TEAM, mirip kartu "Sobat Flamo" */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1677F5] px-6 py-8 text-center text-white">
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
          Sopan Team
        </span>

        <div className="relative mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 border border-white/25">
          <span className="font-display font-extrabold text-xl">ST</span>
        </div>

        <h3 className="relative font-display font-extrabold text-lg mt-4">
          Hi, Admin!
        </h3>
        <p className="relative text-sm text-white/80 mt-2 leading-relaxed">
          Pantau anggota, pendaftar, dan absensi seluruh divisi dari satu
          tempat.
        </p>

        <div className="relative flex items-center justify-center gap-2 mt-5">
          <a
            href="/"
            className="rounded-full bg-white text-[#1677F5] text-xs font-semibold px-4 py-2 hover:bg-white/90 transition-colors"
          >
            Lihat Situs
          </a>
          <a
            href="/dashboard/pendaftar"
            className="rounded-full border border-white/40 text-white text-xs font-semibold px-4 py-2 hover:bg-white/10 transition-colors"
          >
            Tinjau Pendaftar
          </a>
        </div>
      </div>

      {/* List ringkasan — mirip "Pantau Course / Leaderboard / Gallery" */}
      <div className="flex flex-col gap-2.5">
        {SUMMARY_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-2xl border border-black/[0.06] bg-black/[0.02] p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1677F5]/10 text-[#1677F5]">
                <Icon size={16} />
              </span>
              <div>
                <p className="font-body font-semibold text-sm text-[#111827]">
                  {item.title}
                </p>
                <p className="text-xs text-black/50 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
