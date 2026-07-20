"use client";

import * as React from "react";

const DashboardSidebarContext = React.createContext(null);

export function DashboardSidebarProvider({ children }) {
  // Default false biar konsisten pas SSR (server gak tau lebar layar).
  // Begitu mount di client, kalau layarnya desktop (>= lg breakpoint),
  // otomatis dibuka.
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setOpen(true);
    }
  }, []);

  const value = React.useMemo(
    () => ({ open, setOpen, toggle: () => setOpen((prev) => !prev) }),
    [open]
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
