import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import DivisionBadge from "@/components/dashboard/DivisionBadge";
import { ATTENDANCE_SESSIONS } from "@/lib/dashboard-data";
import { DIVISIONS_ABSENSI } from "@/lib/absensi";

export const metadata = {
  title: "Absensi | Dashboard SOPAN TEAM",
};

export default function AbsensiDashboardPage() {
  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Sesi Absensi"
        subtitle="Lihat riwayat kehadiran dan buat sesi absensi baru per divisi."
        searchPlaceholder="Cari sesi berdasarkan tanggal atau divisi..."
      />

      {/* Buat sesi baru — nyambung ke generator link acak yang udah ada di /absensi */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {Object.values(DIVISIONS_ABSENSI).map((division) => (
          <Link
            key={division.id}
            href="/absensi"
            className="group rounded-2xl border border-black/[0.06] p-4 hover:border-black/15 transition-colors"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full mb-2"
              style={{
                background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
              }}
            />
            <p className="font-display font-bold text-sm text-[#111827]">
              Buat Sesi {division.name}
            </p>
            <p className="text-xs text-black/45 mt-1 flex items-center gap-1">
              Buka generator link
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-black/50">Riwayat sesi terbaru</span>
      </div>

      <div className="rounded-2xl border border-black/[0.06] overflow-hidden">
        {ATTENDANCE_SESSIONS.map((session, i) => {
          const pct = Math.round((session.attendeeCount / session.totalMembers) * 100);
          return (
            <div
              key={session.id}
              className={`flex items-center gap-4 p-4 ${
                i !== ATTENDANCE_SESSIONS.length - 1 ? "border-b border-black/[0.06]" : ""
              }`}
            >
              <div className="shrink-0">
                <DivisionBadge divisionId={session.division} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-sm text-[#111827]">
                  {session.date}
                  <span className="text-black/40 font-normal"> · {session.time}</span>
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-black/50 shrink-0">
                <Users size={13} />
                {session.attendeeCount}/{session.totalMembers} hadir
              </div>

              <div className="w-24 shrink-0">
                <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1677F5]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <span className="text-xs font-semibold text-black/60 w-10 text-right shrink-0">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
