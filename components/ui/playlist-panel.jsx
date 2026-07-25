"use client";

import * as React from "react";
import { ImagePlus, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// PlaylistPanel -- kustomisasi buat halaman /preview-nowplaying, sengaja
// disederhanakan: cuma 2 tombol rapi (Upload Sampul & Upload Audio), tanpa
// daftar judul lagu yang ditampilkan. Lagu yang baru diupload otomatis jadi
// track aktif (lihat useLocalPlaylist -- auto-load track pertama begitu
// playlist keisi), jadi tetap langsung keputar & keliatan di card dalam HP
// tanpa perlu UI daftar putar di sini.
// ============================================================================
export function PlaylistPanel({ controller, className }) {
  const { currentIndex, fileInputRef, coverInputRef, handleFilesSelected, handleCoverSelected } = controller;

  function handleCoverEditClick() {
    if (currentIndex === -1) {
      alert("Tambahkan lagu terlebih dahulu sebelum mengganti sampul.");
      return;
    }
    coverInputRef.current?.click();
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <input ref={fileInputRef} type="file" accept="audio/*" multiple className="hidden" onChange={handleFilesSelected} />
      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelected} />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleCoverEditClick}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-base-line bg-base-elevated py-5 text-xs font-semibold text-ink transition-colors hover:bg-ink/5"
        >
          <ImagePlus size={20} />
          Upload Sampul
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-ink py-5 text-xs font-semibold text-base transition-opacity hover:opacity-90"
        >
          <Music2 size={20} />
          Upload Audio
        </button>
      </div>
    </div>
  );
}
