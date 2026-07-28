"use client";

import { ToastProvider } from "@/components/ui/toast";
import ForceLightTheme from "@/components/dashboard/ForceLightTheme";
import { DashboardRoleProvider } from "@/components/dashboard/DashboardRoleContext";

// Bungkus semua halaman /dashboard dengan ToastProvider, supaya toast
// (notifikasi sukses/gagal) bisa dipakai di halaman mana pun di dashboard
// (mis. saat Terima/Tolak pendaftar).
//
// ForceLightTheme dipasang di sini juga -- dashboard sengaja selalu
// terang, jadi kalau HP admin lagi dark mode, komponen form yang
// dark-mode-aware (TextField, Button, dst) dipaksa balik ke tampilan
// terang supaya nyambung sama sisa dashboard yang emang hardcode putih.
//
// DashboardRoleProvider nyebarin role ("master" / "division") yang
// sudah dihitung di Server Component (app/dashboard/layout.js) ke semua
// client component turunannya (mis. DashboardSidebar), biar menu yang
// muncul otomatis nyesuain siapa yang login -- tanpa tiap halaman perlu
// fetch ulang.
export default function DashboardLayoutClient({ role, children }) {
  return (
    <DashboardRoleProvider role={role}>
      <ToastProvider>
        <ForceLightTheme />
        {children}
      </ToastProvider>
    </DashboardRoleProvider>
  );
}
