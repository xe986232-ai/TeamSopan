import { MoreHorizontal } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import DivisionBadge from "@/components/dashboard/DivisionBadge";
import StatusBadge from "@/components/dashboard/StatusBadge";
import AvatarInitials from "@/components/dashboard/AvatarInitials";
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
      </div>

      {error && (
        <p className="mb-4 text-sm text-rose-500">
          Gagal memuat data anggota: {error.message}
        </p>
      )}

      <div className="rounded-2xl border border-black/[0.06] overflow-hidden">
        {members.length === 0 && (
          <p className="p-6 text-center text-sm text-black/40">
            Belum ada anggota. Terima pendaftar di halaman Pendaftar Baru dulu.
          </p>
        )}

        {members.map((member, i) => (
          <div
            key={member.id}
            className={`flex items-center gap-4 p-4 ${
              i !== members.length - 1 ? "border-b border-black/[0.06]" : ""
            }`}
          >
            <AvatarInitials name={member.name} size={40} />

            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-sm text-[#111827] truncate">
                {member.name}
              </p>
              <p className="text-xs text-black/50 truncate">{member.email}</p>
            </div>

            <div className="hidden sm:block text-xs text-black/50 w-32 shrink-0">
              {member.role}
            </div>

            <div className="shrink-0">
              <DivisionBadge divisionId={member.division} />
            </div>

            <div className="hidden md:block shrink-0">
              <StatusBadge status={member.status} />
            </div>

            <div className="hidden lg:block text-xs text-black/40 w-24 shrink-0 text-right">
              {member.joinedAt}
            </div>

            <button
              type="button"
              aria-label="Aksi lainnya"
              className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black/70 transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
