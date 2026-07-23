import Link from "next/link";
import { UserPlus } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import AnggotaList from "@/components/dashboard/AnggotaList";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Anggota | Dashboard SOPAN TEAM",
};

export const dynamic = "force-dynamic";

export default async function AnggotaPage() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("joined_at", { ascending: false });

  const members = (data || []).map((m) => ({
    id: m.id,
    name: m.full_name,
    email: m.email,
    division: m.division,
    role: m.role,
    status: m.status,
    joinedAt: new Date(m.joined_at).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Manajemen Anggota"
        subtitle="Kelola profil dan status anggota di tiap divisi."
        searchPlaceholder="Cari nama atau email anggota..."
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-black/50">
          {members.length} anggota terdaftar
        </span>
        <Link
          href="/dashboard/anggota/tambah-massal"
          className="flex items-center gap-1.5 rounded-xl bg-[#111827] px-3.5 py-2 text-xs font-semibold text-white hover:bg-black transition-colors"
        >
          <UserPlus size={14} /> Tambah Massal
        </Link>
      </div>

      {error && (
        <p className="mb-4 text-sm text-rose-500">
          Gagal memuat data anggota: {error.message}
        </p>
      )}

      <AnggotaList initialMembers={members} />
    </DashboardShell>
  );
}
