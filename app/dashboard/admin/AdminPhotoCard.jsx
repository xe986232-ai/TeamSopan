"use client";

import { useRef, useState, useTransition } from "react";
import { Pencil, Loader2, Check, X } from "lucide-react";
import AvatarInitials from "@/components/dashboard/AvatarInitials";
import { uploadAdminPhoto, updateAdminInfo } from "./actions";

export default function AdminPhotoCard({ admin }) {
  const fileInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState(admin.image_url || null);
  const [photoError, setPhotoError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(admin.name);
  const [role, setRole] = useState(admin.role);
  const [description, setDescription] = useState(admin.description);
  const [infoError, setInfoError] = useState("");

  function handlePickFile() {
    setPhotoError("");
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview instan sebelum upload selesai
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);
    setPhotoError("");

    const formData = new FormData();
    formData.set("slug", admin.slug);
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadAdminPhoto(formData);
      if (result?.error) {
        setPhotoError(result.error);
        setPreview(admin.image_url || null);
      } else if (result?.imageUrl) {
        setPreview(result.imageUrl);
      }
    });
  }

  function handleSaveInfo() {
    setInfoError("");
    const formData = new FormData();
    formData.set("slug", admin.slug);
    formData.set("name", name);
    formData.set("role", role);
    formData.set("description", description);

    startTransition(async () => {
      const result = await updateAdminInfo(formData);
      if (result?.error) {
        setInfoError(result.error);
      } else {
        setIsEditing(false);
      }
    });
  }

  function handleCancelEdit() {
    setName(admin.name);
    setRole(admin.role);
    setDescription(admin.description);
    setInfoError("");
    setIsEditing(false);
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {preview ? (
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={name}
              src={preview}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <AvatarInitials name={name} size={44} />
        )}

        <div className="flex items-center gap-1">
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
              aria-label={`Edit nama & divisi ${name}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black/70 transition-colors disabled:opacity-50 text-[11px] font-semibold"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={handlePickFile}
            disabled={isPending}
            aria-label={`Ganti foto admin ${name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black/70 transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Pencil size={14} />
            )}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-[11px] font-semibold text-black/50">Nama Admin</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm font-display font-bold text-[#111827] outline-none focus:border-black/30"
              placeholder="Nama admin"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-black/50">Nama Divisi</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm text-[#111827] outline-none focus:border-black/30"
              placeholder="misal: Divisi Remix"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-black/50">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-xs text-[#111827] outline-none focus:border-black/30 resize-none"
              placeholder="Deskripsi singkat admin"
            />
          </div>

          {infoError && <p className="text-xs text-red-500">{infoError}</p>}

          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={handleSaveInfo}
              disabled={isPending}
              className="flex items-center gap-1 rounded-lg bg-[#111827] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
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
        <>
          <div>
            <p className="font-display font-bold text-sm text-[#111827]">
              {name}
            </p>
            <p className="mt-1 text-xs font-semibold text-pink-500">{role}</p>
          </div>

          <p className="text-xs text-black/50 leading-relaxed">{description}</p>
        </>
      )}

      {photoError && <p className="text-xs text-red-500">{photoError}</p>}
    </div>
  );
}
