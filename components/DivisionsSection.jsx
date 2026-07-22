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
  CardTitle,
} from "./ui/card";

const DIVISIONS = [
  {
    eyebrow: "Divisi 01",
    name: "Remix",
    href: "/divisi/remix",
    tagline: "Suara baru dari lagu lama",
    description:
      "Ngolah track lewat DAW jadi remix versi sendiri — dari mashup, bootleg remix, sampai produksi remix full version siap rilis.",
    tags: ["Remix", "DAW Production", "Bootleg Remix"],
    soft: "#F1E9FF",
    accentSolidFrom: "#B026FF",
    accentSolidTo: "#FF2E92",
    extraCount: "99+",
    members: [
      { id: 1, name: "Raka A.", designation: "Lead Remixer", image: "https://i.pravatar.cc/150?img=13" },
      { id: 2, name: "Dio P.", designation: "Sound Designer", image: "https://i.pravatar.cc/150?img=14" },
      { id: 3, name: "Fajar N.", designation: "Mix Engineer", image: "https://i.pravatar.cc/150?img=15" },
    ],
  },
  {
    eyebrow: "Divisi 02",
    name: "Creator",
    tagline: "Jedag-jedug bikin nagih",
    description:
      "Racik footage jadi konten jedag-jedug yang bikin nagih pakai Alight Motion atau CapCut — transisi ngebut, efek nampol, siap FYP.",
    tags: ["Alight Motion", "CapCut", "Edit Jedag-Jedug"],
    soft: "#DFF7EC",
    accentSolidFrom: "#00E5FF",
    accentSolidTo: "#3D5AFE",
    extraCount: "99+",
    members: [
      { id: 1, name: "Bagas W.", designation: "Video Editor", image: "https://i.pravatar.cc/150?img=33" },
      { id: 2, name: "Yoga S.", designation: "Colorist", image: "https://i.pravatar.cc/150?img=51" },
      { id: 3, name: "Rian K.", designation: "Motion Designer", image: "https://i.pravatar.cc/150?img=52" },
    ],
  },
  {
    eyebrow: "Divisi 03",
    name: "Leadis",
    tagline: "Jedag-jedug khusus kreator cewek",
    description:
      "Sama kayak Creator — edit jedag-jedug pakai Alight Motion atau CapCut, tapi ini rumahnya para kreator cewek buat berkarya bareng.",
    tags: ["Alight Motion", "CapCut", "Kreator Cewek"],
    soft: "#FFEFD9",
    accentSolidFrom: "#FFD166",
    accentSolidTo: "#FF6FB5",
    extraCount: "99+",
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

export default function DivisionsSection() {
  return (
    <section id="divisi" className="relative px-6 sm:px-10 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="max-w-2xl mx-auto mb-4 text-center"
        >
          <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
            Tiga Divisi
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-4 text-ink leading-tight">
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
              <Card className="w-full max-w-xs mx-auto shadow-none overflow-hidden rounded-[24px] border border-black/5 dark:border-white/10 bg-base-elevated p-1">
                {/* Soft pastel inset block — sits inside the white card with a visible margin */}
                <div
                  className="rounded-[18px] p-5 pb-6"
                  style={{ backgroundColor: division.soft }}
                >
                  <span className="font-body font-medium text-[11px] tracking-wide text-black/50">
                    {division.eyebrow}
                  </span>
                  <CardTitle className="font-display font-extrabold text-2xl leading-tight text-ink-solid mt-1">
                    {division.name}
                  </CardTitle>
                  <CardDescription className="font-body font-normal text-sm mt-2 text-black/60 leading-relaxed">
                    {division.description}
                  </CardDescription>
                </div>

                {/* White bottom block */}
                <CardContent className="px-4 pt-4 pb-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AnimatedTooltip items={division.members} />
                      {division.extraCount ? (
                        <div className="group relative -mr-4 z-0">
                          <div className="relative !m-0 h-10 w-10 rounded-full border-2 border-white bg-ink-solid flex items-center justify-center !p-0">
                            <span className="text-white text-[10px] font-bold leading-none">
                              {division.extraCount}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <span className="text-[11px] text-ink-dim">
                      {division.members.length} member aktif
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="px-4 pt-3 pb-2 flex-col items-stretch gap-2">
                  {division.href ? (
                    <Link href={division.href} className="w-full">
                      <Button className="w-full h-11 rounded-full">Lihat Divisi</Button>
                    </Link>
                  ) : (
                    <Button className="w-full h-11 rounded-full">Lihat Divisi</Button>
                  )}
                  <Link href="/anggota" className="w-full">
                    <Button variant="secondary" className="w-full h-11 rounded-full">
                      Lihat Anggota
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}