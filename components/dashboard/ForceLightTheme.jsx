"use client";

import * as React from "react";
import { useTheme } from "next-themes";

// Dashboard admin SENGAJA didesain selalu tampil terang -- semua warna
// di komponennya di-hardcode literal putih/hitam (lihat DashboardShell.jsx
// -> `bg-white`, AttendanceSessionsList.jsx -> `text-[#111827]`, dst),
// gak dibikin ikut dark mode.
//
// Masalahnya: beberapa komponen form yang DIPAKAI di dashboard (TextField,
// Button, Checkbox, dst di components/ui) itu SHARED sama halaman publik
// yang MEMANG dark-mode aware (pakai next-themes, class "dark" di <html>
// yang ngikutin system preference HP/browser -- lihat theme-provider.jsx).
//
// Kalau HP admin lagi dark mode, komponen shared itu otomatis ganti warna
// (dark:bg-white, dark:border-white/10, dll), sementara bungkusnya
// (DashboardShell) tetap putih literal -- hasilnya belang: input jadi
// kotak hitam, label & tombol jadi nyaris gak kebaca (terang di atas
// terang). Itu penyebab tampilan "berantakan" di dashboard absensi.
//
// Fix: paksa theme "light" selama ada halaman /dashboard yang lagi
// dibuka (dipasang di app/dashboard/layout.js), balikin ke pilihan
// semula pas keluar dari dashboard.
export default function ForceLightTheme() {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme("light");
    return () => setTheme("system");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
