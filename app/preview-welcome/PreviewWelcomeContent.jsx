"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WelcomePreviewSection from "@/components/WelcomePreviewSection";
import { popWelcomeData } from "@/lib/welcome";

export default function PreviewWelcomeContent() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Data asli (nama, divisi, foto) dioper dari form aktivasi lewat
    // sessionStorage. Kalau halaman ini dibuka langsung tanpa data (mis.
    // buat preview desain), tetap tampil pakai nilai default di komponen.
    setData(popWelcomeData() || {});
  }, []);

  // Tunggu sessionStorage kebaca dulu (hindari flicker default -> data asli).
  if (data === null) return null;

  return (
    <WelcomePreviewSection
      name={data.name || undefined}
      division={data.division || undefined}
      avatarUrl={data.avatarUrl || undefined}
      onFinish={() => router.push("/dashboard")}
    />
  );
}
