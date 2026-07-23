import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import AdminPhotoCard from "./AdminPhotoCard";
import { DIVISION_ADMINS } from "@/lib/dashboard-data";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin Divisi | Dashboard SOPAN TEAM",
};

export const dynamic = "force-dynamic";

async function getDivisionAdmins() {
  try {
    // Pakai admin client (secret key, server-only, bypass RLS) karena
    // halaman ini Server Component yang cuma jalan di server -- bukan
    // dikirim ke browser. Sebelumnya pakai client publik yang tunduk ke
    // RLS, dan kalau policy-nya belum/salah setup di project live, query
    // ini gagal DIAM-DIAM dan selalu jatuh ke data statis di bawah,
    // walaupun data di database sudah benar ke-update.
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("division_admins")
      .select("*")
      .order("slug");

    if (error || !data || data.length === 0) {
      throw error || new Error("division_admins kosong / tidak ada data");
    }
    return data;
  } catch (err) {
    // Di-log biar kelihatan di server/Vercel logs kalau ini kejadian lagi.
    console.error("[dashboard/admin] Gagal ambil division_admins dari Supabase:", err);
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
