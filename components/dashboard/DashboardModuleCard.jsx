import { ArrowRight } from "lucide-react";

// Nama key dipertahankan biar data di halaman lain gak perlu diubah, tapi
// semua warna sekarang cuma varian dari warna utama dashboard (biru) +
// abu-abu netral — biar gak "kebanyakan warna" kayak sebelumnya.
const COLOR_MAP = {
  pink: "bg-[#EAF2FF]",
  blue: "bg-[#D8E9FF]",
  yellow: "bg-[#F0F3F7]",
  green: "bg-[#EAF2FF]",
  purple: "bg-[#D8E9FF]",
};

export default function DashboardModuleCard({
  color = "blue",
  icon: Icon,
  title,
  description,
  tagIcon: TagIcon,
  tag,
  footerLabel,
  actionLabel,
  href = "#",
}) {
  return (
    <div
      className={`flex flex-col justify-between rounded-3xl p-6 min-h-[210px] ${COLOR_MAP[color]}`}
    >
      <div>
        {tag && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-black/55 mb-3">
            {TagIcon && <TagIcon size={14} />}
            {tag}
          </div>
        )}
        <h3 className="font-display font-bold text-lg text-[#111827] leading-snug">
          {title}
        </h3>
        <p className="text-sm text-black/60 mt-1.5 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-5">
        <span className="text-xs text-black/50">{footerLabel}</span>
        <a
          href={href}
          className="inline-flex items-center gap-1.5 rounded-full bg-black text-white text-xs font-semibold px-4 py-2 hover:bg-black/80 transition-colors"
        >
          {actionLabel}
          <ArrowRight size={12} />
        </a>
      </div>
    </div>
  );
}