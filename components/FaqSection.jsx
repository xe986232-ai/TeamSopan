"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// FAQ seputar SOPAN TEAM — edit teksnya langsung di sini kalau ada
// pertanyaan lain yang lebih sering ditanyain calon member.
const FAQ_ITEMS = [
  {
    id: "1",
    title: "Apa itu SOPAN TEAM?",
    content:
      "SOPAN TEAM adalah komunitas kreator dengan tiga divisi — Remix, Creator, dan Leadis. Tempat berkumpulnya kreator remix, video editor, dan kreator konten perempuan yang mau berkembang bareng.",
  },
  {
    id: "2",
    title: "Gimana cara gabung jadi member?",
    content:
      "Tinggal klik tombol \"Gabung\" di navbar, isi form pendaftaran, pilih divisi yang paling cocok sama minat kamu, terus tunggu konfirmasi dari admin divisi terkait.",
  },
  {
    id: "3",
    title: "Divisi mana yang paling cocok buat aku?",
    content:
      "Suka ngulik remix atau DJ set? Gabung Remix. Jago ngedit video/motion graphic? Gabung Creator. Kreator konten perempuan yang mau kolaborasi bareng? Gabung Leadis.",
  },
  {
    id: "4",
    title: "Apakah ada syarat khusus buat bergabung?",
    content:
      "Nggak ada syarat teknis yang ribet — yang penting mau belajar, aktif, dan sopan ke sesama member. Detail lengkapnya bisa dibaca di halaman Ketentuan Layanan.",
  },
];

export default function FaqSection() {
  // Default item pertama kebuka, sama kayak contoh "defaultValue" di kode asli.
  const [openId, setOpenId] = useState(FAQ_ITEMS[0].id);

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section id="faq" className="relative py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto px-6 sm:px-10 mb-10 text-center"
      >
        <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
          FAQ
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 text-ink">
          Pertanyaan yang sering ditanyain
        </h2>
        <p className="mt-3 text-ink-muted">
          Belum nemu jawabannya? Chat langsung admin divisi lewat bagian
          &ldquo;Meet The Team&rdquo;.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto px-6 sm:px-10 space-y-3"
      >
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display font-semibold text-sm sm:text-base text-ink">
                  {item.title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-ink-muted leading-relaxed">
                      {item.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
