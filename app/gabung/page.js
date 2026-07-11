"use client";

import { ToastProvider } from "@/components/ui/toast";
import JoinForm from "@/components/JoinForm";

export default function GabungPage() {
  return (
    <ToastProvider>
      {/*
        JoinForm mengatur seluruh alur pendaftaran secara bertahap:
        sapaan -> pertanyaan divisi -> pilih divisi -> form -> loading -> sukses.
        Komponennya full-screen (fixed inset-0) di SEMUA tahap, jadi halaman ini
        gak perlu navbar/footer terpisah -- semuanya ketutup overlay selama
        proses pendaftaran berlangsung.
      */}
      <main className="relative bg-black min-h-screen">
        <JoinForm />
      </main>
    </ToastProvider>
  );
}
