import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import BulkAddMembers from "@/components/dashboard/BulkAddMembers";

export const metadata = {
  title: "Tambah Anggota Massal | Dashboard SOPAN TEAM",
};

export default function TambahMassalPage() {
  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <div className="flex flex-col items-center gap-6 mb-8">
        <Link
          href="/dashboard/anggota"
          className="self-start flex items-center gap-1.5 text-sm text-black/50 hover:text-black/80 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Anggota
        </Link>
        <div className="text-center">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#111827]">
            Tambah Anggota Massal
          </h1>
          <p className="text-sm text-black/50 mt-1.5 max-w-md mx-auto">
            Buat banyak akun sekaligus untuk member yang sudah gabung
            sebelumnya (di luar form pendaftaran /gabung).
          </p>
        </div>
      </div>

      <BulkAddMembers />
    </DashboardShell>
  );
}
