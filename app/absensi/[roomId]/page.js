import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DIVISIONS_ABSENSI } from "@/lib/absensi";
import AttendanceRoom from "@/components/AttendanceRoom";

// Data kehadiran & status sesi berubah tiap saat -- jangan di-cache statis.
export const dynamic = "force-dynamic";

// Halaman ini SEKARANG wajib login (member biasa, bukan cuma admin).
// Nama yang tampil & tercatat diambil otomatis dari akun yang login --
// TIDAK ADA lagi input nama manual. Sesi (jendela waktu, durasi) diambil
// dari sesi yang dibuat admin lewat /dashboard/absensi.
export default async function AbsensiRoomPage({ params }) {
  const { roomId } = params;
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/masuk");
  }

  const { data: member } = await supabase
    .from("members")
    .select("id, full_name, division")
    .eq("id", user.id)
    .maybeSingle();

  const { data: session } = await supabase
    .from("attendance_sessions")
    .select("*")
    .eq("room_id", roomId)
    .maybeSingle();

  let records = [];
  let hasCheckedIn = false;

  if (session) {
    const { data: recordsData } = await supabase
      .from("attendance_records")
      .select("id, full_name, member_id, checked_in_at")
      .eq("session_id", session.id)
      .order("checked_in_at", { ascending: false });
    records = recordsData || [];
    hasCheckedIn = records.some((r) => r.member_id === user.id);
  }

  const division = session ? DIVISIONS_ABSENSI[session.division] : null;

  return (
    <AttendanceRoom
      roomId={roomId}
      session={session}
      division={division}
      records={records}
      hasCheckedIn={hasCheckedIn}
      currentUser={member ? { id: member.id, fullName: member.full_name } : null}
    />
  );
}
