import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import { DIVISIONS_ABSENSI } from "@/lib/absensi";
import { DIVISION_CONTENT } from "@/lib/dashboard-data";

export const metadata = {
  title: "Konten Divisi | Dashboard SOPAN TEAM",
};

export default function DivisiIndexPage() {
  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Konten Divisi"
        subtitle="Perbarui showcase karya & deskripsi tiap divisi."
        searchPlaceholder="Cari konten atau karya..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.values(DIVISIONS_ABSENSI).map((division) => {
          const itemCount = DIVISION_CONTENT[division.id]?.items.length || 0;
          return (
            <Link
              key={division.id}
              href={`/dashboard/divisi/${division.id}`}
              className="group rounded-2xl border border-black/[0.06] p-5 hover:border-black/15 transition-colors flex flex-col justify-between min-h-[150px]"
            >
              <div>
                <span
                  className="inline-block h-8 w-8 rounded-lg mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
                  }}
                />
                <p className="font-display font-bold text-base text-[#111827]">
                  {division.name}
                </p>
                <p className="text-xs text-black/50 mt-1">
                  {itemCount} karya tersimpan
                </p>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-semibold text-black/60 mt-4">
                Kelola konten
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          );
        })}
      </div>
    </DashboardShell>
  );
}
