import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import PendaftarList from "@/components/dashboard/PendaftarList";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Pendaftar Baru | Dashboard SOPAN TEAM",
};

export const dynamic = "force-dynamic";

export default async function PendaftarPage() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("registrants")
    .select("*")
    .order("submitted_at", { ascending: false });

  const registrants = (data || []).map((r) => ({
    id: r.id,
    name: r.full_name,
    whatsapp: r.whatsapp,
    division: r.division,
    submittedAt: new Date(r.submitted_at).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: r.status,
  }));

  const pendingCount = registrants.filter((r) => r.status === "menunggu").length;

  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Pendaftar Baru"
        subtitle="Tinjau formulir pendaftaran yang masuk dari halaman Gabung."
        searchPlaceholder="Cari nama pendaftar..."
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-black/50">
          {pendingCount} pendaftar menunggu review
        </span>
      </div>

      {error && (
        <p className="mb-4 text-sm text-rose-500">
          Gagal memuat data pendaftar: {error.message}
        </p>
      )}

      <PendaftarList initialRegistrants={registrants} />
    </DashboardShell>
  );
}
