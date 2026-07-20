"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, Check, ArrowRight } from "lucide-react";
import { SiteNavbar } from "@/components/ui/site-navbar";
import { Button } from "@/components/ui/button";
import { DIVISIONS_ABSENSI, generateRoomId } from "@/lib/absensi";

// Halaman ini SEMENTARA — cuma buat generate & coba link absensi acak
// sebelum dashboard admin (buat divisi & kelola sesi) beneran dibuat.
// Nanti halaman ini bisa diganti/dipindah jadi bagian dari dashboard admin.

export default function AbsensiGeneratorPage() {
  const [generated, setGenerated] = React.useState(null); // { divisionId, roomId }
  const [copied, setCopied] = React.useState(false);

  const handleGenerate = (divisionId) => {
    setGenerated({ divisionId, roomId: generateRoomId(divisionId) });
    setCopied(false);
  };

  const link = generated
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/absensi/${generated.roomId}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard gak tersedia — gapapa, user bisa select manual.
    }
  };

  return (
    <main className="relative bg-base min-h-screen">
      <SiteNavbar
        navItems={[{ name: "Beranda", link: "/" }]}
        mobileGroups={[{ label: "Menu", items: [{ name: "Beranda", link: "/" }] }]}
      />

      <section className="relative px-6 sm:px-10 py-20 sm:py-28 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-body font-semibold text-xs tracking-[0.3em] uppercase text-ink-muted">
            Sementara — Belum Dashboard Admin
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 text-ink">
            Generate Link Absensi
          </h1>
          <p className="text-sm text-ink-muted mt-3 max-w-md mx-auto">
            Pilih divisi buat generate link absensi acak, lalu share ke
            anggota divisi tersebut. Nanti bagian ini jadi bagian dari
            dashboard admin buat bikin & kelola sesi absensi sungguhan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10"
        >
          {Object.values(DIVISIONS_ABSENSI).map((division) => (
            <button
              key={division.id}
              type="button"
              onClick={() => handleGenerate(division.id)}
              className="rounded-2xl border border-black/10 dark:border-white/10 p-5 text-left hover:border-black/20 dark:hover:border-white/20 transition-colors"
              style={{
                background:
                  generated?.divisionId === division.id
                    ? `linear-gradient(135deg, ${division.accentFrom}22, ${division.accentTo}22)`
                    : undefined,
              }}
            >
              <span
                className="inline-block h-3 w-3 rounded-full mb-2"
                style={{
                  background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
                }}
              />
              <p className="font-display font-bold text-ink">{division.name}</p>
              <p className="text-xs text-ink-muted mt-1">Buat link absensi</p>
            </button>
          ))}
        </motion.div>

        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 rounded-2xl border border-black/10 dark:border-white/10 bg-base-elevated p-5 text-left"
          >
            <p className="text-xs text-ink-muted mb-2">
              Link absensi divisi{" "}
              <span className="font-semibold text-ink">
                {DIVISIONS_ABSENSI[generated.divisionId].name}
              </span>{" "}
              — share ke anggota:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2.5 text-xs text-ink">
                {link}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy link"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors text-ink"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <Link href={`/absensi/${generated.roomId}`} className="block mt-4">
              <Button className="w-full h-11 rounded-full gap-2">
                Buka Room Absensi <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        )}
      </section>
    </main>
  );
}
