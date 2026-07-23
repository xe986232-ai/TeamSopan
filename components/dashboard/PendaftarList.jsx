"use client";

import * as React from "react";
import { Check, X, Copy, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DivisionBadge from "./DivisionBadge";
import StatusBadge from "./StatusBadge";
import AvatarInitials from "./AvatarInitials";
import { useToast } from "@/components/ui/toast";
import { acceptRegistrant, rejectRegistrant } from "@/app/dashboard/pendaftar/actions";

function CopyRow({ label, value }) {
  const { toast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ variant: "success", title: `${label} disalin` });
    } catch {
      toast({ variant: "error", title: "Gagal menyalin" });
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.08] px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-black/40">{label}</p>
        <p className="text-sm font-medium text-[#111827] truncate">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Salin ${label}`}
        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-black/50 hover:bg-black/5 hover:text-black/80 transition-colors"
      >
        <Copy size={14} />
      </button>
    </div>
  );
}

// Modal yang muncul setelah admin klik "Terima" — nampilin email, password
// sementara, dan link aktivasi buat disalin & dikirim manual ke pendaftar
// (lewat WA nomor yang dia isi waktu daftar). Ini SATU-SATUNYA kesempatan
// admin lihat password ini, jadi wajib disalin sekarang.
function CredentialsModal({ credentials, onClose }) {
  const waLink = `https://wa.me/${credentials.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h3 className="font-display font-bold text-lg text-[#111827]">
          {credentials.name} diterima 🎉
        </h3>
        <p className="mt-1 text-sm text-black/50">
          Salin data di bawah, lalu kirim manual ke pendaftar lewat WhatsApp.
          Password cuma ditampilkan sekali di sini.
        </p>

        <div className="mt-4 space-y-2.5">
          <CopyRow label="Email" value={credentials.email} />
          <CopyRow label="Password" value={credentials.password} />
          <CopyRow label="Link aktivasi (sekali pakai)" value={credentials.activationLink} />
        </div>

        <div className="mt-5 flex items-center gap-2.5">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#20bd5a] transition-colors"
          >
            Buka Chat WhatsApp
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium text-black/70 hover:bg-black/5 transition-colors"
          >
            Selesai
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PendaftarList({ initialRegistrants }) {
  const { toast } = useToast();
  const [registrants, setRegistrants] = React.useState(initialRegistrants);
  const [pendingId, setPendingId] = React.useState(null);
  const [credentials, setCredentials] = React.useState(null);

  const handleAccept = async (id) => {
    setPendingId(id);
    const result = await acceptRegistrant(id);
    setPendingId(null);

    if (result.error) {
      toast({ variant: "error", title: "Gagal menerima pendaftar", description: result.error });
      return;
    }

    setRegistrants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "diterima" } : r))
    );
    setCredentials(result.credentials);
  };

  const handleReject = async (id) => {
    setPendingId(id);
    const result = await rejectRegistrant(id);
    setPendingId(null);

    if (result.error) {
      toast({ variant: "error", title: "Gagal menolak pendaftar", description: result.error });
      return;
    }

    setRegistrants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "ditolak" } : r))
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-black/[0.06] overflow-hidden">
        {registrants.length === 0 && (
          <p className="p-6 text-center text-sm text-black/40">
            Belum ada pendaftar masuk.
          </p>
        )}

        {registrants.map((r, i) => (
          <div
            key={r.id}
            className={`flex items-center gap-4 p-4 ${
              i !== registrants.length - 1 ? "border-b border-black/[0.06]" : ""
            }`}
          >
            <AvatarInitials name={r.name} size={40} />

            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-sm text-[#111827] truncate">
                {r.name}
              </p>
              <p className="text-xs text-black/50 truncate">{r.whatsapp}</p>
            </div>

            <div className="hidden sm:block shrink-0">
              <DivisionBadge divisionId={r.division} />
            </div>

            <div className="hidden md:block text-xs text-black/40 w-24 shrink-0">
              {r.submittedAt}
            </div>

            <div className="shrink-0 w-20 flex justify-end">
              <StatusBadge status={r.status} />
            </div>

            {r.status === "menunggu" && (
              <div className="flex items-center gap-1.5 shrink-0">
                {pendingId === r.id ? (
                  <span className="flex h-8 w-8 items-center justify-center">
                    <Loader2 size={15} className="animate-spin text-black/40" />
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAccept(r.id)}
                      aria-label={`Terima ${r.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DCF7E3] text-[#1A7A3D] hover:bg-[#c8f0d2] transition-colors"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(r.id)}
                      aria-label={`Tolak ${r.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFE1E1] text-[#B3261E] hover:bg-[#ffd0d0] transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {credentials && (
          <CredentialsModal
            credentials={credentials}
            onClose={() => setCredentials(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
