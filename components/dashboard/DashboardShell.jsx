"use client";

import { motion } from "framer-motion";
import {
  DashboardSidebarProvider,
  useDashboardSidebar,
} from "./DashboardSidebarContext";
import DashboardSidebar, { SIDEBAR_WIDTH } from "./DashboardSidebar";
import DashboardScrollDivider from "./DashboardScrollDivider";

const SMOOTH_EASE = [0.22, 1, 0.36, 1];
// Celah antara sidebar overlay & layer konten di mobile (di dalamnya
// nyempil DashboardScrollDivider selebar 3px).
const MOBILE_GAP = 14;

// Dua mode layout, dipilih lewat `isDesktop` dari context:
//
// - Desktop: sidebar ikut alur flexbox biasa (lebar dianimasikan 0 <->
//   SIDEBAR_WIDTH), `main` jadi flex-1 yang otomatis nyesuain sisa ruang.
//   Ini perilaku lama — aman dipakai karena di layar lebar ruangnya
//   berlimpah, gak masalah kalau lebar `main` berubah.
//
// - Mobile/tablet: sidebar jadi layer overlay dengan lebar KONSTAN
//   (gak pernah dianimasikan), diam di belakang. Yang gerak cuma layer
//   konten (background putih) lewat `transform: translateX`, bukan resize
//   lebar. Jadi konten gak pernah reflow/"menyempit" — cuma "kegeser"
//   nampilin sidebar di baliknya, sama kayak referensi.
function DashboardShellInner({ children, rightPanel }) {
  const { open, isDesktop } = useDashboardSidebar();

  if (!isDesktop) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-[#1677F5]">
        <DashboardSidebar mode="overlay" />

        <motion.div
          initial={false}
          animate={{ x: open ? SIDEBAR_WIDTH + MOBILE_GAP : 0 }}
          transition={{ duration: 0.38, ease: SMOOTH_EASE }}
          className="relative min-h-screen w-full bg-white"
        >
          {/* Bar pemisah nempel di tepi kiri layer konten. Cuma keliatan
              pas konten ke-translate ke kanan, karena sebelum itu ketutup
              sama layer konten sendiri. */}
          {open && (
            <div
              aria-hidden
              className="absolute inset-y-0"
              style={{ left: -MOBILE_GAP }}
            >
              <DashboardScrollDivider />
            </div>
          )}

          <main
            className={`min-h-[calc(100vh-2.5rem)] transition-all duration-300 ${
              open
                ? "rounded-l-[28px] shadow-2xl p-6 sm:p-8"
                : "rounded-none shadow-none p-4 sm:p-6"
            }`}
          >
            {children}
          </main>

          {rightPanel}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        open ? "bg-[#1677F5] p-3 sm:p-5" : "bg-white p-0"
      }`}
    >
      <div
        className={`flex items-start transition-[gap] duration-300 ${
          open ? "gap-3" : "gap-0"
        }`}
      >
        <DashboardSidebar />

        {/* Pemisah bar hitam tipis — cuma ada selama sidebar dibuka,
            karena cuma di situ ada celah antara background nav & konten. */}
        {open && <DashboardScrollDivider />}

        {/* min-w-0 penting: tanpa ini, flex child gak mau menyusut pas
            sidebar dibuka, jadi kesannya "ketutup" bukan "kegeser". */}
        <main
          className={`flex-1 min-w-0 bg-white min-h-[calc(100vh-2.5rem)] transition-all duration-300 ${
            open
              ? "rounded-[28px] shadow-2xl p-6 sm:p-8"
              : "rounded-none shadow-none p-4 sm:p-6"
          }`}
        >
          {children}
        </main>

        {open && rightPanel}
      </div>
    </div>
  );
}

export default function DashboardShell({ children, rightPanel }) {
  return (
    <DashboardSidebarProvider>
      <DashboardShellInner rightPanel={rightPanel}>
        {children}
      </DashboardShellInner>
    </DashboardSidebarProvider>
  );
}
