import { createAdminSupabaseClient } from "@/lib/supabase/server";
import TrendingSoundPlayer from "./TrendingSoundPlayer";

// Fallback kalau tabel `trending_sounds` belum di-setup / Supabase lagi
// error, biar homepage tetap tampil bagus persis kayak sebelumnya (data
// placeholder yang sama seperti isi awal migration_trending_sounds.sql).
const DEFAULT_TRACKS = [
  {
    id: "trend-01",
    title: "Shiver",
    creator: "John Summit & Hayla",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    durationFallback: 234,
    cover: "https://picsum.photos/seed/sopan-shiver/700/800",
    panelColor: "#0d2530",
  },
  {
    id: "trend-02",
    title: "Say Nothing",
    creator: "Flume & MAY-A",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    durationFallback: 233,
    cover: "https://picsum.photos/seed/sopan-saynothing/700/800",
    panelColor: "#2b1911",
  },
  {
    id: "trend-03",
    title: "Innerbloom",
    creator: "RÜFÜS DU SOL",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    durationFallback: 238,
    cover: "https://picsum.photos/seed/sopan-innerbloom/700/800",
    panelColor: "#211a29",
  },
];

async function getTrendingSounds() {
  try {
    // Server Component, bukan browser -- aman pakai admin client (secret
    // key), sama seperti pola CreatorTrendingSection. Homepage jadi nggak
    // bergantung ke policy RLS yang bisa aja belum/salah ter-setup di
    // project live.
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("trending_sounds")
      .select("*")
      .order("slot");

    if (error || !data || data.length === 0) {
      throw error || new Error("trending_sounds kosong / tidak ada data");
    }

    return data.map((row) => ({
      id: `trend-${row.slot}`,
      title: row.title,
      creator: row.creator || "",
      src: row.audio_url || "",
      durationFallback: 0,
      cover: row.cover_url || "",
      panelColor: row.panel_color || "#111827",
    }));
  } catch (err) {
    console.error("[TrendingSoundSection] Gagal ambil trending_sounds dari Supabase:", err);
    return DEFAULT_TRACKS;
  }
}

export default async function TrendingSoundSection() {
  const tracks = await getTrendingSounds();

  // TrendingSoundPlayer ("use client") yang render <section>, heading, dan
  // seluruh stage 3D interaktif -- di sini cuma tanggung jawab ambil data
  // dari database (Server Component, boleh pakai admin client).
  return <TrendingSoundPlayer tracks={tracks} />;
}
