"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Users, Fingerprint, Clock, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { ParticleField } from "./ui/particle-field";
import { SpotlightCard } from "./ui/spotlight-card";
import { MagneticButton } from "./ui/magnetic-button";
import { ToastProvider, useToast } from "./ui/toast";
import { formatCountdown, timeAgoLabel, toLocalWallClock } from "@/lib/absensi";
import { checkInToSession } from "@/app/absensi/[roomId]/actions";

// ============================================================================
// SISTEM/LOGIC DI FILE INI TIDAK DIUBAH -- cuma tampilannya yang dirombak
// total (background partikel, kartu kaca "spotlight", tombol magnetic).
// Alur data (session/records/currentUser dari server, action
// checkInToSession, status sesi, realtime countdown) sama persis kayak
// sebelumnya.
// ============================================================================

const SMOOTH_EASE = [0.22, 1, 0.36, 1];

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function AvatarCircle({ name, avatarUrl, accentFrom, accentTo, size = 40, ring = false }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-bold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
        fontSize: size * 0.36,
        boxShadow: ring ? `0 0 0 3px rgb(var(--base)), 0 0 0 4px ${accentTo}55` : undefined,
      }}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

// Semburan titik kecil pas berhasil absen.
function CheckinBurst({ color }) {
  const dots = React.useMemo(() => Array.from({ length: 14 }, (_, i) => i), []);
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {dots.map((i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const distance = 64 + ((i * 33) % 44);
        return (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ background: color }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: 0.3,
            }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function ClosableMessage({ title, description }) {
  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-base px-6">
      <div className="text-center max-w-sm">
        <h1 className="font-display font-extrabold text-2xl text-ink mb-2">{title}</h1>
        <p className="text-sm text-ink-muted mb-6">{description}</p>
        <Link href="/">
          <Button variant="secondary">Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
}

// Badge status sesi kecil di pojok kartu terminal.
function StatusPill({ status, countdownLabel }) {
  const dotColor =
    status === "aktif" ? "bg-emerald-400" : status === "akan-datang" ? "bg-amber-400" : "bg-ink-dim";
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-xs font-semibold text-ink-muted dark:border-white/10 dark:bg-white/[0.05]">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor} ${status === "aktif" ? "animate-pulse" : ""}`} />
      <Clock size={12} />
      {countdownLabel}
    </div>
  );
}

function AttendanceRoomInner({
  roomId,
  session,
  division,
  records: initialRecords,
  hasCheckedIn: initialHasCheckedIn,
  currentUser,
}) {
  const { toast } = useToast();
  const [records, setRecords] = React.useState(initialRecords);
  const [hasCheckedIn, setHasCheckedIn] = React.useState(initialHasCheckedIn);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [burstKey, setBurstKey] = React.useState(0);
  const [now, setNow] = React.useState(() => Date.now());
  // `celebrate` cuma true SESAAT setelah absen baru berhasil (bukan pas
  // reload halaman yang memang udah pernah absen sebelumnya).
  const [celebrate, setCelebrate] = React.useState(false);

  // Tick tiap detik buat hitungan mundur & label "X menit lalu".
  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sesudah animasi sukses (checkmark + burst) sempat kelihatan, matiin
  // `celebrate` -> area absen collapse, list di bawah geser naik.
  React.useEffect(() => {
    if (!celebrate) return;
    const timer = setTimeout(() => setCelebrate(false), 1900);
    return () => clearTimeout(timer);
  }, [celebrate]);

  // Pakai toLocalWallClock, BUKAN new Date(session.starts_at) langsung --
  // supaya "07:00" yang diset admin kebaca 07:00 di jam HP member ini,
  // apa pun zona waktunya.
  const startsAt = React.useMemo(() => toLocalWallClock(session.starts_at).getTime(), [session]);
  const endsAt = React.useMemo(() => toLocalWallClock(session.ends_at).getTime(), [session]);

  const status = now < startsAt ? "akan-datang" : now < endsAt ? "aktif" : "berakhir";

  const countdownLabel =
    status === "akan-datang"
      ? `Mulai dalam ${formatCountdown(startsAt - now)}`
      : status === "aktif"
      ? `Berakhir dalam ${formatCountdown(endsAt - now)}`
      : "Sesi sudah berakhir";

  const handleAbsen = async () => {
    setIsSubmitting(true);
    // Server gak otomatis tau device ini ada di zona waktu mana --
    // dikirim eksplisit biar validasi jam sesi di server konsisten
    // sama status yang udah ditampilkan di layar.
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
    const result = await checkInToSession(roomId, timeZone);
    setIsSubmitting(false);

    if (result.unauthenticated) {
      toast({
        variant: "error",
        title: "Sesi login habis",
        description: "Silakan masuk lagi, lalu buka ulang link ini.",
      });
      return;
    }
    if (result.error) {
      toast({ variant: "error", title: "Gagal absen", description: result.error });
      return;
    }

    if (!hasCheckedIn) {
      setRecords((prev) => [
        {
          id: `me-${Date.now()}`,
          full_name: currentUser.fullName,
          member_id: currentUser.id,
          checked_in_at: new Date().toISOString(),
          avatar_url: currentUser.avatarUrl,
        },
        ...prev,
      ]);
      setCelebrate(true);
    }
    setHasCheckedIn(true);
    setBurstKey((k) => k + 1);
  };

  const canCheckIn = status === "aktif" && !hasCheckedIn && !isSubmitting;
  const firstName = currentUser.fullName.trim().split(/\s+/)[0];

  return (
    <div className="relative min-h-screen bg-base">
      {/* ---- Ambient particle field, warnanya ngikut accent divisi ---- */}
      <div className="fixed inset-0 overflow-hidden">
        <ParticleField colorFrom={division.accentFrom} colorTo={division.accentTo} />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[90vw] h-[60vw] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})` }}
        />
      </div>

      <Link
        href="/"
        aria-label="Tutup"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-base/70 backdrop-blur-md hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10 transition-colors text-ink"
      >
        <X size={18} />
      </Link>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-5 py-20 sm:py-24">
        {/* ---- Header: label divisi + judul terminal ---- */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SMOOTH_EASE }}
          className="flex flex-col items-center gap-3 text-center mb-6"
        >
          <span
            className="font-body font-semibold text-[11px] tracking-[0.35em] uppercase px-4 py-1.5 rounded-full text-white"
            style={{ background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})` }}
          >
            Terminal Absensi &middot; {division.name}
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink leading-tight">
            Halo, {firstName}
          </h1>
        </motion.div>

        {/* ---- Kartu terminal utama (spotlight card) ---- */}
        <SpotlightCard glowFrom={division.accentFrom} glowTo={division.accentTo} className="w-full">
          <div className="flex flex-col items-center gap-6 px-6 py-10 sm:px-10 sm:py-12 text-center">
            <AvatarCircle
              name={currentUser.fullName}
              avatarUrl={currentUser.avatarUrl}
              accentFrom={division.accentFrom}
              accentTo={division.accentTo}
              size={64}
              ring
            />

            <StatusPill status={status} countdownLabel={countdownLabel} />

            {/* ---- Area absen: form vs sukses ---- */}
            <motion.div layout className="w-full flex flex-col items-center gap-4">
              <AnimatePresence mode="popLayout">
                {!hasCheckedIn && (
                  <motion.div
                    key="form"
                    layout
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex flex-col items-center gap-4"
                  >
                    <div className="relative">
                      <motion.div
                        animate={status === "aktif" ? { scale: [1, 1.04, 1] } : {}}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                      >
                        {status === "aktif" && (
                          <span
                            className="pointer-events-none absolute inset-0 rounded-full animate-ping opacity-30"
                            style={{
                              background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
                            }}
                          />
                        )}
                        <MagneticButton
                          onClick={handleAbsen}
                          disabled={!canCheckIn}
                          colorFrom={division.accentFrom}
                          colorTo={division.accentTo}
                          className="h-28 w-28 flex-col gap-1"
                          style={{ boxShadow: `0 12px 34px -10px ${division.accentTo}80` }}
                        >
                          <Fingerprint size={24} />
                          <span className="text-sm">{isSubmitting ? "..." : "Absen"}</span>
                        </MagneticButton>
                      </motion.div>
                    </div>

                    {status === "akan-datang" && (
                      <p className="text-xs text-ink-dim">Tombol absen aktif otomatis begitu sesi dimulai.</p>
                    )}
                    {status === "berakhir" && (
                      <p className="text-xs text-ink-dim">Kamu tidak absen di sesi ini -- waktunya sudah habis.</p>
                    )}
                    {status === "aktif" && (
                      <p className="text-xs text-ink-dim">Tap tombol di atas buat nandain kamu hadir.</p>
                    )}
                  </motion.div>
                )}

                {hasCheckedIn && celebrate && (
                  <motion.div
                    key="success"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: SMOOTH_EASE }}
                    className="relative flex flex-col items-center gap-3"
                  >
                    <div className="relative h-28 w-28 flex items-center justify-center">
                      <AnimatePresence>
                        {burstKey > 0 && <CheckinBurst key={burstKey} color={division.accentTo} />}
                      </AnimatePresence>
                      <div
                        className="relative h-28 w-28 rounded-full flex items-center justify-center text-white"
                        style={{
                          background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
                          boxShadow: `0 12px 40px -8px ${division.accentTo}88`,
                        }}
                      >
                        <Check size={32} strokeWidth={3} />
                      </div>
                    </div>
                    <p className="font-display font-bold text-base text-ink">Absen berhasil, {firstName}!</p>
                    <p className="text-xs text-ink-muted">Kamu tercatat aktif buat sesi ini.</p>
                  </motion.div>
                )}

                {hasCheckedIn && !celebrate && (
                  <motion.div
                    key="already"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-xs font-semibold text-ink-muted dark:border-white/10 dark:bg-white/[0.05]"
                  >
                    <Check size={13} className="text-emerald-500" />
                    Kamu sudah tercatat hadir
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </SpotlightCard>

        {/* ---- List yang sudah absen ---- */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: SMOOTH_EASE }}
          className="w-full mt-8"
        >
          <div className="flex items-center justify-center gap-2 mb-5 text-ink">
            <Users size={15} className="text-ink-muted" />
            <span className="font-body font-semibold text-sm">{records.length} anggota sudah absen</span>
          </div>

          <ul
            data-lenis-prevent
            className="grid grid-cols-3 sm:grid-cols-4 justify-items-center gap-x-3 gap-y-6 max-h-[40vh] overflow-y-auto px-1 py-1"
          >
            <AnimatePresence initial={false}>
              {records.map((member) => (
                <motion.li
                  key={member.id}
                  layout
                  initial={{ opacity: 0, y: -12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: SMOOTH_EASE }}
                  className="flex flex-col items-center gap-2 text-center w-full"
                >
                  <AvatarCircle
                    name={member.full_name}
                    avatarUrl={member.avatar_url}
                    accentFrom={division.accentFrom}
                    accentTo={division.accentTo}
                    size={52}
                  />
                  <div className="min-w-0 w-full">
                    <p className="font-body font-semibold text-xs text-ink truncate">
                      {member.full_name}
                      {member.member_id === currentUser.id ? " (kamu)" : ""}
                    </p>
                    <p className="text-[11px] text-ink-dim">{timeAgoLabel(member.checked_in_at, now)}</p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-dim hover:text-ink transition-colors"
        >
          <ArrowLeft size={13} />
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}

export default function AttendanceRoom({ roomId, session, division, records, hasCheckedIn, currentUser }) {
  // Room tidak dikenali / link salah / sesi sudah dihapus admin.
  if (!session || !division) {
    return (
      <ClosableMessage
        title="Link Absensi Tidak Valid"
        description="Room absensi ini tidak ditemukan atau sudah tidak aktif. Coba minta link terbaru ke admin divisi kamu."
      />
    );
  }

  // Sudah login tapi bukan akun member terdaftar.
  if (!currentUser) {
    return (
      <ClosableMessage
        title="Data Member Tidak Ditemukan"
        description="Akun kamu belum terdaftar sebagai anggota. Hubungi admin divisi kamu, ya."
      />
    );
  }

  return (
    <ToastProvider>
      <AttendanceRoomInner
        roomId={roomId}
        session={session}
        division={division}
        records={records}
        hasCheckedIn={hasCheckedIn}
        currentUser={currentUser}
      />
    </ToastProvider>
  );
}
