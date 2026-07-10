import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0A10",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(176,38,255,0.35), transparent 55%), radial-gradient(circle at 80% 75%, rgba(255,46,146,0.3), transparent 55%)",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: -2,
            color: "#ffffff",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          SOPAN TEAM
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "rgba(255,255,255,0.7)",
            display: "flex",
          }}
        >
          Remix &middot; Creator &middot; Leadis
        </div>
      </div>
    ),
    { ...size }
  );
}
