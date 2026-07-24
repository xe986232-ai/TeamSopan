"use client";

import { useRef, useState, useTransition } from "react";
import { UploadCloud, Loader2, Trash2, CheckCircle2, Pencil, Check, X } from "lucide-react";
import { uploadTrendingVideo, removeTrendingVideo, updateTrendingInfo } from "./actions";

export default function TrendingSlotCard({ work }) {
  const fileInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [videoUrl, setVideoUrl] = useState(work.video_url || null);
  const [error, setError] = useState("");

  // state buat judul & text di bawah judul (subtitle)
  const [title, setTitle] = useState(work.title);
  const [subtitle, setSubtitle] = useState(work.subtitle || "");
  const [isEditing, setIsEditing] = useState(false);
  const [infoError, setInfoError] = useState("");

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

  function handleSaveInfo() {
    setInfoError("");

    if (!title.trim()) {
      setInfoError("Judul tidak boleh kosong.");
      return;
    }

    const formData = new FormData();
    formData.set("slot", work.slot);
    formData.set("title", title);
    formData.set("subtitle", subtitle);

    startTransition(async () => {
      const result = await updateTrendingInfo(formData);
      if (result?.error) {
        setInfoError(result.error);
      } else {
        setIsEditing(false);
      }
    });
  }

  function handleCancelEdit() {
    setTitle(work.title);
    setSubtitle(work.subtitle || "");
    setInfoError("");
    setIsEditing(false);
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
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-[11px] font-semibold text-black/50">
                Judul (Slot {work.slot})
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm font-display font-bold text-[#111827] outline-none focus:border-black/30"
                placeholder="misal: Cinematic Transition Pack"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-black/50">
                Text di bawah judul
              </label>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-xs text-[#111827] outline-none focus:border-black/30"
                placeholder="misal: Alight Motion Edit"
              />
            </div>

            {infoError && <p className="text-xs text-red-500">{infoError}</p>}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveInfo}
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#111827] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                {isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                Simpan
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isPending}
                className="flex items-center gap-1 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-semibold text-black/60 disabled:opacity-50"
              >
                <X size={12} />
                Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-body font-semibold text-sm text-[#111827] truncate">
                Slot {work.slot} · {title}
              </p>
              <p className="text-xs text-black/45 truncate">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit judul & text slot ${work.slot}`}
              className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black/70 transition-colors"
            >
              <Pencil size={13} />
            </button>
          </div>
        )}

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
