import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import TrendingSoundSlotCard from "./TrendingSoundSlotCard";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Trending Sound | Dashboard SOPAN TEAM",
};

export const dynamic = "force-dynamic";

// Fallback statis kalau tabel trending_sounds belum dibuat / Supabase lagi
// error, biar halaman tetap bisa dibuka (walau upload belum bisa dipakai
// sampai migration_trending_sounds.sql dijalankan).
const FALLBACK_SOUNDS = [
  { slot: 1, title: "Shiver", creator: "John Summit & Hayla", cover_url: null, audio_url: null, panel_color: "#0d2530" },
  { slot: 2, title: "Say Nothing", creator: "Flume & MAY-A", cover_url: null, audio_url: null, panel_color: "#2b1911" },
  { slot: 3, title: "Innerbloom", creator: "RÜFÜS DU SOL", cover_url: null, audio_url: null, panel_color: "#211a29" },
];

async function getTrendingSounds() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("trending_sounds")
      .select("*")
      .order("slot");

    if (error || !data || data.length === 0) {
      throw error || new Error("trending_sounds kosong / tidak ada data");
    }
    return data;
  } catch (err) {
    console.error("[dashboard/trending-sound] Gagal ambil trending_sounds dari Supabase:", err);
    return FALLBACK_SOUNDS;
  }
}

export default async function TrendingSoundPage() {
  const sounds = await getTrendingSounds();

  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Trending Sound"
        subtitle="Edit judul, nama kreator, cover, dan audio buat 3 kartu 'Trending Sound' di homepage (Divisi Remix)."
        searchPlaceholder="Cari slot..."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {sounds.map((sound) => (
          <TrendingSoundSlotCard key={sound.slot} sound={sound} />
        ))}
      </div>

      <p className="mt-6 text-xs text-black/40 leading-relaxed">
        Perubahan di sini langsung tampil di homepage: cover jadi gambar
        kartu, audio jadi yang diputar pas tombol play dipencet, dan
        judul/nama kreator jadi text atas-bawah di panel kartu. Kalau cover
        atau audio belum diupload, kartu tetap tampil pakai warna panel
        (`panel_color`) sebagai latar sementara.
      </p>
    </DashboardShell>
  );
}
