"use client";

import {
  DashboardSidebarProvider,
  useDashboardSidebar,
} from "./DashboardSidebarContext";
import DashboardSidebar from "./DashboardSidebar";

// Dipisah dari provider biar bisa baca state `open` dan ganti tampilan
// bungkusnya. Saat nav TERTUTUP: gak ada sisa warna biru / padding sama
// sekali, konten mengisi penuh layar (fix bug "ada sisa biru" di browser
// Android). Saat nav DIBUKA: baru muncul background biru + sidebar-nya.
function DashboardShellInner({ children, rightPanel }) {
  const { open } = useDashboardSidebar();

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        open ? "bg-[#1677F5] p-3 sm:p-5" : "bg-white p-0"
      }`}
    >
      <div
        className={`flex items-start transition-[gap] duration-300 ${
          open ? "gap-5" : "gap-0"
        }`}
      >
        <DashboardSidebar />

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