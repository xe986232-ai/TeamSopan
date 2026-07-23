"use client";

import { motion } from "framer-motion";
import { Heart, Play, ArrowRight } from "lucide-react";

// Ganti `link` dengan URL asli (TikTok/YouTube/IG) begitu karya-nya sudah
// diupload. `likes` cukup diedit manual di sini dulu — kalau nanti mau
// ditarik otomatis dari API TikTok/IG, tinggal ganti data ini jadi hasil fetch.
const CREATOR_WORKS = [
  {
    id: "work-01",
    title: "Cinematic Transition Pack",
    subtitle: "Alight Motion Edit",
    likes: 5614,
    link: "https://www.tiktok.com/@sopanteam",
    gradient: "linear-gradient(155deg, #00E5FF, #3D5AFE)",
  },
  {
    id: "work-02",
    title: "Beat Sync Edit",
    subtitle: "Motion Graphic",
    likes: 8098,
    link: "https://www.tiktok.com/@sopanteam",
    gradient: "linear-gradient(155deg, #3D5AFE, #00E5FF)",
  },
  {
    id: "work-03",
    title: "Animated Text Reel",
    subtitle: "Animation Text",
    likes: 2948,
    link: "https://www.tiktok.com/@sopanteam",
    gradient: "linear-gradient(155deg, #00C2FF, #2946FF)",
  },
  {
    id: "work-04",
    title: "Color Grading Showcase",
    subtitle: "Video Editing",
    likes: 1204,
    link: "https://www.tiktok.com/@sopanteam",
    gradient: "linear-gradient(155deg, #2946FF, #00E5FF)",
  },
];

function formatLikes(n) {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}rb`;
  }
  return `${n}`;
}

export default function CreatorTrendingSection() {
  return (
    <section id="trending-creator" className="relative py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto px-6 sm:px-10 mb-10 text-center"
      >
        <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
          Divisi Creator
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl mt-4 text-ink">
          Trending Edit
        </h2>
        <p className="mt-3 text-ink-muted">
          Karya video editing yang lagi rame dilihat dari komunitas SOPAN TEAM.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto px-6 sm:px-10"
      >
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {CREATOR_WORKS.map((work, i) => (
            <motion.a
              key={work.id}
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
            >
              {/* thumbnail dasar: gradient khas Creator + grain halus */}
              <div
                className="absolute inset-0"
                style={{ background: work.gradient }}
              />
              <div className="absolute inset-0 bg-grain opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />

              {/* tombol play di tengah */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play
                    className="h-5 w-5 translate-x-0.5 text-creator-to"
                    fill="currentColor"
                  />
                </span>
              </div>

              {/* judul karya, pojok atas */}
              <div className="absolute inset-x-0 top-0 p-3 sm:p-4">
                <p className="font-display font-bold text-sm sm:text-base text-white leading-tight drop-shadow">
                  {work.title}
                </p>
                <p className="font-body text-xs text-white/80 mt-0.5">
                  {work.subtitle}
                </p>
              </div>

              {/* like count, pojok bawah — ala kartu "disarankan" */}
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-pink-400" fill="currentColor" />
                <span className="font-body font-semibold text-sm text-white">
                  {formatLikes(work.likes)}
                </span>
              </div>
            </motion.a>
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
      </motion.div>
    </section>
  );
}
