"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Users, Sparkles } from "lucide-react";
import { TextField } from "./ui/text-field";
import { Button } from "./ui/button";
import { parseRoomId, SEED_MEMBERS } from "@/lib/absensi";
import { WELCOME_NAME_KEY } from "@/lib/welcome";

const SMOOTH_EASE = [0.22, 1, 0.36, 1];

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function AvatarCircle({ name, accentFrom, accentTo, size = 40 }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </span>
  );
}

// Semburan titik kecil pas berhasil absen, biar ga kerasa "flat".
function CheckinBurst({ color }) {
  const dots = React.useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {dots.map((i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const distance = 60 + ((i * 37) % 40);
        return (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{ background: color }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: 0.3,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export default function AttendanceRoom({ roomId }) {
  const division = React.useMemo(() => parseRoomId(roomId), [roomId]);

  const [checkedIn, setCheckedIn] = React.useState(() => {
    const seeds = division ? SEED_MEMBERS[division.id] || [] : [];
    return seeds.map((m, i) => ({
      id: `seed-${i}`,
      name: m.name,
      label: `${m.minutesAgo} menit lalu`,
    }));
  });
  const [hasCheckedIn, setHasCheckedIn] = React.useState(false);
  const [nameInput, setNameInput] = React.useState("");
  const [burstKey, setBurstKey] = React.useState(0);
  const [showIntro, setShowIntro] = React.useState(true);

  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem(WELCOME_NAME_KEY);
      if (saved) setNameInput(saved);
    } catch {
      // sessionStorage gak tersedia (mis. render awal) — gapapa, biarin kosong.
    }
  }, []);

  // Animasi teks intro ("Absensi Divisi ...") sebelum masuk ke room-nya.
  React.useEffect(() => {
    if (!division) return;
    const timer = setTimeout(() => setShowIntro(false), 2200);
    return () => clearTimeout(timer);
  }, [division]);

  // ---- Room tidak dikenali / link salah ----
  if (!division) {
    return (
      <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-base px-6">
        <div className="text-center max-w-sm">
          <h1 className="font-display font-extrabold text-2xl text-ink mb-2">
            Link Absensi Tidak Valid
          </h1>
          <p className="text-sm text-ink-muted mb-6">
            Room absensi ini tidak ditemukan atau sudah tidak aktif. Coba
            minta link terbaru ke admin divisi kamu.
          </p>
          <Link href="/">
            <Button variant="secondary">Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAbsen = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setCheckedIn((prev) => [
      { id: `me-${Date.now()}`, name: trimmed, label: "Baru saja", isMe: true },
      ...prev,
    ]);
    setHasCheckedIn(true);
    setBurstKey((k) => k + 1);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="absensi-intro"
            className="fixed inset-0 z-[7000] flex flex-col items-center justify-center bg-base px-6 text-center"
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.55, ease: SMOOTH_EASE }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-25 blur-3xl"
              style={{
                background: `radial-gradient(circle at 50% 42%, ${division.accentFrom}, transparent 60%)`,
              }}
            />
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: SMOOTH_EASE }}
              className="relative font-body font-semibold text-xs tracking-[0.4em] uppercase text-ink-muted"
            >
              Team Sopan
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: SMOOTH_EASE }}
              className="relative font-display font-extrabold text-4xl sm:text-5xl text-ink mt-3"
            >
              Absensi Divisi{" "}
              <span
                style={{
                  backgroundImage: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {division.name}
              </span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        data-lenis-prevent
        className="fixed inset-0 z-[6000] flex flex-col items-center overflow-y-auto bg-base"
      >
      {/* gradient glow, warnanya ikut accent divisi */}
      <div
        className="pointer-events-none absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full opacity-20 blur-3xl"
        style={{ background: division.accentFrom }}
      />
      <div
        className="pointer-events-none absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full opacity-15 blur-3xl"
        style={{ background: division.accentTo }}
      />

      <Link
        href="/"
        aria-label="Tutup"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors text-ink"
      >
        <X size={18} />
      </Link>

      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-24 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SMOOTH_EASE }}
          className="flex flex-col items-center gap-3"
        >
          <span
            className="font-body font-semibold text-xs tracking-[0.3em] uppercase px-4 py-1.5 rounded-full text-white"
            style={{
              background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
            }}
          >
            Divisi {division.name}
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink leading-tight">
            Absensi Sesi Ini
          </h1>
          <p className="text-sm text-ink-muted max-w-sm">
            Klik tombol di bawah buat nandain kamu masih aktif di SOPAN TEAM.
            Jangan sampai kelewatan, ya!
          </p>
        </motion.div>

        {/* ---- Area absen ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: SMOOTH_EASE }}
          className="w-full flex flex-col items-center gap-5"
        >
          <AnimatePresence mode="wait">
            {!hasCheckedIn ? (
              <motion.div
                key="form"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-5"
              >
                <div className="w-full max-w-xs text-left">
                  <TextField
                    id="absenName"
                    label="Nama kamu"
                    placeholder="Raka Aditya"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <button
                      type="button"
                      onClick={handleAbsen}
                      disabled={!nameInput.trim()}
                      className="h-32 w-32 rounded-full flex flex-col items-center justify-center gap-1 text-white font-display font-bold shadow-xl transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
                        boxShadow: `0 12px 40px -8px ${division.accentTo}88`,
                      }}
                    >
                      <Sparkles size={22} />
                      <span className="text-sm">Absen</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: SMOOTH_EASE }}
                className="relative flex flex-col items-center gap-3"
              >
                <div className="relative h-32 w-32 flex items-center justify-center">
                  <AnimatePresence>
                    {burstKey > 0 && (
                      <CheckinBurst key={burstKey} color={division.accentTo} />
                    )}
                  </AnimatePresence>
                  <div
                    className="relative h-32 w-32 rounded-full flex items-center justify-center text-white"
                    style={{
                      background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
                      boxShadow: `0 12px 40px -8px ${division.accentTo}88`,
                    }}
                  >
                    <Check size={36} strokeWidth={3} />
                  </div>
                </div>
                <p className="font-display font-bold text-lg text-ink">
                  Absen berhasil, {nameInput.trim()}! 🎉
                </p>
                <p className="text-xs text-ink-muted">
                  Kamu tercatat aktif buat sesi ini.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ---- List yang sudah absen ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: SMOOTH_EASE }}
          className="w-full mt-4"
        >
          <div className="flex items-center justify-center gap-2 mb-5 text-ink">
            <Users size={16} className="text-ink-muted" />
            <span className="font-body font-semibold text-sm">
              {checkedIn.length} anggota sudah absen
            </span>
          </div>

          <ul
            data-lenis-prevent
            className="grid grid-cols-3 sm:grid-cols-4 justify-items-center gap-x-3 gap-y-6 max-h-[45vh] overflow-y-auto px-1 py-1"
          >
            <AnimatePresence initial={false}>
              {checkedIn.map((member) => (
                <motion.li
                  key={member.id}
                  layout
                  initial={{ opacity: 0, y: -12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: SMOOTH_EASE }}
                  className="flex flex-col items-center gap-2 text-center w-full"
                >
                  <AvatarCircle
                    name={member.name}
                    accentFrom={division.accentFrom}
                    accentTo={division.accentTo}
                    size={56}
                  />
                  <div className="min-w-0 w-full">
                    <p className="font-body font-semibold text-xs text-ink truncate">
                      {member.name}
                      {member.isMe ? " (kamu)" : ""}
                    </p>
                    <p className="text-[11px] text-ink-dim">{member.label}</p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      </div>
      </div>
    </>
  );
}