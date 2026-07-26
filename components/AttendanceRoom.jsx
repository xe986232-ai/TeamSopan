"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Users, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { SwipeButton } from "./ui/swipe-button";
import { ToastProvider, useToast } from "./ui/toast";
import { formatCountdown, timeAgoLabel, toLocalWallClock } from "@/lib/absensi";
import { checkInToSession } from "@/app/absensi/[roomId]/actions";

const SMOOTH_EASE = [0.22, 1, 0.36, 1];

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function AvatarCircle({ name, avatarUrl, accentFrom, accentTo, size = 40 }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-bold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
        fontSize: size * 0.36,
      }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}

function ClosableMessage({ title, description }) {
  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-base px-6">
      <div className="text-center max-w-sm">
        <h1 className="font-display font-extrabold text-2xl text-ink mb-2">
          {title}
        </h1>
        <p className="text-sm text-ink-muted mb-6">{description}</p>
        <Link href="/">
          <Button variant="secondary">Kembali ke Beranda</Button>
        </Link>
      </div>
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
  const [showIntro, setShowIntro] = React.useState(true);
  const [now, setNow] = React.useState(() => Date.now());
  // `celebrate` cuma true SESAAT setelah absen baru berhasil (bukan pas
  // reload halaman yang memang udah pernah absen sebelumnya) -- dipakai
  // buat nampilin animasi checkmark bentar, terus otomatis di-fade-out
  // biar list "yang sudah absen" di bawahnya naik ngisi tempat kosong.
  const [celebrate, setCelebrate] = React.useState(false);

  // Tick tiap detik buat hitungan mundur & label "X menit lalu".
  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Sesudah animasi sukses (checkmark + burst) sempat kelihatan ~1.9
  // detik, matiin `celebrate` -> area absen di-unmount, motion.div-nya
  // fade + collapse (lihat exit di bawah), list yang sudah absen otomatis
  // naik ngisi ruang yang kosong.
  React.useEffect(() => {
    if (!celebrate) return;
    const timer = setTimeout(() => setCelebrate(false), 1900);
    return () => clearTimeout(timer);
  }, [celebrate]);

  // Pakai toLocalWallClock, BUKAN new Date(session.starts_at) langsung --
  // supaya "07:00" yang diset admin kebaca 07:00 di jam HP member ini,
  // apa pun zona waktunya (WIB/WITA/WIT/dll), bukan digeser ke 1 momen
  // absolut yang sama buat semua orang.
  const startsAt = React.useMemo(
    () => toLocalWallClock(session.starts_at).getTime(),
    [session]
  );
  const endsAt = React.useMemo(
    () => toLocalWallClock(session.ends_at).getTime(),
    [session]
  );

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
    // sama status yang udah ditampilkan di layar (lihat lib/timezone.js).
    const timeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
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
  };

  const canCheckIn = status === "aktif" && !hasCheckedIn && !isSubmitting;
  const firstName = currentUser.fullName.trim().split(/\s+/)[0];

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
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[85vw] h-[60vw] rounded-full opacity-[0.12] blur-3xl"
          style={{
            background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
          }}
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
            <AvatarCircle
              name={currentUser.fullName}
              avatarUrl={currentUser.avatarUrl}
              accentFrom={division.accentFrom}
              accentTo={division.accentTo}
              size={72}
            />
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink leading-tight">
              Halo, {firstName}
            </h1>
            <p className="text-sm text-ink-muted max-w-sm">
              Klik tombol di bawah buat nandain kamu masih aktif di SOPAN
              TEAM. Jangan sampai kelewatan, ya!
            </p>

            <div className="flex items-center gap-1.5 mt-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-ink-muted">
              <Clock size={13} />
              {countdownLabel}
            </div>
          </motion.div>

          {/* ---- Area absen ---- */}
          {/* `layout` di wrapper ini + mode="popLayout" di AnimatePresence
              bikin tingginya ikut animasi pas kontennya berubah (form ->
              sukses -> hilang), bukan lompat tiba-tiba. Pas `celebrate`
              balik ke false (lihat useEffect timer di atas), branch
              "success" di-unmount total -- areanya collapse dengan fade,
              dan List di bawah (yang juga dikasih `layout`) otomatis
              geser naik ngisi tempat kosong. */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: SMOOTH_EASE }}
            className="w-full flex flex-col items-center gap-5"
          >
            <AnimatePresence mode="popLayout">
              {!hasCheckedIn && (
                <motion.div
                  key="form"
                  layout
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: SMOOTH_EASE }}
                  className="w-full flex flex-col items-center gap-5"
                >
                  <SwipeButton
                    text={isSubmitting ? "Memproses..." : "Geser untuk absen"}
                    onSwipeComplete={handleAbsen}
                    disabled={!canCheckIn || isSubmitting}
                  />

                  {status === "akan-datang" && (
                    <p className="text-xs text-ink-dim">
                      Tombol absen aktif otomatis begitu sesi dimulai.
                    </p>
                  )}
                  {status === "berakhir" && (
                    <p className="text-xs text-ink-dim">
                      Kamu tidak absen di sesi ini -- waktunya sudah habis.
                    </p>
                  )}
                </motion.div>
              )}
              {hasCheckedIn && celebrate && (
                <motion.div
                  key="success"
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, ease: SMOOTH_EASE }}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className="relative flex h-10 w-[250px] items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
                      boxShadow: `0 8px 24px -8px ${division.accentTo}88`,
                    }}
                  >
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, ease: SMOOTH_EASE, delay: 0.05 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20"
                    >
                      <Check size={13} strokeWidth={3} />
                    </motion.span>
                    Absen berhasil, {firstName}!
                  </div>
                  <p className="text-xs text-ink-muted">
                    Kamu tercatat aktif buat sesi ini.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ---- List yang sudah absen ---- */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: SMOOTH_EASE }}
            className="w-full mt-4"
          >
            <div className="flex items-center justify-center gap-2 mb-5 text-ink">
              <Users size={16} className="text-ink-muted" />
              <span className="font-body font-semibold text-sm">
                {records.length} anggota sudah absen
              </span>
            </div>

            <ul
              data-lenis-prevent
              className="grid grid-cols-3 sm:grid-cols-4 justify-items-center gap-x-3 gap-y-6 max-h-[45vh] overflow-y-auto px-1 py-1"
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
                      size={56}
                    />
                    <div className="min-w-0 w-full">
                      <p className="font-body font-semibold text-xs text-ink truncate">
                        {member.full_name}
                        {member.member_id === currentUser.id ? " (kamu)" : ""}
                      </p>
                      <p className="text-[11px] text-ink-dim">
                        {timeAgoLabel(member.checked_in_at, now)}
                      </p>
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

export default function AttendanceRoom({
  roomId,
  session,
  division,
  records,
  hasCheckedIn,
  currentUser,
}) {
  // Room tidak dikenali / link salah / sesi sudah dihapus admin.
  if (!session || !division) {
    return (
      <ClosableMessage
        title="Link Absensi Tidak Valid"
        description="Room absensi ini tidak ditemukan atau sudah tidak aktif. Coba minta link terbaru ke admin divisi kamu."
      />
    );
  }

  // Sudah login tapi bukan akun member terdaftar (mis. akun admin tanpa
  // baris di tabel members).
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
