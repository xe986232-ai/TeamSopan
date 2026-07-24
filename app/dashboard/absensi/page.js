import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import CreateAttendanceSessionForm from "@/components/dashboard/CreateAttendanceSessionForm";
import AttendanceSessionsList from "@/components/dashboard/AttendanceSessionsList";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Absensi | Dashboard SOPAN TEAM",
};

// Data sesi & kehadiran berubah tiap saat (status aktif/berakhir jalan
// sendiri seiring waktu) -- jangan di-cache statis.
export const dynamic = "force-dynamic";

export default async function AbsensiDashboardPage() {
  const supabase = createAdminSupabaseClient();

  const { data: sessionsData, error: sessionsError } = await supabase
    .from("attendance_sessions")
    .select("*")
    .order("starts_at", { ascending: false });

  const sessions = sessionsData || [];
  const sessionIds = sessions.map((s) => s.id);

  // Hitung jumlah yang sudah absen per sesi dalam 1 query, biar tidak
  // query berkali-kali per baris.
  let recordCounts = {};
  if (sessionIds.length > 0) {
    const { data: records } = await supabase
      .from("attendance_records")
      .select("session_id")
      .in("session_id", sessionIds);
    (records || []).forEach((r) => {
      recordCounts[r.session_id] = (recordCounts[r.session_id] || 0) + 1;
    });
  }

  // Total anggota aktif per divisi -- buat persentase kehadiran.
  const { data: membersData } = await supabase
    .from("members")
    .select("division")
    .neq("status", "nonaktif");

  const totalsByDivision = {};
  (membersData || []).forEach((m) => {
    totalsByDivision[m.division] = (totalsByDivision[m.division] || 0) + 1;
  });

  const sessionsForClient = sessions.map((s) => ({
    id: s.id,
    roomId: s.room_id,
    division: s.division,
    startsAt: s.starts_at,
    endsAt: s.ends_at,
    attendeeCount: recordCounts[s.id] || 0,
    totalMembers: totalsByDivision[s.division] || 0,
  }));

  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Sesi Absensi"
        subtitle="Buat sesi absensi baru & pantau riwayat kehadiran tiap divisi."
        searchPlaceholder="Cari sesi berdasarkan divisi..."
      />

      <CreateAttendanceSessionForm />

      <div className="flex items-center justify-between mb-4 mt-8">
        <span className="text-sm text-black/50">Riwayat sesi</span>
      </div>

      {sessionsError && (
        <p className="mb-4 text-sm text-rose-500">
          Gagal memuat data sesi: {sessionsError.message}. Pastikan
          migrasi <code>supabase/migration_absensi.sql</code> sudah
          dijalankan di Supabase Dashboard → SQL Editor.
        </p>
      )}

      <AttendanceSessionsList initialSessions={sessionsForClient} />
    </DashboardShell>
  );
}
