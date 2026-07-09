"use client";

import { motion } from "framer-motion";
import { SiteNavbar } from "@/components/ui/site-navbar";
import { ToastProvider } from "@/components/ui/toast";
import JoinForm from "@/components/JoinForm";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

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

        <section className="relative overflow-hidden px-6 sm:px-10 pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div
            className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full blur-3xl opacity-30"
            style={{ background: "#B026FF" }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full blur-3xl opacity-30"
            style={{ background: "#FFD166" }}
          />

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="relative max-w-xl mx-auto text-center mb-12"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-ink-muted">
              Pendaftaran
            </span>
            <h1 className="font-display text-4xl sm:text-5xl mt-4 text-ink leading-tight">
              Gabung ke SOPAN TEAM
            </h1>
            <p className="font-body text-base text-ink-muted mt-4">
              Isi data diri kamu dan pilih divisi yang paling cocok. Tim kami
              bakal follow up lewat email yang kamu daftarkan.
            </p>
          </motion.div>

          <JoinForm />
        </section>

        <Footer />
      </main>
    </ToastProvider>
  );
}
