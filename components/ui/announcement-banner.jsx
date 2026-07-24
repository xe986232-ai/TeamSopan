"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Bar pengumuman di atas navbar (dipanggil dari components/ui/site-navbar.jsx,
// tampil di semua halaman publik). Ini gantiin AnnouncementBar lama yang
// dulu teksnya hardcode di app/page.js dan cuma muncul di homepage --
// sekarang kontennya (teks, link, aktif/nonaktif) 100% dari database
// (tabel site_settings, kolom banner_enabled/banner_text/banner_link),
// diatur admin dari app/dashboard/pengaturan -- lihat
// AnnouncementBannerEditor.jsx. Gaya visual (bg sky-300, tombol tutup)
// sengaja disamain dengan desain AnnouncementBar lama biar konsisten.
//
// Tombol tutup cuma nyembunyiin di sesi/halaman saat itu (state lokal,
// bukan disimpan) -- reload halaman atau pindah halaman lain akan
// nampilin lagi banner-nya selama masih aktif di database.
export default function AnnouncementBanner({ enabled, text, link }) {
  const [dismissed, setDismissed] = useState(false);
  const trimmedText = (text || "").trim();

  // Reset "ditutup" tiap kali teks/status banner berubah (misal admin
  // ganti pengumuman dari dashboard) supaya pengumuman baru tetap
  // kelihatan walau yang lama sempat ditutup pengunjung.
  useEffect(() => {
    setDismissed(false);
  }, [enabled, trimmedText, link]);

  const shouldShow = enabled && !!trimmedText && !dismissed;
  const isExternal = /^https?:\/\//i.test(link || "");

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative overflow-hidden bg-sky-300"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 px-10 py-2.5 text-center">
            {link ? (
              <a
                href={link}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-xs sm:text-sm font-medium text-black/90 hover:underline underline-offset-2"
              >
                {trimmedText}
              </a>
            ) : (
              <span className="text-xs sm:text-sm font-medium text-black/90">
                {trimmedText}
              </span>
            )}
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Tutup pengumuman"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 hover:text-black transition-colors text-sm"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
