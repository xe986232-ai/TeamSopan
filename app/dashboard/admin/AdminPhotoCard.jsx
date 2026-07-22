"use client";

import { useRef, useState, useTransition } from "react";
import { Pencil, Loader2 } from "lucide-react";
import AvatarInitials from "@/components/dashboard/AvatarInitials";
import DivisionBadge from "@/components/dashboard/DivisionBadge";
import { uploadAdminPhoto } from "./actions";

export default function AdminPhotoCard({ admin }) {
  const fileInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState(admin.image_url || null);
  const [error, setError] = useState("");

  function handlePickFile() {
    setError("");
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview instan sebelum upload selesai
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);
    setError("");

    const formData = new FormData();
    formData.set("slug", admin.slug);
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadAdminPhoto(formData);
      if (result?.error) {
        setError(result.error);
        setPreview(admin.image_url || null);
      } else if (result?.imageUrl) {
        setPreview(result.imageUrl);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {preview ? (
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={admin.name}
              src={preview}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <AvatarInitials name={admin.name} size={44} />
        )}

        <button
          type="button"
          onClick={handlePickFile}
          disabled={isPending}
          aria-label={`Ganti foto admin ${admin.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black/70 transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Pencil size={14} />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div>
        <p className="font-display font-bold text-sm text-[#111827]">
          {admin.name}
        </p>
        <div className="mt-1.5">
          <DivisionBadge divisionId={admin.slug} />
        </div>
      </div>

      <p className="text-xs text-black/50 leading-relaxed">{admin.description}</p>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
