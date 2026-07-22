import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import AdminPhotoCard from "./AdminPhotoCard";
import { DIVISION_ADMINS } from "@/lib/dashboard-data";
import { createPublicSupabaseClient } from "@/lib/supabase/client";

export const metadata = {
  title: "Admin Divisi | Dashboard SOPAN TEAM",
};

export const dynamic = "force-dynamic";

async function getDivisionAdmins() {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("division_admins")
      .select("*")
      .order("slug");

    if (error || !data || data.length === 0) {
      throw error || new Error("empty");
    }
    return data;
  } catch {
    // fallback ke data statis kalau Supabase belum di-setup / lagi error,
    // biar halaman tetap jalan.
    return DIVISION_ADMINS.map((a) => ({
      slug: a.division,
      name: a.name,
      description: a.desc,
      image_url: null,
    }));
  }
}

export default async function AdminDivisiPage() {
  const admins = await getDivisionAdmins();

  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Admin Divisi"
        subtitle="Atur siapa yang jadi admin di tiap divisi."
        searchPlaceholder="Cari nama admin..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {admins.map((admin) => (
          <AdminPhotoCard key={admin.slug} admin={admin} />
        ))}
      </div>
    </DashboardShell>
  );
}
