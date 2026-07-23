"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Modal konfirmasi generic sebelum hapus data -- biar admin gak kepencet
// gak sengaja, soalnya hapus data pendaftar/anggota gak bisa di-undo.
export default function ConfirmDeleteModal({
  title,
  description,
  isPending,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h3 className="font-display font-bold text-lg text-[#111827]">{title}</h3>
        <p className="mt-1.5 text-sm text-black/50">{description}</p>

        <div className="mt-5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Ya, Hapus
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium text-black/70 hover:bg-black/5 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
