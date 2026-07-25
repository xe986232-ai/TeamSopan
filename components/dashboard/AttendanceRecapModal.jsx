"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, UserCheck, UserX, FileDown, Loader2 } from "lucide-react";
import { DIVISIONS_ABSENSI } from "@/lib/absensi";

function initials(name) {
  return (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDateTimeFull(iso) {
  return new Date(iso).toLocaleString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Rekap kehadiran 1 sesi absensi -- muncul waktu admin klik "Lihat" di
// daftar sesi (/dashboard/absensi). Nampilin 2 tabel: yang hadir (lengkap
// jam absen) dan yang tidak hadir, plus tombol download PDF buat arsip
// per tanggal sesi (biar admin gak perlu buka dashboard lagi kalau perlu
// data lama).
export default function AttendanceRecapModal({ data, onClose }) {
  const [isExporting, setIsExporting] = React.useState(false);
  const { session, hadir, tidakHadir } = data;
  const division = DIVISIONS_ABSENSI[session.division];
  const total = hadir.length + tidakHadir.length;
  const pct = total > 0 ? Math.round((hadir.length / total) * 100) : 0;

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const [{ default: jsPDF }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const marginX = 40;
      let y = 50;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Rekap Absensi - SOPAN TEAM", marginX, y);

      y += 22;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Divisi: ${division?.name || session.division}`, marginX, y);
      y += 16;
      doc.text(`Tanggal: ${formatDateTimeFull(session.starts_at)}`, marginX, y);
      y += 16;
      doc.text(
        `Jam sesi: ${formatTime(session.starts_at)} - ${formatTime(session.ends_at)}`,
        marginX,
        y
      );
      y += 16;
      doc.text(
        `Total: ${hadir.length} hadir / ${total} anggota (${pct}%)`,
        marginX,
        y
      );

      y += 20;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Hadir (${hadir.length})`, marginX, y);

      autoTableSafe(doc, {
        startY: y + 8,
        margin: { left: marginX, right: marginX },
        head: [["No", "Nama", "Jam Absen"]],
        body: hadir.map((m, i) => [
          String(i + 1),
          m.fullName,
          formatTime(m.checkedInAt),
        ]),
        headStyles: { fillColor: [22, 119, 245] },
        styles: { fontSize: 10 },
      });

      let nextY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 26 : y + 40;
      if (nextY > 760) {
        doc.addPage();
        nextY = 50;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Tidak Hadir (${tidakHadir.length})`, marginX, nextY);

      autoTableSafe(doc, {
        startY: nextY + 8,
        margin: { left: marginX, right: marginX },
        head: [["No", "Nama"]],
        body: tidakHadir.map((m, i) => [String(i + 1), m.fullName]),
        headStyles: { fillColor: [239, 68, 68] },
        styles: { fontSize: 10 },
      });

      const dateSlug = new Date(session.starts_at)
        .toISOString()
        .slice(0, 10);
      doc.save(
        `absensi-${session.division}-${dateSlug}.pdf`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center bg-black/40 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-black/[0.06] p-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, ${division?.accentFrom}, ${division?.accentTo})`,
                }}
              >
                {division?.name || session.division}
              </span>
              <span className="text-xs text-black/40">
                {formatTime(session.starts_at)} - {formatTime(session.ends_at)}
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-[#111827]">
              {formatDateTimeFull(session.starts_at)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black/40 hover:bg-black/5 hover:text-black/70 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Ringkasan */}
        <div className="grid grid-cols-3 gap-3 p-5 pb-0">
          <div className="rounded-xl bg-black/[0.03] p-3">
            <div className="flex items-center gap-1.5 text-black/40 mb-1">
              <Users size={13} />
              <span className="text-[11px] font-medium">Total</span>
            </div>
            <p className="font-display font-bold text-xl text-[#111827]">
              {total}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3">
            <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
              <UserCheck size={13} />
              <span className="text-[11px] font-medium">Hadir</span>
            </div>
            <p className="font-display font-bold text-xl text-emerald-700">
              {hadir.length}{" "}
              <span className="text-xs font-medium text-emerald-600">
                ({pct}%)
              </span>
            </p>
          </div>
          <div className="rounded-xl bg-rose-50 p-3">
            <div className="flex items-center gap-1.5 text-rose-600 mb-1">
              <UserX size={13} />
              <span className="text-[11px] font-medium">Tidak Hadir</span>
            </div>
            <p className="font-display font-bold text-xl text-rose-700">
              {tidakHadir.length}
            </p>
          </div>
        </div>

        {/* Isi (scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <section>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-2.5">
              <UserCheck size={13} /> Hadir ({hadir.length})
            </p>
            {hadir.length === 0 ? (
              <p className="text-xs text-black/40 py-3">
                Belum ada yang absen di sesi ini.
              </p>
            ) : (
              <div className="rounded-xl border border-black/[0.06] overflow-hidden">
                {hadir.map((m, i) => (
                  <div
                    key={m.id}
                    className={`flex items-center gap-3 px-3.5 py-2.5 ${
                      i !== hadir.length - 1 ? "border-b border-black/[0.05]" : ""
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full overflow-hidden bg-emerald-100 text-[10px] font-bold text-emerald-700">
                      {m.avatarUrl ? (
                        <img
                          src={m.avatarUrl}
                          alt={m.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials(m.fullName)
                      )}
                    </span>
                    <p className="flex-1 min-w-0 truncate text-sm text-[#111827]">
                      {m.fullName}
                    </p>
                    <span className="shrink-0 text-xs font-medium text-emerald-600">
                      {formatTime(m.checkedInAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 mb-2.5">
              <UserX size={13} /> Tidak Hadir ({tidakHadir.length})
            </p>
            {tidakHadir.length === 0 ? (
              <p className="text-xs text-black/40 py-3">
                Semua anggota divisi ini sudah absen. Mantap!
              </p>
            ) : (
              <div className="rounded-xl border border-black/[0.06] overflow-hidden">
                {tidakHadir.map((m, i) => (
                  <div
                    key={m.id}
                    className={`flex items-center gap-3 px-3.5 py-2.5 ${
                      i !== tidakHadir.length - 1
                        ? "border-b border-black/[0.05]"
                        : ""
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full overflow-hidden bg-rose-100 text-[10px] font-bold text-rose-600">
                      {m.avatarUrl ? (
                        <img
                          src={m.avatarUrl}
                          alt={m.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials(m.fullName)
                      )}
                    </span>
                    <p className="flex-1 min-w-0 truncate text-sm text-[#111827]">
                      {m.fullName}
                    </p>
                    <span className="shrink-0 text-[11px] font-medium text-rose-500">
                      Absen
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-black/[0.06] p-4">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <FileDown size={15} />
            )}
            Download Data Absensi (PDF)
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// jspdf-autotable nempel diri ke prototype jsPDF pas di-import (side
// effect), tapi di beberapa versi expose-nya lewat `doc.autoTable(...)`.
// Wrapper kecil ini biar pemanggilnya gak perlu peduli detail itu.
function autoTableSafe(doc, options) {
  if (typeof doc.autoTable === "function") {
    doc.autoTable(options);
  }
}
