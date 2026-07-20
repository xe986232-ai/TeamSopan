"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import DivisionBadge from "@/components/dashboard/DivisionBadge";
import StatusBadge from "@/components/dashboard/StatusBadge";
import AvatarInitials from "@/components/dashboard/AvatarInitials";
import { REGISTRANTS } from "@/lib/dashboard-data";

// Catatan: aksi Terima/Tolak di bawah ini baru mengubah status di state
// React lokal (biar kerasa hidup pas dicoba). Belum kesimpen permanen —
// nanti disambungin ke backend begitu sudah ada.
export default function PendaftarPage() {
  const [registrants, setRegistrants] = React.useState(REGISTRANTS);

  const updateStatus = (id, status) => {
    setRegistrants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const pendingCount = registrants.filter((r) => r.status === "menunggu").length;

  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Pendaftar Baru"
        subtitle="Tinjau formulir pendaftaran yang masuk dari halaman Gabung."
        searchPlaceholder="Cari nama atau email pendaftar..."
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-black/50">
          {pendingCount} pendaftar menunggu review
        </span>
      </div>

      <div className="rounded-2xl border border-black/[0.06] overflow-hidden">
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
              <p className="text-xs text-black/50 truncate">{r.email}</p>
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
                <button
                  type="button"
                  onClick={() => updateStatus(r.id, "diterima")}
                  aria-label={`Terima ${r.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DCF7E3] text-[#1A7A3D] hover:bg-[#c8f0d2] transition-colors"
                >
                  <Check size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(r.id, "ditolak")}
                  aria-label={`Tolak ${r.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFE1E1] text-[#B3261E] hover:bg-[#ffd0d0] transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
