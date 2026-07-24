"use client";

import { useRef, useState, useTransition } from "react";
import { ImageUp, Music, Loader2, Trash2, CheckCircle2, Pencil, Check, X } from "lucide-react";
import {
  uploadSoundCover,
  uploadSoundAudio,
  updateSoundInfo,
  removeSoundCover,
  removeSoundAudio,
} from "./actions";

export default function TrendingSoundSlotCard({ sound }) {
  const coverInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  const [coverUrl, setCoverUrl] = useState(sound.cover_url || null);
  const [audioUrl, setAudioUrl] = useState(sound.audio_url || null);
  const [coverError, setCoverError] = useState("");
  const [audioError, setAudioError] = useState("");

  // state buat judul (text atas) & nama kreator (text bawah)
  const [title, setTitle] = useState(sound.title);
  const [creator, setCreator] = useState(sound.creator || "");
  const [isEditing, setIsEditing] = useState(false);
  const [infoError, setInfoError] = useState("");

  function handlePickCover() {
    setCoverError("");
    coverInputRef.current?.click();
  }

  function handlePickAudio() {
    setAudioError("");
    audioInputRef.current?.click();
  }

  function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverError("");
    const formData = new FormData();
    formData.set("slot", sound.slot);
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadSoundCover(formData);
      if (result?.error) {
        setCoverError(result.error);
      } else if (result?.coverUrl) {
        setCoverUrl(result.coverUrl);
      }
    });

    e.target.value = "";
  }

  function handleAudioChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioError("");
    const formData = new FormData();
    formData.set("slot", sound.slot);
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadSoundAudio(formData);
      if (result?.error) {
        setAudioError(result.error);
      } else if (result?.audioUrl) {
        setAudioUrl(result.audioUrl);
      }
    });

    e.target.value = "";
  }

  function handleRemoveCover() {
    setCoverError("");
    startTransition(async () => {
      const result = await removeSoundCover(sound.slot);
      if (result?.error) {
        setCoverError(result.error);
      } else {
        setCoverUrl(null);
      }
    });
  }

  function handleRemoveAudio() {
    setAudioError("");
    startTransition(async () => {
      const result = await removeSoundAudio(sound.slot);
      if (result?.error) {
        setAudioError(result.error);
      } else {
        setAudioUrl(null);
      }
    });
  }

  function handleSaveInfo() {
    setInfoError("");

    if (!title.trim()) {
      setInfoError("Judul (text atas) tidak boleh kosong.");
      return;
    }

    const formData = new FormData();
    formData.set("slot", sound.slot);
    formData.set("title", title);
    formData.set("creator", creator);

    startTransition(async () => {
      const result = await updateSoundInfo(formData);
      if (result?.error) {
        setInfoError(result.error);
      } else {
        setIsEditing(false);
      }
    });
  }

  function handleCancelEdit() {
    setTitle(sound.title);
    setCreator(sound.creator || "");
    setInfoError("");
    setIsEditing(false);
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] overflow-hidden flex flex-col">
      {/* preview cover */}
      <div
        className="relative aspect-[3/4] w-full flex items-center justify-center"
        style={{ background: sound.panel_color || "#111827" }}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Cover slot ${sound.slot}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20 text-white/90 text-center px-4">
            <ImageUp size={22} />
            <p className="text-xs font-semibold">Belum ada cover</p>
          </div>
        )}

        {coverUrl && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            <CheckCircle2 size={12} className="text-emerald-400" />
            Cover terupload
          </span>
        )}

        {audioUrl && (
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            <Music size={12} className="text-emerald-400" />
            Audio ada
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-[11px] font-semibold text-black/50">
                Text atas / judul (Slot {sound.slot})
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm font-display font-bold text-[#111827] outline-none focus:border-black/30"
                placeholder="misal: Shiver"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-black/50">
                Text bawah / nama kreator
              </label>
              <input
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-xs text-[#111827] outline-none focus:border-black/30"
                placeholder="misal: John Summit & Hayla"
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
                Slot {sound.slot} · {title}
              </p>
              <p className="text-xs text-black/45 truncate">{creator}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit judul & kreator slot ${sound.slot}`}
              className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black/70 transition-colors"
            >
              <Pencil size={13} />
            </button>
          </div>
        )}

        {/* upload cover */}
        {coverError && <p className="text-xs text-red-500">{coverError}</p>}
        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            onClick={handlePickCover}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#111827] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <ImageUp size={13} />}
            {coverUrl ? "Ganti cover" : "Upload cover"}
          </button>
          {coverUrl && (
            <button
              type="button"
              onClick={handleRemoveCover}
              disabled={isPending}
              aria-label={`Hapus cover slot ${sound.slot}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 text-black/40 hover:bg-[#FFE1E1] hover:text-[#B3261E] transition-colors disabled:opacity-50"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />

        {/* upload audio */}
        {audioError && <p className="text-xs text-red-500">{audioError}</p>}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePickAudio}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold text-[#111827] disabled:opacity-50"
          >
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Music size={13} />}
            {audioUrl ? "Ganti audio" : "Upload audio"}
          </button>
          {audioUrl && (
            <button
              type="button"
              onClick={handleRemoveAudio}
              disabled={isPending}
              aria-label={`Hapus audio slot ${sound.slot}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 text-black/40 hover:bg-[#FFE1E1] hover:text-[#B3261E] transition-colors disabled:opacity-50"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
        {audioUrl && (
          <audio src={audioUrl} controls className="w-full h-8 mt-1" />
        )}
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleAudioChange}
        />
      </div>
    </div>
  );
}
