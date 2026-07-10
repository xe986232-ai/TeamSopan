"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function AboutSection() {
  return (
    <section id="tentang" className="relative px-6 sm:px-10 py-28 sm:py-36">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-12 md:gap-20 items-start">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
            Tentang Kami
          </span>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="space-y-6"
        >
          <p className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl leading-snug text-ink">
            SOPAN TEAM lahir dari satu keyakinan sederhana: karya yang bagus
            nggak harus lahir dari satu skill aja.
          </p>
          <p className="font-body font-normal text-ink-muted text-lg leading-relaxed">
            SOPAN TEAM adalah wadah buat kamu yang jago meremix suara, jago
            menyulap footage jadi cerita lewat editing, atau jago tampil di
            depan kamera. Tiga divisi, satu komunitas — tempat kreator saling
            kenal, berkembang bareng, dan dukung karya satu sama lain.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
