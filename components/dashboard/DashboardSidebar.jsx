"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarCheck,
  Disc3,
  Clapperboard,
  Sparkles,
  ShieldCheck,
  Activity,
  Settings,
  HelpCircle,
  CircleUserRound,
  LayoutGrid,
  ArrowUpRight,
} from "lucide-react";
import { useDashboardSidebar } from "./DashboardSidebarContext";

// Struktur menu dashboard — dikelompokkan sama seperti referensi desain
// (grup berlabel kecil, item dengan ikon). Halaman selain "/dashboard"
// belum dibuat isinya — ini murni tampilan dulu, backend & sub-halaman
// menyusul kemudian.
const NAV_GROUPS = [
  {
    label: "Menu",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Anggota", href: "/dashboard/anggota", icon: Users },
      { name: "Pendaftar Baru", href: "/dashboard/pendaftar", icon: UserPlus },
      { name: "Absensi", href: "/dashboard/absensi", icon: CalendarCheck },
    ],
  },
  {
    label: "Divisi",
    items: [
      { name: "Remix", href: "/dashboard/divisi/remix", icon: Disc3 },
      { name: "Creator", href: "/dashboard/divisi/creator", icon: Clapperboard },
      { name: "Leadis", href: "/dashboard/divisi/leadis", icon: Sparkles },
    ],
  },
  {
    label: "Komunitas",
    items: [
      { name: "Admin Divisi", href: "/dashboard/admin", icon: ShieldCheck },
      { name: "Aktivitas Login", href: "/dashboard/aktivitas", icon: Activity },
    ],
  },
  {
    label: "Lainnya",
    items: [
      { name: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
      { name: "Bantuan", href: "/dashboard/bantuan", icon: HelpCircle },
    ],
  },
];

export const SIDEBAR_WIDTH = 248;
const SMOOTH_EASE = [0.22, 1, 0.36, 1];

function isActive(pathname, href) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItem({ item, active }) {
  const Icon = item.icon;

  return (
    <Link href={item.href} className="relative block">
      <motion.div
        whileHover={{ x: active ? 0 : 4 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.18, ease: SMOOTH_EASE }}
        className="relative flex items-center gap-2.5 rounded-xl px-3 py-2.5"
      >
        {active && (
          <motion.span
            layoutId="dashboard-sidebar-active-pill"
            className="absolute inset-0 rounded-xl bg-white shadow-sm"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
        <span
          className={`relative z-10 flex items-center gap-2.5 text-sm font-medium transition-colors ${
            active ? "text-[#0F2C66]" : "text-white/70 hover:text-white"
          }`}
        >
          <Icon size={17} strokeWidth={2.2} />
          {item.name}
        </span>
      </motion.div>
    </Link>
  );
}

function SidebarContent({ pathname }) {
  return (
    <div
      style={{ width: SIDEBAR_WIDTH }}
      className="flex flex-col gap-6 py-2 text-white h-full"
    >
      {/* Banner kecil di atas, gradient 3 warna divisi + pil "Situs Utama" */}
      <div className="relative h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-remix-from via-creator-to to-leadis-to">
        <div className="absolute inset-0 bg-black/10" />
        <Link
          href="/"
          className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black text-white text-[11px] font-semibold pl-3 pr-2 py-1.5 hover:bg-black/80 transition-colors"
        >
          Situs Utama
          <ArrowUpRight size={12} />
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="px-3 text-[11px] font-semibold uppercase tracking-widest text-white/40">
              {group.label}
            </span>
            {group.items.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                active={isActive(pathname, item.href)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Profil — menempel di bawah, sama seperti referensi */}
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.18, ease: SMOOTH_EASE }}
        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white cursor-pointer border-t border-white/10 pt-4"
      >
        <span className="flex items-center gap-2.5">
          <CircleUserRound size={17} strokeWidth={2.2} />
          Profil
        </span>
        <LayoutGrid size={15} className="text-white/40" />
      </motion.div>
    </div>
  );
}

export default function DashboardSidebar({ mode = "flow" }) {
  const pathname = usePathname();
  const { open } = useDashboardSidebar();

  // Mode "overlay" (mobile): lebar KONSTAN, gak pernah dianimasikan —
  // posisinya fixed di belakang layer konten. DashboardShell yang
  // nge-translate konten buat nampilin/nyembunyiin ini, jadi sidebar-nya
  // sendiri gak pernah bikin apa pun di sebelahnya ikut resize/reflow.
  if (mode === "overlay") {
    return (
      <div className="absolute inset-y-0 left-0" style={{ width: SIDEBAR_WIDTH }}>
        <SidebarContent pathname={pathname} />
      </div>
    );
  }

  // Mode "flow" (desktop, default): perilaku lama — lebar aside
  // dianimasikan dari 0 ke SIDEBAR_WIDTH, konten sebelahnya ikut
  // menyesuaikan lewat flexbox. Di layar lebar ini gak masalah.
  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? SIDEBAR_WIDTH : 0 }}
      transition={{ duration: 0.38, ease: SMOOTH_EASE }}
      className="shrink-0 overflow-hidden"
    >
      {/* Lebar tetap di dalam, biar konten gak ikut "gepeng" pas animasi
          width berjalan — cuma wrapper luar yang menyusut. */}
      <SidebarContent pathname={pathname} />
    </motion.aside>
  );
}
