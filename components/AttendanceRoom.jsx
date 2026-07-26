"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Users, Clock, Send } from "lucide-react";
import { Button } from "./ui/button";
import { SwipeButton } from "./ui/swipe-button";
import { ToastProvider, useToast } from "./ui/toast";
import { cn } from "@/lib/utils";
import {
  formatCountdown,
  timeAgoLabel,
  toLocalWallClock,
  QUICK_REACTIONS,
} from "@/lib/absensi";
import {
  checkInToSession,
  sendMessage,
  toggleReaction,
} from "@/app/absensi/[roomId]/actions";

const SMOOTH_EASE = [0.22, 1, 0.36, 1];

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function AvatarCircle({ name, avatarUrl, size = 40 }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-bold bg-ink-solid text-white dark:bg-white dark:text-ink-solid"
      style={{
        width: size,
        height: size,
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

// Bubble chat kecil di atas avatar member yang sudah absen -- bentuknya
// modif dari bubble shadcn/ui biasa: dikasih "ekor" (kotak kecil diputar
// 45 derajat) di bawah bubble yang nunjuk ke avatar pemiliknya, sekaligus
// baris reaction emoji di bawahnya (tap buat toggle reaksi).
function MessageBubble({ message, reactionList, currentUserId, onToggleReaction }) {
  const isMine = message.member_id === currentUserId;
  const counts = {};
  for (const r of reactionList) {
    counts[r.emoji] = (counts[r.emoji] || 0) + 1;
  }
  const myEmojis = new Set(
    reactionList.filter((r) => r.member_id === currentUserId).map((r) => r.emoji)
  );

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <div
          className={cn(
            "max-w-[108px] rounded-2xl px-2.5 py-1.5 text-left text-[10px] leading-snug wrap-break-word",
            isMine
              ? "bg-ink-solid text-white dark:bg-white dark:text-ink-solid"
              : "bg-base-elevated border border-base-line text-ink"
          )}
        >
          {message.message}
        </div>
        {/* Ekor bubble -- nunjuk ke avatar pemiliknya di bawah */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-1/2 -bottom-[4px] h-2 w-2 -translate-x-1/2 rotate-45",
            isMine
              ? "bg-ink-solid dark:bg-white"
              : "border-b border-r border-base-line bg-base-elevated"
          )}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-1">
        {QUICK_REACTIONS.map((emoji) => {
          const count = counts[emoji] || 0;
          const active = myEmojis.has(emoji);
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => onToggleReaction(message.id, emoji)}
              className={cn(
                "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] leading-none transition-colors",
                active
                  ? "bg-ink-solid text-white dark:bg-white dark:text-ink-solid"
                  : count > 0
                  ? "bg-black/[0.05] text-ink-muted dark:bg-white/10"
                  : "text-ink-dim/50 hover:text-ink-dim"
              )}
            >
              <span>{emoji}</span>
              {count > 0 && <span>{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
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
  messages: initialMessages,
  reactions: initialReactions,
  currentUser,
}) {
  const { toast } = useToast();
  const [records, setRecords] = React.useState(initialRecords);
  const [hasCheckedIn, setHasCheckedIn] = React.useState(initialHasCheckedIn);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [now, setNow] = React.useState(() => Date.now());
  // Pesan/status singkat tiap member, di-key pakai member_id -- cuma
  // pesan TERAKHIR tiap orang yang disimpan (lihat dedupe di
  // app/absensi/[roomId]/page.js), jadi kirim pesan baru otomatis
  // menimpa bubble lama di sini juga.
  const [messages, setMessages] = React.useState(() => {
    const map = {};
    for (const m of initialMessages || []) map[m.member_id] = m;
    return map;
  });
  // Reaksi emoji, di-key pakai message_id -> array {id, member_id, emoji}.
  const [reactions, setReactions] = React.useState(() => {
    const map = {};
    for (const r of initialReactions || []) {
      if (!map[r.message_id]) map[r.message_id] = [];
      map[r.message_id].push(r);
    }
    return map;
  });
  const [draft, setDraft] = React.useState("");
  const [isSendingMessage, setIsSendingMessage] = React.useState(false);
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || isSendingMessage) return;

    setIsSendingMessage(true);
    const result = await sendMessage(roomId, text);
    setIsSendingMessage(false);

    if (result.unauthenticated) {
      toast({
        variant: "error",
        title: "Sesi login habis",
        description: "Silakan masuk lagi, lalu buka ulang link ini.",
      });
      return;
    }
    if (result.error) {
      toast({ variant: "error", title: "Gagal kirim pesan", description: result.error });
      return;
    }

    setMessages((prev) => ({ ...prev, [currentUser.id]: result.message }));
    setDraft("");
  };

  const handleToggleReaction = async (messageId, emoji) => {
    // Optimistic: langsung update tampilan reaksi sebelum server jawab,
    // biar tap-nya kerasa instan. Kalau ternyata gagal, tinggal kasih
    // toast error -- tidak fatal karena reaksi cuma pemanis, bukan data
    // krusial kayak absen.
    setReactions((prev) => {
      const list = prev[messageId] || [];
      const mine = list.find(
        (r) => r.member_id === currentUser.id && r.emoji === emoji
      );
      const nextList = mine
        ? list.filter((r) => r !== mine)
        : [...list, { id: `tmp-${Date.now()}`, member_id: currentUser.id, emoji }];
      return { ...prev, [messageId]: nextList };
    });

    const result = await toggleReaction(roomId, messageId, emoji);
    if (result?.error) {
      toast({ variant: "error", title: "Gagal reaksi", description: result.error });
    }
  };

  return (
    <>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-[6000] flex flex-col items-center overflow-y-auto bg-base"
      >
        <Link
          href="/"
          aria-label="Tutup"
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors text-ink"
        >
          <X size={18} />
        </Link>

        <div className="relative z-10 w-full max-w-lg mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <span className="font-body font-semibold text-xs tracking-[0.3em] uppercase px-4 py-1.5 rounded-full bg-base-elevated border border-base-line text-ink-muted">
              Divisi {division.name}
            </span>
            <AvatarCircle
              name={currentUser.fullName}
              avatarUrl={currentUser.avatarUrl}
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
          </div>

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
                  <div className="relative flex h-10 w-[250px] items-center justify-center gap-2 rounded-lg text-sm font-semibold bg-ink-solid text-white dark:bg-white dark:text-ink-solid">
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, ease: SMOOTH_EASE, delay: 0.05 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 dark:bg-ink-solid/10"
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
          <motion.div layout className="w-full mt-4">
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
                    {messages[member.member_id] && (
                      <MessageBubble
                        message={messages[member.member_id]}
                        reactionList={
                          reactions[messages[member.member_id].id] || []
                        }
                        currentUserId={currentUser.id}
                        onToggleReaction={handleToggleReaction}
                      />
                    )}
                    <AvatarCircle
                      name={member.full_name}
                      avatarUrl={member.avatar_url}
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

        {/* ---- Input pesan/status singkat ---- */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-base-line bg-base/95 backdrop-blur px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
          <form
            onSubmit={handleSendMessage}
            className="mx-auto flex max-w-lg items-center gap-2"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                hasCheckedIn ? "Tulis sesuatu..." : "Absen dulu buat bisa kirim pesan"
              }
              disabled={!hasCheckedIn || isSendingMessage}
              maxLength={140}
              className="h-10 flex-1 rounded-full border border-base-line bg-base-elevated px-4 text-sm text-ink placeholder:text-ink-dim focus:outline-none focus:ring-2 focus:ring-ink-solid/15 disabled:opacity-50 dark:focus:ring-white/15"
            />
            <button
              type="submit"
              disabled={!hasCheckedIn || !draft.trim() || isSendingMessage}
              aria-label="Kirim pesan"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-solid text-white transition-opacity disabled:opacity-40 dark:bg-white dark:text-ink-solid"
            >
              <Send size={16} />
            </button>
          </form>
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
  messages,
  reactions,
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
        messages={messages}
        reactions={reactions}
        currentUser={currentUser}
      />
    </ToastProvider>
  );
}
