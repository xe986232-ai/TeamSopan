"use client";

import * as React from "react";
import { CircleUserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Field upload foto profil — bentuknya: avatar bulat (preview / placeholder ikon),
// tombol "Upload foto", nama file yang dipilih + tombol "Hapus".
// Dipakai di halaman aktivasi (/masuk?token=xxx) supaya pendaftar baru bisa
// langsung lengkapi foto profil sebelum masuk dashboard.
const ProfileUploadField = React.forwardRef(
  ({ label, previewUrl, fileName, onFileSelect, onRemove, error, disabled, className }, ref) => {
    const inputRef = React.useRef(null);
    const [localError, setLocalError] = React.useState("");

    React.useImperativeHandle(ref, () => inputRef.current);

    function openFileDialog() {
      inputRef.current?.click();
    }

    function handleChange(e) {
      const file = e.target.files?.[0];
      e.target.value = ""; // biar bisa pilih file yang sama lagi kalau mau ganti
      if (!file) return;

      if (!file.type?.startsWith("image/")) {
        setLocalError("File harus berupa gambar (jpg, png, webp, dll).");
        return;
      }
      if (file.size > MAX_SIZE) {
        setLocalError("Ukuran file maksimal 5MB.");
        return;
      }

      setLocalError("");
      onFileSelect?.(file);
    }

    const shownError = error || localError;

    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        {label && (
          <p className="self-start text-sm font-medium text-ink">{label}</p>
        )}

        <div className="inline-flex items-center gap-3 self-start align-top">
          <div
            className="border-input relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.04]"
            aria-label={previewUrl ? "Preview foto profil" : "Avatar default"}
          >
            {previewUrl ? (
              <img
                className="size-full object-cover"
                src={previewUrl}
                alt="Preview foto profil"
                width="56"
                height="56"
              />
            ) : (
              <div aria-hidden="true">
                <CircleUserRound className="opacity-40" size={24} />
              </div>
            )}
          </div>

          <div className="relative inline-block">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openFileDialog}
              disabled={disabled}
              aria-haspopup="dialog"
            >
              {previewUrl ? "Ganti foto" : "Upload foto"}
            </Button>
            <input
              ref={inputRef}
              className="sr-only"
              accept="image/*"
              onChange={handleChange}
              disabled={disabled}
              type="file"
              aria-label="Upload foto profil"
            />
          </div>
        </div>

        {fileName && (
          <div className="inline-flex items-center gap-2 self-start text-xs">
            <p className="text-ink-dim truncate" aria-live="polite">
              {fileName}
            </p>
            <button
              type="button"
              className="font-medium text-rose-500 hover:underline"
              onClick={onRemove}
              disabled={disabled}
            >
              Hapus
            </button>
          </div>
        )}

        {shownError && (
          <p className="self-start text-xs text-rose-500" aria-live="polite">
            {shownError}
          </p>
        )}

        <p className="self-start text-xs text-ink-dim">
          Opsional — bisa dilengkapi belakangan di halaman profil.
        </p>
      </div>
    );
  }
);
ProfileUploadField.displayName = "ProfileUploadField";

export { ProfileUploadField };
