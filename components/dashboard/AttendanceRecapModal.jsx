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

// Ukuran target avatar di PDF cuma radius 9.5pt (~19pt diameter). Resize
// ke 96x96px sudah lebih dari cukup tajam buat print, termasuk buffer
// buat retina/high-DPI, tanpa perlu numpuk byte foto resolusi asli.
const AVATAR_TARGET_PX = 96;

// Cek apakah blob gambar itu PNG dengan alpha channel transparan -- kalau
// iya, JPEG (yang gak support transparansi) bakal nge-flatten background
// jadi hitam, jadi mendingan tetap fallback ke PNG kecil buat kasus ini.
function blobLooksLikePng(blob) {
  return blob?.type === "image/png";
}

// Resize + kompres ulang foto profil lewat <canvas> sebelum ditempel ke
// PDF. Gambar sumber bisa beresolusi tinggi (foto HP jaman sekarang, bisa
// ratusan KB - beberapa MB), padahal di PDF cuma tampil sebagai lingkaran
// kecil -- jadi di sini kita gambar ke canvas kecil (96x96), lalu encode
// ulang jadi JPEG kualitas sedang (quality 0.7) supaya ukuran file PDF
// akhir gak membengkak walau ada banyak member dengan avatar HD.
async function resizeImageForPdf(blob) {
  const bitmap = await createImageBitmap(blob);
  try {
    const size = AVATAR_TARGET_PX;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Crop tengah jadi persegi dulu (biar avatar gak gepeng) baru di-draw
    // mengisi penuh kanvas 96x96.
    const srcSize = Math.min(bitmap.width, bitmap.height);
    const srcX = (bitmap.width - srcSize) / 2;
    const srcY = (bitmap.height - srcSize) / 2;
    ctx.drawImage(bitmap, srcX, srcY, srcSize, srcSize, 0, 0, size, size);

    const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.7);

    // PNG transparan yang di-flatten ke JPEG bakal keliatan background
    // hitam -- kalau sumbernya PNG, fallback ke PNG kecil biar transparansi
    // tetap aman (ukurannya tetap jauh lebih kecil krn udah di-resize).
    if (blobLooksLikePng(blob)) {
      return canvas.toDataURL("image/png");
    }

    return jpegDataUrl;
  } finally {
    bitmap.close?.();
  }
}

// Foto profil member disimpan sebagai URL (Supabase Storage) -- jsPDF
// cuma bisa nempelin gambar dari data URL (base64), jadi tiap foto perlu
// di-fetch & dikonversi dulu sebelum tabel digambar. Fotonya di-resize +
// dikompres ulang jadi kecil di sini (bukan dipakai apa adanya dari
// fetch) karena di PDF cuma ditampilkan sebagai lingkaran ~19pt -- kalau
// dipakai resolusi asli, 20-30 avatar HD bakal numpuk bikin ukuran file
// PDF membengkak. Kalau gagal (foto dihapus, offline, resize error, dll),
// balikin null -- nanti fallback ke lingkaran inisial di dalam sel tabel,
// bukan bikin export gagal total.
async function loadImageAsDataUrl(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await resizeImageForPdf(blob);
  } catch {
    return null;
  }
}

function imageFormatFromDataUrl(dataUrl) {
  const match = /^data:image\/(png|jpeg|jpg|webp)/i.exec(dataUrl || "");
  if (!match) return "JPEG";
  const ext = match[1].toLowerCase();
  if (ext === "png") return "PNG";
  if (ext === "webp") return "WEBP";
  return "JPEG";
}

// Lingkaran tipis abu-abu di belakang avatar buat efek shadow -- pakai
// GState biar transparan (opacity rendah), jadi ngena tapi tetep halus,
// bukan bayangan item pekat.
function drawAvatarShadow(doc, cx, cy, r) {
  doc.saveGraphicsState();
  if (doc.GState) {
    doc.setGState(new doc.GState({ opacity: 0.22 }));
  }
  doc.setFillColor(55, 65, 81);
  doc.circle(cx + 0.5, cy + 1, r + 0.5, "F");
  doc.restoreGraphicsState();
}

// Tempel foto profil dibentuk bulat sempurna (clip circle) -- jsPDF gak
// punya "border-radius" buat gambar, jadi pathnya digambar dulu tanpa
// fill/stroke (null) trus di-clip, baru gambarnya ditempel di dalam.
function drawCircularPhoto(doc, dataUrl, cx, cy, r) {
  doc.saveGraphicsState();
  doc.circle(cx, cy, r, null);
  doc.clip();
  doc.discardPath();
  doc.addImage(
    dataUrl,
    imageFormatFromDataUrl(dataUrl),
    cx - r,
    cy - r,
    r * 2,
    r * 2,
    undefined,
    "FAST"
  );
  doc.restoreGraphicsState();
}

// Gambar 1 sel "Nama Anggota" gabungan: foto bulat (kasih shadow tipis)
// nempel deket ke nama, bukan kolom kepisah -- foto asli kalau ada &
// berhasil dimuat, kalau nggak fallback ke lingkaran inisial abu-abu.
function drawMemberCell(doc, cell, photoDataUrl, fullName) {
  const r = 9.5;
  const cx = cell.x + 6 + r;
  const cy = cell.y + cell.height / 2;

  drawAvatarShadow(doc, cx, cy, r);

  if (photoDataUrl) {
    try {
      drawCircularPhoto(doc, photoDataUrl, cx, cy, r);
    } catch {
      photoDataUrl = null;
    }
  }

  if (!photoDataUrl) {
    doc.setDrawColor(200, 200, 205);
    doc.setFillColor(238, 240, 244);
    doc.circle(cx, cy, r, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 105, 115);
    doc.text(initials(fullName) || "-", cx, cy + 2.6, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  // Ring tipis di sekeliling avatar biar ada batas jelas dari background.
  doc.setDrawColor(215, 218, 224);
  doc.circle(cx, cy, r, "S");

  // Nama ditaro deket banget ke foto (bukan kolom terpisah).
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 30, 30);
  doc.text(fullName || "-", cx + r + 8, cy + 3.2);
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
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      // Muat semua foto profil dulu (paralel) sebelum mulai gambar PDF,
      // supaya pas tabel di-render fotonya udah siap pakai.
      const [hadirPhotos, tidakHadirPhotos] = await Promise.all([
        Promise.all(hadir.map((m) => loadImageAsDataUrl(m.avatarUrl))),
        Promise.all(tidakHadir.map((m) => loadImageAsDataUrl(m.avatarUrl))),
      ]);

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 40;
      const centerX = pageWidth / 2;
      let y = 54;

      // ---- Kepala dokumen: rata tengah, main-mainin ukuran/bold biar
      // ada hierarki jelas (judul >> sub-judul >> detail sesi). ----
      doc.setFont("helvetica", "bold");
      doc.setFontSize(19);
      doc.text("REKAP ABSENSI", centerX, y, { align: "center" });

      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(120, 120, 120);
      doc.text("SOPAN TEAM", centerX, y, { align: "center" });
      doc.setTextColor(0, 0, 0);

      y += 18;
      doc.setDrawColor(210, 210, 210);
      doc.line(centerX - 70, y, centerX + 70, y);

      y += 24;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`Divisi ${division?.name || session.division}`, centerX, y, {
        align: "center",
      });

      y += 17;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.text(formatDateTimeFull(session.starts_at), centerX, y, {
        align: "center",
      });

      y += 15;
      doc.text(
        `Jam sesi ${formatTime(session.starts_at)} - ${formatTime(session.ends_at)}`,
        centerX,
        y,
        { align: "center" }
      );

      y += 19;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(
        `${hadir.length} dari ${total} anggota hadir (${pct}%)`,
        centerX,
        y,
        { align: "center" }
      );

      y += 26;

      // ---- Tabel: header biru solid + grid tipis, mengikuti gaya tabel
      // referensi (header berwarna, badan putih bersih). ----
      const baseTableOptions = {
        theme: "grid",
        margin: { left: marginX, right: marginX },
        styles: {
          fontSize: 9.5,
          cellPadding: 6,
          minCellHeight: 32,
          lineColor: [222, 226, 232],
          lineWidth: 0.6,
          textColor: [30, 30, 30],
          valign: "middle",
          fillColor: [255, 255, 255],
        },
        headStyles: {
          fillColor: [37, 92, 219],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          lineColor: [37, 92, 219],
          halign: "left",
        },
      };

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11.5);
      doc.text(`Hadir (${hadir.length})`, marginX, y);

      autoTable(doc, {
        ...baseTableOptions,
        startY: y + 8,
        head: [["No", "Nama Anggota", "Jam Absen"]],
        body:
          hadir.length > 0
            ? hadir.map((m, i) => [String(i + 1), "", formatTime(m.checkedInAt)])
            : [["-", "Belum ada yang absen di sesi ini.", "-"]],
        columnStyles: {
          0: { cellWidth: 32, halign: "center" },
          1: { cellPadding: { top: 6, bottom: 6, left: 8, right: 6 } },
          2: { cellWidth: 85, halign: "center" },
        },
        didDrawCell: (cellData) => {
          if (cellData.section === "body" && cellData.column.index === 1 && hadir.length > 0) {
            const member = hadir[cellData.row.index];
            const photo = hadirPhotos[cellData.row.index];
            if (member) drawMemberCell(doc, cellData.cell, photo, member.fullName);
          }
        },
      });

      let nextY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 28 : y + 40;
      if (nextY > 700) {
        doc.addPage();
        nextY = 54;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11.5);
      doc.text(`Tidak Hadir (${tidakHadir.length})`, marginX, nextY);

      autoTable(doc, {
        ...baseTableOptions,
        startY: nextY + 8,
        head: [["No", "Nama Anggota"]],
        body:
          tidakHadir.length > 0
            ? tidakHadir.map((m, i) => [String(i + 1), ""])
            : [["-", "Semua anggota divisi ini sudah absen."]],
        columnStyles: {
          0: { cellWidth: 32, halign: "center" },
          1: { cellPadding: { top: 6, bottom: 6, left: 8, right: 6 } },
        },
        didDrawCell: (cellData) => {
          if (
            cellData.section === "body" &&
            cellData.column.index === 1 &&
            tidakHadir.length > 0
          ) {
            const member = tidakHadir[cellData.row.index];
            const photo = tidakHadirPhotos[cellData.row.index];
            if (member) drawMemberCell(doc, cellData.cell, photo, member.fullName);
          }
        },
      });

      const dateSlug = new Date(session.starts_at).toISOString().slice(0, 10);
      doc.save(`absensi-${session.division}-${dateSlug}.pdf`);
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
