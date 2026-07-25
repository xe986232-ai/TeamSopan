"use client";

import { ToastProvider } from "@/components/ui/toast";
import ForceLightTheme from "@/components/dashboard/ForceLightTheme";

// Bungkus semua halaman /dashboard dengan ToastProvider, supaya toast
// (notifikasi sukses/gagal) bisa dipakai di halaman mana pun di dashboard
// (mis. saat Terima/Tolak pendaftar).
//
// ForceLightTheme dipasang di sini juga -- dashboard sengaja selalu
// terang, jadi kalau HP admin lagi dark mode, komponen form yang
// dark-mode-aware (TextField, Button, dst) dipaksa balik ke tampilan
// terang supaya nyambung sama sisa dashboard yang emang hardcode putih.
export default function DashboardLayout({ children }) {
  return (
    <ToastProvider>
      <ForceLightTheme />
      {children}
    </ToastProvider>
  );
}
