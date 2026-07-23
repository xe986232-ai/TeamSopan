"use client";

import { ToastProvider } from "@/components/ui/toast";

// Bungkus semua halaman /dashboard dengan ToastProvider, supaya toast
// (notifikasi sukses/gagal) bisa dipakai di halaman mana pun di dashboard
// (mis. saat Terima/Tolak pendaftar).
export default function DashboardLayout({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
