"use client";

import { useEffect, useState } from "react";
import AnggotaSkeleton from "./AnggotaSkeleton";
import { TeamSectionSimple01 } from "./TeamSectionSimple01";

// Data anggota (`members`, `loadError`) sudah di-fetch di SERVER (lihat
// app/anggota/page.js) — jadi ini BUKAN fetch ulang, cuma nunda reveal-nya
// di browser sebentar biar animasi skeleton sempat kelihatan.
//
// Kenapa perlu ini: halaman /anggota pakai `revalidate = 60`, jadi di
// Vercel HTML-nya sering udah "jadi" duluan (di-cache) sebelum pengunjung
// buka link-nya. Itu artinya browser gak pernah beneran "nunggu" data,
// jadi app/anggota/loading.js (yang cuma jalan pas Next.js beneran nunggu
// server) gak sempat kepake. Reveal delay di sini isinya independen dari
// itu — jalan di setiap kunjungan, gak peduli data-nya cepat atau lambat.
const MIN_SKELETON_MS = 500;

export default function AnggotaReveal({ members, loadError }) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), MIN_SKELETON_MS);
    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton) {
    return <AnggotaSkeleton />;
  }

  return <TeamSectionSimple01 members={members} loadError={loadError} />;
}
