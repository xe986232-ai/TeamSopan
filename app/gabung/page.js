"use client";

import { SiteNavbar } from "@/components/ui/site-navbar";
import { ToastProvider } from "@/components/ui/toast";
import JoinForm from "@/components/JoinForm";
import Footer from "@/components/Footer";

export default function GabungPage() {
  return (
    <ToastProvider>
      <main className="relative bg-base">
        <SiteNavbar
          navItems={[
            { name: "Tentang", link: "/#tentang" },
            { name: "Divisi", link: "/#divisi" },
          ]}
          mobileGroups={[
            {
              label: "Menu",
              items: [
                { name: "Beranda", link: "/" },
                { name: "Tentang", link: "/#tentang" },
                { name: "Divisi", link: "/#divisi" },
              ],
            },
          ]}
        />

        {/*
          JoinForm mengatur seluruh alur pendaftaran secara bertahap:
          sapaan -> pertanyaan divisi -> pilih divisi -> form -> loading -> sukses.
          Setiap tahap tampil sebagai overlay full-screen (fixed inset-0) di atas
          navbar & footer di bawah ini.
        */}
        <JoinForm />

        <Footer />
      </main>
    </ToastProvider>
  );
}
