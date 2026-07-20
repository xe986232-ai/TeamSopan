"use client";

import { ToastProvider } from "@/components/ui/toast";
import JoinForm from "@/components/JoinForm";

export default function GabungPage() {
  return (
    <ToastProvider>
      {/*
        JoinForm mengatur seluruh alur pendaftaran secara bertahap:
        sapaan -> pertanyaan divisi -> pilih divisi -> form -> loading -> sukses.
        Setiap tahap tampil sebagai overlay full-screen (fixed inset-0, z-[6000])
        yang menutupi seluruh halaman. Navbar & footer situs sengaja tidak
        dirender di sini supaya halaman gabung benar-benar fokus satu alur saja.
      */}
      <JoinForm />
    </ToastProvider>
  );
}
