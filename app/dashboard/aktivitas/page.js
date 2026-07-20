import { Smartphone } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { LOGIN_ACTIVITY } from "@/lib/dashboard-data";

export const metadata = {
  title: "Aktivitas Login | Dashboard SOPAN TEAM",
};

export default function AktivitasPage() {
  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Aktivitas Login"
        subtitle="Pantau siapa yang login ke akunnya dan kapan."
        searchPlaceholder="Cari berdasarkan username..."
      />

      <div className="rounded-2xl border border-black/[0.06] overflow-hidden">
        {LOGIN_ACTIVITY.map((log, i) => (
          <div
            key={log.id}
            className={`flex items-center gap-4 p-4 ${
              i !== LOGIN_ACTIVITY.length - 1 ? "border-b border-black/[0.06]" : ""
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-black/50">
              <Smartphone size={15} />
            </span>

            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-sm text-[#111827] truncate">
                @{log.username}
              </p>
              <p className="text-xs text-black/45">{log.device}</p>
            </div>

            <div className="hidden sm:block text-xs text-black/50 shrink-0">
              {log.time}
            </div>

            <div className="shrink-0">
              <StatusBadge status={log.status} />
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
