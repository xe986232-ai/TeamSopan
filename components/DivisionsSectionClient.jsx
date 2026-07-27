"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "./ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// `divisions` datang dari DivisionsSection (server component) yang sudah
// ngambil member aktif per divisi dari Supabase, acak urutannya, dan pilih
// 3 buat ditampilkan di sini -- jadi tiap refresh halaman, avatar yang
// muncul bisa gantian (semua member kebagian tampil, bukan cuma 3 orang
// yang sama terus).
export default function DivisionsSectionClient({ divisions }) {
  const [alertDivision, setAlertDivision] = useState(null);

  return (
    <section id="divisi" className="relative px-6 sm:px-10 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="max-w-2xl mx-auto mb-4 text-center"
        >
          <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
            Tiga Divisi
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-4 text-ink leading-tight">
            Satu tim, tiga cara berkarya
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {divisions.map((division, i) => (
            <motion.div
              key={division.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="w-full max-w-xs mx-auto shadow-none overflow-hidden rounded-[24px] border border-black/5 dark:border-white/10 bg-base-elevated p-1">
                {/* Soft pastel inset block — sits inside the white card with a visible margin */}
                <div
                  className="rounded-[18px] p-5 pb-6"
                  style={{ backgroundColor: division.soft }}
                >
                  <span className="font-body font-medium text-[11px] tracking-wide text-black/50">
                    {division.eyebrow}
                  </span>
                  <CardTitle className="font-display font-extrabold text-2xl leading-tight text-ink-solid mt-1">
                    {division.name}
                  </CardTitle>
                  <CardDescription className="font-body font-normal text-sm mt-2 text-black/60 leading-relaxed">
                    {division.description}
                  </CardDescription>
                </div>

                {/* White bottom block */}
                <CardContent className="px-4 pt-4 pb-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AnimatedTooltip items={division.members} />
                      {division.extraCount ? (
                        <div className="group relative -mr-4 z-0">
                          <div className="relative !m-0 h-10 w-10 rounded-full border-2 border-white bg-ink-solid flex items-center justify-center !p-0">
                            <span className="text-white text-[10px] font-bold leading-none">
                              {division.extraCount}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <span className="text-[11px] text-ink-dim">
                      {division.totalActive} member aktif
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="px-4 pt-3 pb-2 flex-col items-stretch gap-2">
                  <Button
                    className="w-full h-11 rounded-full"
                    onClick={() => setAlertDivision(division)}
                  >
                    Lihat Divisi
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full h-11 rounded-full"
                    onClick={() => setAlertDivision(division)}
                  >
                    Lihat Anggota
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ---- Alert: fitur masih dalam pengembangan ---- */}
      <AnimatePresence>
        {alertDivision && (
          <motion.div
            key="dev-alert-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
            onClick={() => setAlertDivision(null)}
          >
            <motion.div
              key="dev-alert-card"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-[24px] border border-black/5 dark:border-white/10 bg-base-elevated shadow-2xl shadow-black/20 p-6 text-center"
            >
              <button
                onClick={() => setAlertDivision(null)}
                aria-label="Tutup"
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors text-ink-muted"
              >
                <X size={15} />
              </button>

              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white p-3 shadow-md"
                style={{
                  boxShadow: `0 10px 30px -8px ${alertDivision.accentSolidTo}80`,
                }}
              >
                <Image
                  src="/sopan-logo-black.png"
                  alt="SOPAN TEAM"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>

              <h3 className="font-display font-extrabold text-lg text-ink leading-tight">
                Website Dalam Pengembangan
              </h3>
              <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                Halaman divisi {alertDivision.name} masih kami siapkan. Balik
                lagi ya, bakal segera rilis!
              </p>

              <Button
                className="w-full h-11 rounded-full mt-5"
                onClick={() => setAlertDivision(null)}
              >
                Oke, Mengerti
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
