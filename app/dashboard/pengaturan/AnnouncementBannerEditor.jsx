"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Megaphone } from "lucide-react";
import AnnouncementBanner from "@/components/ui/announcement-banner";
import { updateAnnouncementBanner } from "./actions";

// Editor buat banner pengumuman yang muncul di atas navbar semua halaman
// publik (lihat components/ui/announcement-banner.jsx dan penggunaannya di
// components/ui/site-navbar.jsx). Teks, link, dan toggle aktif/nonaktif
// semuanya disimpan di tabel `site_settings` (kolom banner_*), bukan
// hardcode di kode -- jadi bisa diganti kapan saja dari sini tanpa deploy
// ulang.
export default function AnnouncementBannerEditor({
  currentEnabled,
  currentText,
  currentLink,
}) {
  const [enabled, setEnabled] = useState(currentEnabled);
  const [text, setText] = useState(currentText || "");
  const [link, setLink] = useState(currentLink || "");
  const [saved, setSaved] = useState({
    enabled: currentEnabled,
    text: currentText || "",
    link: currentLink || "",
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const hasChanges =
    enabled !== saved.enabled || text !== saved.text || link !== saved.link;

  function handleSave() {
    setError("");
    startTransition(async () => {
      const result = await updateAnnouncementBanner({ enabled, text, link });
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved({ enabled, text, link });
      }
    });
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] p-5 mb-4">
      <div className="flex items-center justify-between gap-4 mb-1">
        <div className="flex items-center gap-2">
          <Megaphone size={16} className="text-black/40" />
          <div>
            <p className="font-body font-semibold text-sm text-[#111827]">
              Banner Pengumuman
            </p>
            <p className="text-xs text-black/45 mt-0.5">
              Bar tipis di atas navbar pada semua halaman publik. Kosongkan
              teks kalau tidak dipakai.
            </p>
          </div>
        </div>

        {/* toggle aktif/nonaktif */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled((v) => !v)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
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

      <div className="flex flex-col gap-3 mt-4">
        <div>
          <label className="text-xs font-semibold text-black/50 mb-1.5 block">
            Teks pengumuman
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contoh: Pendaftaran gelombang baru dibuka sampai akhir bulan!"
            maxLength={140}
            className="w-full rounded-xl border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-sm text-black/80 outline-none focus:border-black/20"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 mb-1.5 block">
            Link tujuan (opsional)
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="/gabung atau https://..."
            className="w-full rounded-xl border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-sm text-black/80 outline-none focus:border-black/20"
          />
        </div>
      </div>

      {/* preview -- persis komponen yang dipakai di navbar publik */}
      {(text || "").trim() && (
        <div className="mt-4 rounded-xl overflow-hidden border border-black/[0.06]">
          <AnnouncementBanner enabled text={text} link={link} />
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isPending}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#111827] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 transition-opacity"
        >
          {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          Simpan pilihan
        </button>
        {!hasChanges && !isPending && (
          <span className="text-xs text-black/40">
            {saved.enabled ? "Banner sedang aktif" : "Banner sedang nonaktif"}
          </span>
        )}
      </div>
    </div>
  );
}
