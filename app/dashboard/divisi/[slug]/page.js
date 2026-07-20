import { notFound } from "next/navigation";
import { FileText, Pencil, Trash2 } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import { DIVISIONS_ABSENSI } from "@/lib/absensi";
import { DIVISION_CONTENT } from "@/lib/dashboard-data";

export function generateMetadata({ params }) {
  const division = DIVISIONS_ABSENSI[params.slug];
  return { title: `${division ? division.name : "Divisi"} | Dashboard SOPAN TEAM` };
}

export default function DivisiDetailPage({ params }) {
  const division = DIVISIONS_ABSENSI[params.slug];
  if (!division) notFound();

  const items = DIVISION_CONTENT[params.slug]?.items || [];

  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title={`Konten Divisi ${division.name}`}
        subtitle="Kelola showcase karya yang tampil di halaman divisi ini."
        searchPlaceholder={`Cari karya divisi ${division.name}...`}
      />

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/[0.1] p-10 text-center">
          <p className="text-sm text-black/50">
            Belum ada konten tersimpan untuk divisi {division.name}.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/[0.06] overflow-hidden">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 ${
                i !== items.length - 1 ? "border-b border-black/[0.06]" : ""
              }`}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
                style={{
                  background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
                }}
              >
                <FileText size={15} />
              </span>

              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-sm text-[#111827] truncate">
                  {item.title}
                </p>
                <p className="text-xs text-black/45">
                  {item.type} · Diperbarui {item.updatedAt}
                </p>
              </div>

              <button
                type="button"
                aria-label={`Ubah ${item.title}`}
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black/70 transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                aria-label={`Hapus ${item.title}`}
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-black/40 hover:bg-[#FFE1E1] hover:text-[#B3261E] transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
