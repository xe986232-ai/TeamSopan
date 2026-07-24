"use client";

import { useRef, useState, useTransition } from "react";
import { UploadCloud, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { uploadTrendingVideo, removeTrendingVideo } from "./actions";

export default function TrendingSlotCard({ work }) {
  const fileInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [videoUrl, setVideoUrl] = useState(work.video_url || null);
  const [error, setError] = useState("");

  function handlePickFile() {
    setError("");
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    const formData = new FormData();
    formData.set("slot", work.slot);
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadTrendingVideo(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.videoUrl) {
        setVideoUrl(result.videoUrl);
      }
    });

    // biar bisa pilih file yang sama lagi kalau mau ganti ulang
    e.target.value = "";
  }

  function handleRemove() {
    setError("");
    startTransition(async () => {
      const result = await removeTrendingVideo(work.slot);
      if (result?.error) {
        setError(result.error);
      } else {
        setVideoUrl(null);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] overflow-hidden flex flex-col">
      {/* preview: gradient asli kartu tetap ditampilkan sebagai konteks slot mana ini */}
      <div
        className="relative aspect-[3/4] w-full flex items-center justify-center"
        style={{ background: work.gradient }}
      >
        {videoUrl ? (
          <video
            src={videoUrl}
            className="absolute inset-0 h-full w-full object-cover"
            controls
            muted
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20 text-white/90 text-center px-4">
            <UploadCloud size={22} />
            <p className="text-xs font-semibold">Belum ada video</p>
          </div>
        )}

        {videoUrl && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            <CheckCircle2 size={12} className="text-emerald-400" />
            Terupload
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div>
          <p className="font-body font-semibold text-sm text-[#111827] truncate">
            Slot {work.slot} · {work.title}
          </p>
          <p className="text-xs text-black/45">{work.subtitle}</p>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            onClick={handlePickFile}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#111827] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <UploadCloud size={13} />
            )}
            {videoUrl ? "Ganti video" : "Upload video"}
          </button>

          {videoUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isPending}
              aria-label={`Hapus video slot ${work.slot}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 text-black/40 hover:bg-[#FFE1E1] hover:text-[#B3261E] transition-colors disabled:opacity-50"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
