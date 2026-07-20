"use client";

import { DashboardSidebarProvider } from "./DashboardSidebarContext";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardShell({ children, rightPanel }) {
  return (
    <DashboardSidebarProvider>
      <div className="min-h-screen bg-[#1677F5] p-3 sm:p-5 overflow-x-hidden">
        <div className="flex gap-5 items-start">
          <DashboardSidebar />

          {/* min-w-0 penting: tanpa ini, flex child gak mau menyusut pas
              sidebar dibuka, jadi kesannya "ketutup" bukan "kegeser". */}
          <main className="flex-1 min-w-0 rounded-[28px] bg-white shadow-2xl p-6 sm:p-8 min-h-[calc(100vh-2.5rem)]">
            {children}
          </main>

          {rightPanel}
        </div>
      </div>
    </DashboardSidebarProvider>
  );
}
