"use client";

import { Suspense } from "react";
import { ToastProvider } from "@/components/ui/toast";
import MasukContent from "./MasukContent";

export default function MasukPage() {
  return (
    <ToastProvider>
      {/*
        Fixed inset-0 + z-[6000]: overlay full-screen yang menutupi seluruh
        halaman termasuk navbar (z-[5000]), sama seperti halaman /gabung —
        supaya fokus sepenuhnya ke form login tanpa distraksi elemen lain.
      */}
      <div
        data-lenis-prevent
        className="fixed inset-0 z-[6000] flex items-center justify-center overflow-y-auto bg-base"
      >
        <div
          className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "#B026FF" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "#FFD166" }}
        />

        <div className="relative z-10 w-full px-6 sm:px-10 py-24">
          <Suspense fallback={null}>
            <MasukContent />
          </Suspense>
        </div>
      </div>
    </ToastProvider>
  );
}
