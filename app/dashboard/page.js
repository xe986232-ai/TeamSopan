import { Users, UserPlus, CalendarCheck, ShieldCheck, Layers } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardModuleCard from "@/components/dashboard/DashboardModuleCard";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";

export const metadata = {
  title: "Dashboard | SOPAN TEAM",
  description: "Dashboard admin SOPAN TEAM — kelola anggota, pendaftar, absensi, dan divisi.",
};

// Data kartu modul — angka masih contoh (dummy), backend nyusul kemudian.
const MODULE_CARDS = [
  {
    color: "pink",
    tagIcon: Users,
    tag: "12 anggota terdaftar",
    title: "Manajemen Anggota",
    description: "Kelola profil dan status anggota di tiap divisi.",
    footerLabel: "Data komunitas",
    actionLabel: "Kelola Anggota",
    href: "/dashboard/anggota",
  },
  {
    color: "blue",
    tagIcon: UserPlus,
    tag: "4 menunggu review",
    title: "Pendaftar Baru",
    description: "Tinjau formulir pendaftaran yang masuk dari halaman Gabung.",
    footerLabel: "Data komunitas",
    actionLabel: "Tinjau Pendaftar",
    href: "/dashboard/pendaftar",
  },
  {
    color: "yellow",
    tagIcon: CalendarCheck,
    tag: "3 sesi aktif",
    title: "Sesi Absensi",
    description: "Lihat riwayat kehadiran dan buat sesi absensi baru.",
    footerLabel: "Data komunitas",
    actionLabel: "Kelola Absensi",
    href: "/dashboard/absensi",
  },
  {
    color: "green",
    tagIcon: ShieldCheck,
    tag: "3 divisi",
    title: "Admin Divisi",
    description: "Atur siapa yang jadi admin di tiap divisi.",
    footerLabel: "Data komunitas",
    actionLabel: "Kelola Admin",
    href: "/dashboard/admin",
  },
  {
    color: "purple",
    tagIcon: Layers,
    tag: "Remix · Creator · Leadis",
    title: "Konten Divisi",
    description: "Perbarui showcase karya & deskripsi tiap divisi.",
    footerLabel: "Data komunitas",
    actionLabel: "Kelola Konten",
    href: "/dashboard/divisi",
  },
];

export default function DashboardPage() {
  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Dashboard SOPAN TEAM"
        subtitle="Pantau anggota, pendaftar, dan absensi seluruh divisi dari sini."
        searchPlaceholder="Cari anggota, pendaftar, atau sesi absensi..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODULE_CARDS.map((card) => (
          <DashboardModuleCard key={card.title} {...card} />
        ))}
      </div>
    </DashboardShell>
  );
}
