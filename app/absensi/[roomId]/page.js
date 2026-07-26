import { redirect } from "next/navigation";
import {
  createServerSupabaseClient,
  createAdminSupabaseClient,
} from "@/lib/supabase/server";
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
    .select("id, full_name, division, avatar_url")
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
    // Join ke tabel members lewat member_id buat ikut ambil avatar_url --
    // biar list "yang sudah absen" nampilin foto profil, bukan cuma
    // inisial. Kalau member belum upload foto, avatar_url null -> fallback
    // inisial tetap jalan seperti biasa di AvatarCircle.
    //
    // PENTING: pakai admin client (bukan `supabase` session client) buat
    // query ini. Policy RLS tabel `members` cuma izinin
    // "auth.uid() = id" (baca baris sendiri) -- kalau dijoin lewat
    // session client, avatar_url MEMBER LAIN selalu balik null (avatar
    // sendiri tetap kebaca karena kebetulan cocok sama auth.uid()), jadi
    // avatar orang lain gak pernah muncul di list. avatar_url bukan data
    // sensitif buat sesama anggota yang udah login di 1 room absensi,
    // jadi aman dibaca lewat admin client di sini.
    const adminForAvatar = createAdminSupabaseClient();
    const { data: recordsData } = await adminForAvatar
      .from("attendance_records")
      .select("id, full_name, member_id, checked_in_at, members(avatar_url)")
      .eq("session_id", session.id)
      .order("checked_in_at", { ascending: false });
    records = (recordsData || []).map((r) => ({
      id: r.id,
      full_name: r.full_name,
      member_id: r.member_id,
      checked_in_at: r.checked_in_at,
      avatar_url: r.members?.avatar_url ?? null,
    }));
    hasCheckedIn = records.some((r) => r.member_id === user.id);
  }

  const division = session ? DIVISIONS_ABSENSI[session.division] : null;

  // Ambil pesan/status singkat tiap member -- diurutkan terbaru dulu,
  // lalu di-dedupe di sini (bukan di query) supaya CUMA pesan TERAKHIR
  // tiap member yang kepakai jadi bubble chat (member kirim pesan baru =
  // bubble lama otomatis ketutup pesan baru).
  let messages = [];
  let reactions = [];
  if (session) {
    const { data: messagesData } = await supabase
      .from("attendance_messages")
      .select("id, member_id, message, created_at")
      .eq("session_id", session.id)
      .order("created_at", { ascending: false });

    const latestByMember = new Map();
    for (const m of messagesData || []) {
      if (!latestByMember.has(m.member_id)) {
        latestByMember.set(m.member_id, m);
      }
    }
    messages = Array.from(latestByMember.values());

    if (messages.length > 0) {
      const { data: reactionsData } = await supabase
        .from("attendance_reactions")
        .select("id, message_id, member_id, emoji")
        .in(
          "message_id",
          messages.map((m) => m.id)
        );
      reactions = reactionsData || [];
    }
  }

  return (
    <AttendanceRoom
      roomId={roomId}
      session={session}
      division={division}
      records={records}
      hasCheckedIn={hasCheckedIn}
      messages={messages}
      reactions={reactions}
      currentUser={
        member
          ? { id: member.id, fullName: member.full_name, avatarUrl: member.avatar_url }
          : null
      }
    />
  );
}
