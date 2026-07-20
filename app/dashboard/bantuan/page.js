import { BookOpen, MessageCircleQuestion, Mail } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";

export const metadata = {
  title: "Bantuan | Dashboard SOPAN TEAM",
};

const FAQS = [
  { q: "Gimana cara nerima pendaftar baru?", a: "Buka menu Pendaftar Baru, lalu klik tombol centang hijau di sebelah pendaftar yang mau diterima." },
  { q: "Gimana cara bikin sesi absensi baru?", a: "Buka menu Absensi, klik salah satu kartu \"Buat Sesi\" sesuai divisi, lalu share link yang muncul." },
  { q: "Data yang ditampilkan di sini sudah data asli?", a: "Belum — dashboard ini masih tampilan (data contoh). Data asli akan aktif begitu backend disambungkan." },
];

export default function BantuanPage() {
  return (
    <DashboardShell rightPanel={<DashboardRightPanel />}>
      <DashboardTopbar
        title="Bantuan"
        subtitle="Pertanyaan umum seputar penggunaan dashboard ini."
        searchPlaceholder="Cari topik bantuan..."
      />

      <div className="rounded-2xl border border-black/[0.06] overflow-hidden mb-4">
        {FAQS.map((faq, i) => (
          <div
            key={faq.q}
            className={`flex items-start gap-3 p-4 ${
              i !== FAQS.length - 1 ? "border-b border-black/[0.06]" : ""
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1677F5]/10 text-[#1677F5]">
              <MessageCircleQuestion size={15} />
            </span>
            <div>
              <p className="font-body font-semibold text-sm text-[#111827]">
                {faq.q}
              </p>
              <p className="text-xs text-black/50 mt-1 leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="#"
          className="rounded-2xl border border-black/[0.06] p-5 hover:border-black/15 transition-colors flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04] text-black/60">
            <BookOpen size={17} />
          </span>
          <div>
            <p className="font-body font-semibold text-sm text-[#111827]">
              Dokumentasi Lengkap
            </p>
            <p className="text-xs text-black/45">Panduan pakai tiap menu dashboard.</p>
          </div>
        </a>

        <a
          href="mailto:admin@sopanteam.id"
          className="rounded-2xl border border-black/[0.06] p-5 hover:border-black/15 transition-colors flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04] text-black/60">
            <Mail size={17} />
          </span>
          <div>
            <p className="font-body font-semibold text-sm text-[#111827]">
              Hubungi Tim
            </p>
            <p className="text-xs text-black/45">admin@sopanteam.id</p>
          </div>
        </a>
      </div>
    </DashboardShell>
  );
}
