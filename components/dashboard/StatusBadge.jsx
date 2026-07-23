const STATUS_STYLES = {
  aktif: "bg-[#DCF7E3] text-[#1A7A3D]",
  berhasil: "bg-[#DCF7E3] text-[#1A7A3D]",
  diterima: "bg-[#DCF7E3] text-[#1A7A3D]",
  selesai: "bg-[#DCF7E3] text-[#1A7A3D]",
  menunggu: "bg-[#FFF3C4] text-[#8A6D00]",
  trial: "bg-[#DCEBFF] text-[#1D4ED8]",
  nonaktif: "bg-black/[0.06] text-black/50",
  ditolak: "bg-[#FFE1E1] text-[#B3261E]",
  gagal: "bg-[#FFE1E1] text-[#B3261E]",
};

const STATUS_LABELS = {
  aktif: "Aktif",
  berhasil: "Berhasil",
  diterima: "Diterima",
  selesai: "Selesai",
  menunggu: "Menunggu",
  trial: "Trial",
  nonaktif: "Nonaktif",
  ditolak: "Ditolak",
  gagal: "Gagal",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-black/5 text-black/50";
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${style}`}
    >
      {label}
    </span>
  );
}
