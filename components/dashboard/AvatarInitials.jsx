function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const PALETTE = [
  ["#B026FF", "#FF2E92"],
  ["#00E5FF", "#3D5AFE"],
  ["#FFD166", "#FF6FB5"],
];

function paletteFor(name) {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export default function AvatarInitials({ name, size = 40 }) {
  const [from, to] = paletteFor(name);
  return (
    <span
      className="relative flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </span>
  );
}
