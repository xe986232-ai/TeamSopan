import { ArrowRight } from "lucide-react";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import TrendingWorkCard from "./TrendingWorkCard";
import CreatorTrendingHeading from "./CreatorTrendingHeading";

// Fallback kalau Supabase belum di-setup / lagi error, biar homepage tetap
// tampil bagus persis kayak sebelumnya (gradient + data statis).
const DEFAULT_WORKS = [
  {
    slot: 1,
    title: "Cinematic Transition Pack",
    subtitle: "Alight Motion Edit",
    likes: 5614,
    gradient: "linear-gradient(155deg, #00E5FF, #3D5AFE)",
    videoUrl: null,
  },
  {
    slot: 2,
    title: "Beat Sync Edit",
    subtitle: "Motion Graphic",
    likes: 8098,
    gradient: "linear-gradient(155deg, #3D5AFE, #00E5FF)",
    videoUrl: null,
  },
  {
    slot: 3,
    title: "Animated Text Reel",
    subtitle: "Animation Text",
    likes: 2948,
    gradient: "linear-gradient(155deg, #00C2FF, #2946FF)",
    videoUrl: null,
  },
  {
    slot: 4,
    title: "Color Grading Showcase",
    subtitle: "Video Editing",
    likes: 1204,
    gradient: "linear-gradient(155deg, #2946FF, #00E5FF)",
    videoUrl: null,
  },
];

async function getTrendingWorks() {
  try {
    // Server Component, bukan browser -- aman pakai admin client (secret
    // key). Sama seperti pola AdminSection, ini bikin homepage nggak
    // bergantung ke policy RLS yang bisa aja belum/salah ter-setup di
    // project live.
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("trending_works")
      .select("*")
      .order("slot");

    if (error || !data || data.length === 0) {
      throw error || new Error("trending_works kosong / tidak ada data");
    }

    return data.map((row) => ({
      slot: row.slot,
      title: row.title,
      subtitle: row.subtitle,
      likes: row.likes,
      gradient: row.gradient,
      videoUrl: row.video_url || null,
    }));
  } catch (err) {
    console.error("[CreatorTrendingSection] Gagal ambil trending_works dari Supabase:", err);
    return DEFAULT_WORKS;
  }
}

export default async function CreatorTrendingSection() {
  const works = await getTrendingWorks();

  return (
    <section id="trending-creator" className="relative py-20 sm:py-24">
      <CreatorTrendingHeading />

      <div className="max-w-2xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {works.map((work, i) => (
            <TrendingWorkCard key={work.slot} work={work} index={i} />
          ))}
        </div>

        {/* CTA lihat semua karya divisi Creator */}
        <div className="mt-6 flex justify-center">
          <a
            href="/divisi/creator"
            className="group relative isolate inline-flex items-center gap-1.5 rounded-full p-[1.5px] transition"
            style={{ background: "linear-gradient(135deg, #00E5FF, #3D5AFE)" }}
          >
            <span className="flex items-center gap-1.5 rounded-full bg-base px-4 py-2 text-sm font-semibold text-ink transition group-hover:bg-transparent group-hover:text-white">
              Lihat karya lainnya
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
