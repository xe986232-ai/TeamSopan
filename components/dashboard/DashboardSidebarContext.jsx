"use client";

import * as React from "react";

const DashboardSidebarContext = React.createContext(null);

export function DashboardSidebarProvider({ children }) {
  // Default false biar konsisten pas SSR (server gak tau lebar layar).
  // Begitu mount di client, kalau layarnya desktop (>= lg breakpoint),
  // otomatis dibuka.
  const [open, setOpen] = React.useState(false);

  // isDesktop dipakai DashboardShell buat milih mode layout:
  // - Desktop: sidebar ikut alur flex (lebar berubah, konten menyesuaikan
  //   sisa ruang) — di layar lebar ini gak masalah karena ruang berlimpah.
  // - Mobile/tablet: sidebar jadi overlay tetap (lebar konstan, gak pernah
  //   resize), konten cuma di-translate ke kanan. Jadi konten gak pernah
  //   "menyempit"/reflow, cuma "kegeser".
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(min-width: 1024px)");

    const sync = () => {
      setIsDesktop(mql.matches);
      setOpen(mql.matches);
    };

    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((prev) => !prev),
      isDesktop,
    }),
    [open, isDesktop]
  );

  return (
    <DashboardSidebarContext.Provider value={value}>
      {children}
    </DashboardSidebarContext.Provider>
  );
}

export function useDashboardSidebar() {
  const ctx = React.useContext(DashboardSidebarContext);
  if (!ctx) {
    throw new Error(
      "useDashboardSidebar harus dipakai di dalam <DashboardSidebarProvider>"
    );
  }
  return ctx;
}
