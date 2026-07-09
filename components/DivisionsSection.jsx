"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
    href: "/divisi/remix",
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
      className="relative aspect-[4/3] w-full flex items-center justify-center overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${division.accentSolidFrom}, ${division.accentSolidTo})`,
        boxShadow: `0 12px 32px -10px ${division.accentSolidTo}66`,
      }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <span className="relative font-display font-black text-white text-2xl sm:text-3xl leading-none drop-shadow-md px-2 text-center">
        {division.name}
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
              <Card className="w-full max-w-xs mx-auto shadow-none overflow-hidden">
                <CardHeader className="p-3 pb-0">
                  <DivisionVisual division={division} />
                </CardHeader>
                <CardContent className="p-3 pt-4">
                  <CardTitle className="text-lg">{division.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {division.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex-col items-stretch gap-3">
                  <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-3">
                    <div className="flex items-center">
                      <AnimatedTooltip items={division.members} />
                    </div>
                    <span className="text-[11px] text-ink-dim">
                      {division.members.length} member aktif
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {division.href ? (
                      <Link href={division.href} className="flex-1">
                        <Button size="sm" className="w-full">
                          Gabung
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" className="flex-1">
                        Gabung
                      </Button>
                    )}
                    <Link href="/anggota" className="flex-1">
                      <Button size="sm" variant="secondary" className="w-full">
                        Anggota
                      </Button>
                    </Link>
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