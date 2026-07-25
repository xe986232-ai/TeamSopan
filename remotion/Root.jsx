import * as React from "react";
import { Composition, Still } from "remotion";
import { TiktokOverlayComposition } from "./TiktokOverlayComposition";

// Rasio 9:16 asli (sesuai section 15 spec migrasi: Preview 390x844 di
// mockup HP, Export tetap 1080x1920 -- di-scale, bukan di-hardcode ke
// ukuran preview).
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const FPS = 30;

export const defaultTiktokOverlayProps = {
  coverUrl: null,
  audioUrl: null,
  title: "Belum ada lagu",
  artist: "@artist",
  bgOpacity: 55,
  bgBlur: 64,
  durationInSeconds: 10,
};

function framesFromDuration(durationInSeconds) {
  return Math.max(1, Math.round((durationInSeconds || 1) * FPS));
}

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="TiktokOverlayVideo"
        component={TiktokOverlayComposition}
        fps={FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        durationInFrames={framesFromDuration(defaultTiktokOverlayProps.durationInSeconds)}
        defaultProps={defaultTiktokOverlayProps}
        calculateMetadata={async ({ props }) => ({
          durationInFrames: framesFromDuration(props.durationInSeconds),
        })}
      />
      {/* Dipakai buat ekspor Gambar (PNG) lewat renderStill -- komponen &
          props-nya sama, cuma diambil satu frame statis (frame 0). */}
      <Still
        id="TiktokOverlayImage"
        component={TiktokOverlayComposition}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultTiktokOverlayProps}
      />
    </>
  );
}
