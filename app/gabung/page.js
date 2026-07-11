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
          JoinForm sekarang mengatur seluruh alur pendaftaran secara bertahap:
          sapaan -> pertanyaan divisi -> pilih divisi -> form -> loading -> sukses.
          Tahap sapaan/pertanyaan/loading/sukses tampil full-screen (fixed),
          jadi section ini cukup jadi wadah untuk tahap pilih-divisi & form.
        */}
        <section className="relative overflow-hidden px-6 sm:px-10 pt-28 pb-20 sm:pt-32 sm:pb-28">
          <JoinForm />
        </section>

        <Footer />
      </main>
    </ToastProvider>
  );
}
