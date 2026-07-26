"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// TrackMetaPanel -- input teks judul lagu (override nama file) & artist
// (handle @) yang tampil di card musik dalam mockup HP. State-nya
// dikontrol dari luar (TiktokPreviewScene) lewat props, sama pola-nya
// kayak CardStylePanel/PlaylistPanel.
//
// CATATAN: field "Nama device" (khusus generate project Alight Motion .xml)
// sudah dihapus bareng fitur ekspor/engine Remotion.
// ============================================================================
export function TrackMetaPanel({ title, onTitleChange, artist, onArtistChange, className }) {
  return (
    <div className={cn("w-full max-w-[280px] rounded-2xl border border-base-line bg-base-elevated p-4", className)}>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/60">Info Lagu</h3>

      <div className="mb-3">
        <label className="mb-1 block text-xs text-ink/70" htmlFor="am-title">
          Judul lagu
        </label>
        <input
          id="am-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Judul lagu"
          className="w-full rounded-lg border border-base-line bg-base px-3 py-2 text-sm text-ink outline-none focus:border-ink/40"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-ink/70" htmlFor="am-artist">
          Artist
        </label>
        <input
          id="am-artist"
          type="text"
          value={artist}
          onChange={(e) => onArtistChange(e.target.value)}
          placeholder="@artist"
          className="w-full rounded-lg border border-base-line bg-base px-3 py-2 text-sm text-ink outline-none focus:border-ink/40"
        />
      </div>
    </div>
  );
}
