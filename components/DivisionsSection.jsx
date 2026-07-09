"use client";

import { motion } from "framer-motion";
import { Lens } from "./ui/lens";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
      className="relative h-36 w-full overflow-hidden rounded-lg"
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
        className={`absolute bottom-2 right-3 font-display text-3xl bg-gradient-to-r ${division.accent} bg-clip-text text-transparent select-none`}
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {DIVISIONS.map((division, i) => (
            <motion.div
              key={division.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="w-full shadow-none overflow-hidden">
                <CardHeader className="p-3 pb-0">
                  <Lens isStatic position={{ x: 100, y: 60 }}>
                    <DivisionVisual division={division} />
                  </Lens>
                </CardHeader>
                <CardContent className="p-3 pt-4">
                  <CardTitle className="text-lg">{division.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {division.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex-col items-stretch gap-3">
                  <div className="flex items-center justify-between border-t border-black/10 pt-3">
                    <AnimatedTooltip items={division.members} />
                    <span className="text-[11px] text-ink-dim">
                      {division.members.length} member aktif
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Gabung
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1">
                      Karya
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
