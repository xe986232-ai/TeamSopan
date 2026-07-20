import { DIVISIONS_ABSENSI } from "@/lib/absensi";

export default function DivisionBadge({ divisionId }) {
  const division = DIVISIONS_ABSENSI[divisionId];
  if (!division) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
      style={{
        background: `linear-gradient(135deg, ${division.accentFrom}, ${division.accentTo})`,
      }}
    >
      {division.name}
    </span>
  );
}
