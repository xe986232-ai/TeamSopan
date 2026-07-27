"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, UserPlus } from "lucide-react";
import { updateOpenMember } from "./actions";

// Switch "Buka Pendaftaran Member" (opmem) yang ngontrol tombol "Gabung"
// di navbar & footer homepage (lihat components/ui/site-navbar.jsx &
// components/Footer.jsx). Disimpan di tabel `site_settings`, kolom
// `open_member` -- lihat supabase/migration_open_member.sql.
//
// Kalau dimatikan: kedua tombol "Gabung" otomatis jadi nonaktif
// ("Pendaftaran Ditutup") di semua halaman publik, tanpa deploy ulang.
export default function OpenMemberToggle({ currentEnabled }) {
  const [enabled, setEnabled] = useState(currentEnabled);
  const [saved, setSaved] = useState(currentEnabled);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !enabled;
    setEnabled(next);
    setError("");
    startTransition(async () => {
      const result = await updateOpenMember(next);
      if (result?.error) {
        setError(result.error);
        setEnabled(!next); // rollback kalau gagal simpan
      } else {
        setSaved(next);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] p-5 mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <UserPlus size={16} className="text-black/40" />
          <div>
            <p className="font-body font-semibold text-sm text-[#111827]">
              Buka Pendaftaran Member
            </p>
            <p className="text-xs text-black/45 mt-0.5 max-w-sm">
              Kontrol tombol "Gabung" di navbar & footer situs. Kalau
              dimatikan, kedua tombol otomatis jadi nonaktif dan menampilkan
              "Pendaftaran Ditutup" di semua halaman publik.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Buka Pendaftaran Member"
          onClick={handleToggle}
          disabled={isPending}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
            enabled ? "bg-[#1677F5]" : "bg-black/10"
          }`}
        >
          <span
            className={`absolute h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-all ${
              enabled ? "left-[22px]" : "left-1"
            }`}
          />
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

      <div className="flex items-center gap-1.5 mt-4">
        {isPending ? (
          <Loader2 size={13} className="animate-spin text-black/40" />
        ) : (
          <Check size={13} className="text-emerald-500" />
        )}
        <span className="text-xs text-black/40">
          {isPending
            ? "Menyimpan..."
            : saved
            ? "Pendaftaran sedang dibuka"
            : "Pendaftaran sedang ditutup"}
        </span>
      </div>
    </div>
  );
}
