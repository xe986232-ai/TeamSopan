"use client";

import { motion } from "framer-motion";
import { ToastProvider } from "@/components/ui/toast";
import LoginForm from "@/components/LoginForm";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function MasukPage() {
  return (
    <ToastProvider>
      {/*
        Fixed inset-0 + z-[6000]: overlay full-screen yang menutupi seluruh
        halaman termasuk navbar (z-[5000]), sama seperti halaman /gabung —
        supaya fokus sepenuhnya ke form login tanpa distraksi elemen lain.
      */}
      <div className="fixed inset-0 z-[6000] flex items-center justify-center overflow-y-auto bg-base">
        <div
          className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "#B026FF" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "#FFD166" }}
        />

        <div className="relative z-10 w-full px-6 sm:px-10 py-24">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="relative max-w-xl mx-auto text-center mb-12"
          >
            <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
              Masuk
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl mt-4 text-ink leading-tight">
              Masuk ke SOPAN TEAM
            </h1>
            <p className="font-body font-normal text-base text-ink-muted mt-4">
              Masukkan username dan password kamu untuk lanjut ke akun.
            </p>
          </motion.div>

          <LoginForm />
        </div>
      </div>
    </ToastProvider>
  );
}
