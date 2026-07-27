"use client";

import { useEffect, useState } from "react";
import { createPublicSupabaseClient } from "@/lib/supabase/client";

export default function Footer() {
  // Status buka/tutup pendaftaran member (opmem), diatur admin dari
  // /dashboard/pengaturan -> OpenMemberToggle (tabel site_settings, kolom
  // open_member). Default true biar tombol tetap aktif sambil nunggu data
  // ke-fetch / kalau gagal ambil. Lihat juga components/ui/site-navbar.jsx
  // yang pakai pola fetch client-side yang sama untuk tombol "Gabung".
  const [openMember, setOpenMember] = useState(true);

  useEffect(() => {
    let active = true;
    const supabase = createPublicSupabaseClient();

    supabase
      .from("site_settings")
      .select("open_member")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("[Footer] Gagal ambil site_settings:", error);
          return;
        }
        if (data && data.open_member !== null && data.open_member !== undefined) {
          setOpenMember(!!data.open_member);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <footer
      id="gabung"
      className="relative px-6 sm:px-10 py-20 border-t border-black/10 dark:border-white/10"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div>
          <h3 className="font-display font-extrabold text-3xl text-ink">Mau gabung?</h3>
          <p className="font-body font-normal text-ink-muted mt-3 max-w-sm">
            Kami selalu buka ruang buat orang yang serius mau berkarya di
            Remix, Creator, atau Leadis. Daftar sekarang dan ceritain karya kamu.
          </p>
          {openMember ? (
            <a
              href="/gabung"
              className="inline-block mt-6 px-6 py-3 rounded-full bg-ink-solid text-white dark:bg-white dark:text-ink-solid text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Daftar Sekarang
            </a>
          ) : (
            <span
              aria-disabled="true"
              title="Pendaftaran member sedang ditutup"
              className="inline-block mt-6 px-6 py-3 rounded-full bg-black/10 dark:bg-white/10 text-ink-muted text-sm font-medium cursor-not-allowed select-none"
            >
              Pendaftaran Ditutup
            </span>
          )}
        </div>

        <div className="flex gap-12">
          <div>
            <span className="font-body font-semibold text-xs tracking-[0.3em] uppercase text-ink-dim">
              Divisi
            </span>
            <ul className="font-body font-normal mt-4 space-y-2 text-ink-muted text-sm">
              <li>Remix</li>
              <li>Creator</li>
              <li>Leadis</li>
            </ul>
          </div>
          <div>
            <span className="font-body font-semibold text-xs tracking-[0.3em] uppercase text-ink-dim">
              Sosial
            </span>
            <ul className="font-body font-normal mt-4 space-y-2 text-ink-muted text-sm">
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
                  TikTok
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="font-body font-normal max-w-6xl mx-auto mt-16 text-xs text-ink-dim flex flex-wrap items-center gap-x-4 gap-y-2">
        <span>&copy; {new Date().getFullYear()} SOPAN TEAM. Semua hak dilindungi.</span>
        <a href="/privasi" className="hover:text-ink-muted transition-colors">
          Kebijakan Privasi
        </a>
        <a href="/ketentuan" className="hover:text-ink-muted transition-colors">
          Ketentuan Layanan
        </a>
      </p>
    </footer>
  );
}
