"use client";

import * as React from "react";
import { Plus, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// PlaylistPanel -- semua kustomisasi (upload lagu, ganti sampul, hapus lagu)
// sengaja dipisah dari MusicPlayerCard dan dipasang DI LUAR mockup HP.
// Card di dalam HP cuma nampilin hasilnya doang; upload & kelola lagunya
// dari sini.
// ============================================================================
export function PlaylistPanel({ controller, className }) {
  const { playlist, currentIndex, fileInputRef, coverInputRef, handleFilesSelected, handleCoverSelected, removeTrack, loadTrack } =
    controller;

  function handleCoverEditClick() {
    if (currentIndex === -1) {
      alert("Tambahkan dan pilih lagu terlebih dahulu sebelum mengganti sampul.");
      return;
    }
    coverInputRef.current?.click();
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/60">Daftar Putar</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCoverEditClick}
            className="inline-flex items-center gap-1.5 rounded-full border border-base-line bg-base-elevated px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            <ImagePlus size={14} />
            Ganti Sampul
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-base transition-opacity hover:opacity-90"
          >
            <Plus size={14} />
            Tambah Lagu
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="audio/*" multiple className="hidden" onChange={handleFilesSelected} />
      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelected} />

      <div className="max-h-56 overflow-y-auto rounded-2xl border border-base-line bg-ink/[0.03]">
        {playlist.length === 0 ? (
          <div className="p-6 text-center text-xs text-ink/50">
            Belum ada lagu. Klik &quot;Tambah Lagu&quot; untuk mengunggah file musik.
          </div>
        ) : (
          playlist.map((track, i) => (
            <div
              key={track.id}
              onClick={() => loadTrack(i, true)}
              className={cn(
                "flex cursor-pointer items-center gap-3 border-b border-base-line px-4 py-2.5 transition-colors last:border-b-0",
                i === currentIndex ? "bg-ink/10" : "hover:bg-ink/5"
              )}
            >
              <span className={cn("w-5 shrink-0 text-center text-xs", i === currentIndex ? "text-ink" : "text-ink/50")}>{i + 1}</span>
              <span className={cn("min-w-0 flex-1 truncate text-sm text-ink", i === currentIndex && "font-semibold")}>{track.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTrack(i);
                }}
                title="Hapus"
                className="shrink-0 p-1 text-ink/40 transition-colors hover:text-red-500"
              >
                <X size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
