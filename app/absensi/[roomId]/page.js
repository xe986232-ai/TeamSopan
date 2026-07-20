"use client";

import AttendanceRoom from "@/components/AttendanceRoom";

export default function AbsensiRoomPage({ params }) {
  return <AttendanceRoom roomId={params.roomId} />;
}
