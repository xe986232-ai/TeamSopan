"use client";

import * as React from "react";
import { Users, Copy, Check, Trash2 } from "lucide-react";
import DivisionBadge from "./DivisionBadge";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useToast } from "@/components/ui/toast";
import { getSessionStatus } from "@/lib/absensi";
import { deleteAttendanceSession } from "@/app/dashboard/absensi/actions";

const STATUS_LABEL = {
  "akan-datang": { label: "Akan datang", className: "bg-black/[0.06] text-black/60" },
  aktif: { label: "Aktif", className: "bg-emerald-100 text-emerald-700" },
  berakhir: { label: "Berakhir", className: "bg-black/[0.04] text-black/40" },
};

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AttendanceSessionsList({ initialSessions }) {
  const { toast } = useToast();
  const [sessions, setSessions] = React.useState(initialSessions);
  const [now, setNow] = React.useState(() => Date.now());
  const [copiedId, setCopiedId] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Cukup refresh tiap 15 detik -- ini cuma buat status badge (akan
  // datang/aktif/berakhir) di daftar admin, bukan hitungan mundur detail
  // (itu ada di halaman /absensi/[roomId] yang dilihat member).
  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = async (session) => {
    const link = `${window.location.origin}/absensi/${session.roomId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(session.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast({ variant: "error", title: "Gagal menyalin link" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await deleteAttendanceSession(deleteTarget.id);
    setIsDeleting(false);

    if (result.error) {
      toast({ variant: "error", title: "Gagal menghapus sesi", description: result.error });
      return;
    }

    setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast({ variant: "success", title: "Sesi dihapus" });
  };

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-black/[0.06] p-6 text-center text-sm text-black/40">
        Belum ada sesi absensi. Buat sesi baru lewat form di atas.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-black/[0.06] overflow-hidden">
        {sessions.map((session, i) => {
          const status = getSessionStatus(session, now);
          const pct =
            session.totalMembers > 0
              ? Math.round((session.attendeeCount / session.totalMembers) * 100)
              : 0;

          return (
            <div
              key={session.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 ${
                i !== sessions.length - 1 ? "border-b border-black/[0.06]" : ""
              }`}
            >
              <div className="shrink-0">
                <DivisionBadge divisionId={session.division} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-sm text-[#111827]">
                  {formatDateTime(session.startsAt)}
                  <span className="text-black/40 font-normal">
                    {" "}
                    → {formatDateTime(session.endsAt)}
                  </span>
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_LABEL[status].className}`}
              >
                {STATUS_LABEL[status].label}
              </span>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-black/50 shrink-0">
                <Users size={13} />
                {session.attendeeCount}/{session.totalMembers || "-"} hadir
              </div>

              {session.totalMembers > 0 && (
                <div className="w-24 shrink-0">
                  <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1677F5]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(session)}
                  aria-label="Salin link sesi"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-black/50 hover:bg-black/5 hover:text-black/80 transition-colors"
                >
                  {copiedId === session.id ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(session)}
                  aria-label="Hapus sesi"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-black/40 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Hapus sesi absensi ini?"
          description="Link absensi ini akan mati dan semua catatan kehadiran di sesi ini ikut terhapus permanen."
          isPending={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
