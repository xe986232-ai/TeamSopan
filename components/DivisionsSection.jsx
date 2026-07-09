"use client";

import { motion } from "framer-motion";
import { Lens } from "./ui/lens";
import { AnimatedTooltip } from "./ui/animated-tooltip";

const DIVISIONS = [
  {
    eyebrow: "Divisi 01",
    name: "Remix",
    tagline: "Suara baru dari lagu lama",
    description:
      "Ngolah ulang track jadi versi yang lebih segar — dari mashup, bootleg, sampai remix full produksi.",
    tags: ["Mashup", "Bootleg Remix", "Sound Design"],
    accent: "from-remix-from to-remix-to",
    accentSolidFrom: "#B026FF",
    accentSolidTo: "#FF2E92",
    members: [
      { id: 1, name: "Raka A.", designation: "Lead Remixer", image: "https://i.pravatar.cc/150?img=13" },
      { id: 2, name: "Dio P.", designation: "Sound Designer", image: "https://i.pravatar.cc/150?img=14" },
      { id: 3, name: "Fajar N.", designation: "Mix Engineer", image: "https://i.pravatar.cc/150?img=15" },
    ],
  },
  {
    eyebrow: "Divisi 02",
    name: "Creator",
    tagline: "Footage jadi cerita",
    description:
      "Nyusun potongan gambar jadi konten yang enak ditonton — editing rapi, transisi presisi, color grading konsisten.",
    tags: ["Video Editing", "Color Grading", "Motion Graphic"],
    accent: "from-creator-from to-creator-to",
    accentSolidFrom: "#00E5FF",
    accentSolidTo: "#3D5AFE",
    members: [
      { id: 1, name: "Bagas W.", designation: "Video Editor", image: "https://i.pravatar.cc/150?img=33" },
      { id: 2, name: "Yoga S.", designation: "Colorist", image: "https://i.pravatar.cc/150?img=51" },
      { id: 3, name: "Rian K.", designation: "Motion Designer", image: "https://i.pravatar.cc/150?img=52" },
    ],
  },
  {
    eyebrow: "Divisi 03",
    name: "Leadis",
    tagline: "Panggung buat kreator perempuan",
    description:
      "Wadah khusus kreator perempuan buat tampil, bikin konten, dan berkembang bareng dalam satu keluarga SOPAN TEAM.",
    tags: ["Content Creation", "Live & Showcase", "Personal Branding"],
    accent: "from-leadis-from to-leadis-to",
    accentSolidFrom: "#FFD166",
    accentSolidTo: "#FF6FB5",
    members: [
      { id: 1, name: "Sasa M.", designation: "Content Creator", image: "https://i.pravatar.cc/150?img=47" },
      { id: 2, name: "Nadia R.", designation: "Host & Showcase", image: "https://i.pravatar.cc/150?img=45" },
      { id: 3, name: "Vira L.", designation: "Personal Brand", image: "https://i.pravatar.cc/150?img=44" },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function DivisionVisual({ division }) {
  return (
    <div
      className="relative h-48 w-full sm:w-[22rem] overflow-hidden rounded-lg"
      style={{
        background: `linear-gradient(135deg, ${division.accentSolidFrom}33, ${division.accentSolidTo}22), #0D0D14`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <div
        className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-3xl opacity-50"
        style={{ background: division.accentSolidTo }}
      />
      <div
        className="absolute -top-10 -left-10 h-32 w-32 rounded-full blur-3xl opacity-40"
        style={{ background: division.accentSolidFrom }}
      />
      <span
        className={`absolute bottom-4 right-5 font-display text-6xl bg-gradient-to-r ${division.accent} bg-clip-text text-transparent select-none`}
      >
        {division.eyebrow.replace("Divisi ", "0")}
      </span>
    </div>
  );
}

export default function DivisionsSection() {
  return (
    <section id="divisi" className="relative px-6 sm:px-10 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="max-w-2xl mb-4"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-ink-muted">
            Tiga Divisi
          </span>
          <h2 className="font-display text-4xl sm:text-5xl mt-4 text-ink leading-tight">
            Satu tim, tiga cara berkarya
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {DIVISIONS.map((division, i) => (
            <motion.div
              key={division.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="bg-base-elevated border border-black/10 w-auto sm:w-[22rem] rounded-xl p-4 group"
            >
              <Lens zoomFactor={1.8} lensSize={150}>
                <DivisionVisual division={division} />
              </Lens>

              <div className="px-2 pt-5 pb-1">
                <span
                  className={`text-xs tracking-[0.3em] uppercase font-medium bg-gradient-to-r ${division.accent} bg-clip-text text-transparent`}
                >
                  {division.eyebrow}
                </span>
                <h3 className="font-display text-4xl mt-3 text-ink">
                  {division.name}
                </h3>
                <p
                  className={`mt-1 text-sm font-medium bg-gradient-to-r ${division.accent} bg-clip-text text-transparent`}
                >
                  {division.tagline}
                </p>
                <p className="mt-4 text-ink-muted text-sm max-w-sm">
                  {division.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-5 w-full">
                  {division.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full border border-black/10 text-ink-muted bg-black/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center mt-6 pt-5 border-t border-black/10">
                  <div className="flex items-center mr-4">
                    <AnimatedTooltip items={division.members} />
                  </div>
                  <span className="text-xs text-ink-dim">
                    {division.members.length} member aktif
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
