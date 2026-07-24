import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import TrendingSlotCard from "./TrendingSlotCard";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Trending Edit | Dashboard SOPAN TEAM",
};

export const dynamic = "force-dynamic";

// Fallback statis kalau tabel trending_works belum dibuat / Supabase lagi
// error, biar halaman tetap bisa dibuka (walau upload belum bisa dipakai
// sampai migration_trending_works.sql dijalankan).
const FALLBACK_WORKS = [
  { slot: 1, title: "Cinematic Transition Pack", subtitle: "Alight Motion Edit", gradient: "linear-gradient(155deg, #00E5FF, #3D5AFE)", video_url: null },
  { slot: 2, title: "Beat Sync Edit", subtitle: "Motion Graphic", gradient: "linear-gradient(155deg, #3D5AFE, #00E5FF)", video_url: null },
  { slot: 3, title: "Animated Text Reel", subtitle: "Animation Text", gradient: "linear-gradient(155deg, #00C2FF, #2946FF)", video_url: null },
  { slot: 4, title: "Color Grading Showcase", subtitle: "Video Editing", gradient: "linear-gradient(155deg, #2946FF, #00E5FF)", video_url: null },
];

async function getTrendingWorks() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("trending_works")
      .select("*")
      .order("slot");

    if (error || !data || data.length === 0) {
      throw error || new Error("trending_works kosong / tidak ada data");
    }
    return data;
  } catch (err) {
    console.error("[dashboard/trending] Gagal ambil trending_works dari Supabase:", err);
    return FALLBACK_WORKS;
  }
}

export default async function TrendingCreatorPage() {
  const works = await getTrendingWorks();

  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Trending Edit"
        subtitle="Upload video buat 4 slot kartu 'Trending Edit' di homepage (Divisi Creator)."
        searchPlaceholder="Cari slot..."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {works.map((work) => (
          <TrendingSlotCard key={work.slot} work={work} />
        ))}
      </div>

      <p className="mt-6 text-xs text-black/40 leading-relaxed">
        Video yang diupload di sini bakal langsung muncul di homepage begitu
        pengunjung pencet tombol play di kartu yang sesuai — gradient
        thumbnail-nya tetap dipertahankan sebagai animasi fade sebelum video
        muncul. Ukuran/rasio video bebas, dia otomatis di-crop ngikutin
        ukuran kartu (3:4) biar semua tetap rata.
      </p>
    </DashboardShell>
  );
}
