import { Pencil } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import DivisionBadge from "@/components/dashboard/DivisionBadge";
import AvatarInitials from "@/components/dashboard/AvatarInitials";
import { DIVISION_ADMINS } from "@/lib/dashboard-data";

export const metadata = {
  title: "Admin Divisi | Dashboard SOPAN TEAM",
};

export default function AdminDivisiPage() {
  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Admin Divisi"
        subtitle="Atur siapa yang jadi admin di tiap divisi."
        searchPlaceholder="Cari nama admin..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DIVISION_ADMINS.map((admin) => (
          <div
            key={admin.id}
            className="rounded-2xl border border-black/[0.06] p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <AvatarInitials name={admin.name} size={44} />
              <button
                type="button"
                aria-label={`Ubah admin ${admin.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black/70 transition-colors"
              >
                <Pencil size={14} />
              </button>
            </div>

            <div>
              <p className="font-display font-bold text-sm text-[#111827]">
                {admin.name}
              </p>
              <div className="mt-1.5">
                <DivisionBadge divisionId={admin.division} />
              </div>
            </div>

            <p className="text-xs text-black/50 leading-relaxed">{admin.desc}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
