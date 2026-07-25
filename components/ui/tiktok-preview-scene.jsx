"use client";

import * as React from "react";
import { Iphone15Pro } from "@/components/ui/iphone-15-pro";
import { TiktokOverlay } from "@/components/ui/tiktok-overlay";

// ============================================================================
// TiktokPreviewScene -- mockup HP + overlay chrome TikTok di atasnya.
// Area tengah (di belakang overlay) sengaja cuma placeholder abu-abu --
// nanti di sinilah video hasil generate / konten lain ditaruh (ganti isi
// <div className="area konten"> di bawah dengan <video> / komponen lain).
// ============================================================================
export function TiktokPreviewScene() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Iphone15Pro className="h-auto w-[240px] drop-shadow-2xl sm:w-[280px]">
        <div className="relative h-full w-full overflow-hidden bg-neutral-800">
          {/* ---- area konten: ganti dengan <video>/gambar/apa pun ---- */}
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-white/40">area video</span>
          </div>

          {/* ---- overlay chrome TikTok, nempel di atas area konten ---- */}
          <TiktokOverlay
            likeCount={53}
            commentCount={5}
            saveCount={13}
            shareCount={28}
          />
        </div>
      </Iphone15Pro>
    </div>
  );
}
