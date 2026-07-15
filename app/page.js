"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const DIVISIONS = [
  {
    key: "remix",
    name: "Remix",
    dot: "#8B5CF6",
    desc: "Ngolah ulang track jadi versi yang lebih segar — dari mashup, bootleg, sampai remix full produksi.",
    members: ["Raka A.", "Dio P.", "Fajar N."],
    count: "3 member aktif",
  },
  {
    key: "creator",
    name: "Creator",
    dot: "#14B8A6",
    desc: "Nyusun potongan gambar jadi konten yang enak ditonton — editing rapi, transisi presisi, color grading konsisten.",
    members: ["Bagas W.", "Yoga S.", "Rian K."],
    count: "3 member aktif",
  },
  {
    key: "leadis",
    name: "Leadis",
    dot: "#F43F76",
    desc: "Wadah khusus kreator perempuan buat tampil, bikin konten, dan berkembang bareng dalam satu keluarga.",
    members: ["Sasa M.", "Nadia R.", "Vira L."],
    count: "3 member aktif",
  },
];

const TESTIMONIALS = [
  {
    name: "Dimas Ardiansyah",
    handle: "@dimasardi",
    text: "Gabung ke divisi Remix itu keputusan terbaik tahun ini. Timnya suportif banget dan progress skill gue jauh lebih cepat.",
  },
  {
    name: "Sari Kusuma",
    handle: "@sarikusuma",
    text: "Divisi Leadis ngasih ruang buat gue tampil tanpa takut dihakimi. Jarang nemu komunitas kayak gini.",
  },
  {
    name: "Bima Prasetya",
    handle: "@bimapras",
    text: "Baru gabung 2 bulan di Creator, udah dapet banyak masukan soal color grading dari member senior.",
  },
];

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function ThreadLine() {
  return (
    <svg viewBox="0 0 600 40" className="w-full h-8" preserveAspectRatio="none">
      <line x1="60" y1="20" x2="540" y2="20" stroke="#E5E4E0" strokeWidth="1" strokeDasharray="2 6" />
      {DIVISIONS.map((d, i) => (
        <circle key={d.key} cx={100 + i * 200} cy="20" r="5" fill={d.dot} />
      ))}
    </svg>
  );
}

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#17181C] font-[Inter]">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-6">
        <span className="font-[Space_Grotesk] text-[15px] font-medium tracking-tight">
          Sopan Team
        </span>
        <div className="hidden sm:flex items-center gap-8 text-[14px] text-[#6E7079]">
          <a href="#tentang" className="hover:text-[#17181C] transition-colors">Tentang</a>
          <a href="#divisi" className="hover:text-[#17181C] transition-colors">Divisi</a>
          <a href="#cerita" className="hover:text-[#17181C] transition-colors">Cerita</a>
        </div>
        <a
          href="#gabung"
          className="text-[14px] font-medium px-4 py-2 rounded-md text-white bg-[#2F3EE0] transition-transform hover:scale-[1.02]"
        >
          Gabung
        </a>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-full mb-8 bg-[#F1F1EC] text-[#6E7079]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F3EE0]" />
            Rekrutmen member baru dibuka
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-[Space_Grotesk] text-[44px] sm:text-[56px] leading-[1.08] font-medium tracking-tight max-w-3xl mx-auto">
            Tiga divisi, satu wadah buat berkarya.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 text-[17px] leading-relaxed max-w-xl mx-auto text-[#6E7079]">
            Tempat berkumpulnya kreator remix, video editor, dan kreator konten
            perempuan yang mau berkembang bareng.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-9 flex items-center justify-center gap-3">
            <a
              href="#divisi"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium px-5 py-2.5 rounded-md text-white bg-[#2F3EE0] transition-transform hover:scale-[1.02]"
            >
              Lihat divisi <ArrowRight size={15} />
            </a>
            <a
              href="#tentang"
              className="text-[14px] font-medium px-5 py-2.5 rounded-md border border-[#E5E4E0] text-[#17181C]"
            >
              Tentang kami
            </a>
          </div>
        </Reveal>
      </header>

      {/* About */}
      <section id="tentang" className="max-w-3xl mx-auto px-6 pb-28 text-center">
        <Reveal>
          <p className="text-[13px] font-medium tracking-wide uppercase text-[#2F3EE0]">
            Tentang kami
          </p>
          <p className="font-[Space_Grotesk] mt-4 text-[24px] sm:text-[28px] leading-snug font-medium">
            Karya yang bagus nggak harus lahir dari satu skill aja.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed max-w-lg mx-auto text-[#6E7079]">
            Wadah buat kamu yang jago meremix suara, menyulap footage jadi cerita
            lewat editing, atau tampil di depan kamera — satu komunitas, saling
            dukung karya satu sama lain.
          </p>
        </Reveal>
      </section>

      {/* Divisions */}
      <section id="divisi" className="max-w-5xl mx-auto px-6 pb-28">
        <Reveal>
          <p className="text-[13px] font-medium tracking-wide uppercase text-center text-[#2F3EE0]">
            Divisi
          </p>
          <h2 className="font-[Space_Grotesk] mt-3 text-[28px] sm:text-[32px] font-medium text-center tracking-tight">
            Satu tim, tiga cara berkarya
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 max-w-xl mx-auto">
            <ThreadLine />
          </div>
        </Reveal>

        <div className="mt-4 grid sm:grid-cols-3 gap-5">
          {DIVISIONS.map((d, i) => (
            <Reveal key={d.key} delay={140 + i * 80}>
              <div className="p-6 rounded-xl h-full border border-[#E5E4E0] transition-colors hover:bg-[#F5F5F0]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.dot }} />
                  <span className="font-[Space_Grotesk] text-[15px] font-medium">{d.name}</span>
                </div>
                <p className="text-[14px] leading-relaxed text-[#6E7079]">{d.desc}</p>
                <div className="flex items-center gap-2 mt-6">
                  <div className="flex -space-x-2">
                    {d.members.map((m) => (
                      <div
                        key={m}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium text-white"
                        style={{ background: d.dot, border: "2px solid #FAFAF8" }}
                        title={m}
                      >
                        {m[0]}
                      </div>
                    ))}
                  </div>
                  <span className="text-[12px] text-[#8A8B92]">{d.count}</span>
                </div>
                <a
                  href="#gabung"
                  className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-[#2F3EE0]"
                >
                  Gabung divisi <ArrowUpRight size={13} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="cerita" className="max-w-5xl mx-auto px-6 pb-28">
        <Reveal>
          <p className="text-[13px] font-medium tracking-wide uppercase text-center text-[#2F3EE0]">
            Kata mereka
          </p>
          <h2 className="font-[Space_Grotesk] mt-3 text-[28px] sm:text-[32px] font-medium text-center tracking-tight">
            Yang dibicarain soal Sopan Team
          </h2>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.handle} delay={100 + i * 80}>
              <div className="p-6 rounded-xl h-full bg-[#F5F5F0]">
                <p className="text-[14px] leading-relaxed text-[#3A3B41]">“{t.text}”</p>
                <div className="mt-5 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium text-white bg-[#2F3EE0]">
                    {t.name[0]}
                  </div>
                  <div className="text-[13px]">
                    <p className="font-medium leading-none">{t.name}</p>
                    <p className="mt-1 text-[#8A8B92]">{t.handle}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="gabung" className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <Reveal>
          <div className="p-12 rounded-2xl bg-[#17181C]">
            <p className="font-[Space_Grotesk] text-[24px] sm:text-[28px] font-medium text-white tracking-tight">
              Mau gabung?
            </p>
            <p className="mt-3 text-[14px] max-w-sm mx-auto text-[#A9AAB0]">
              Kami selalu buka ruang buat orang yang serius mau berkarya. Daftar
              sekarang dan ceritain karya kamu.
            </p>
            <a
              href="/gabung"
              className="mt-7 inline-flex items-center gap-1.5 text-[14px] font-medium px-5 py-2.5 rounded-md text-white bg-[#2F3EE0] transition-transform hover:scale-[1.02]"
            >
              Daftar sekarang <ArrowRight size={15} />
            </a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] border-t border-[#E5E4E0] text-[#8A8B92]">
        <span>© 2026 Sopan Team</span>
        <div className="flex gap-5">
          <a href="#" className="hover:text-[#17181C] transition-colors">Instagram</a>
          <a href="#" className="hover:text-[#17181C] transition-colors">TikTok</a>
          <a href="#" className="hover:text-[#17181C] transition-colors">YouTube</a>
        </div>
      </footer>
    </div>
  );
}
