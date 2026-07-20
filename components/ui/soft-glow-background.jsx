import { cn } from "@/lib/utils";

export const SoftGlowBackground = ({ className, children }) => {
  return (
    <div className={cn("relative overflow-hidden bg-base", className)}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[720px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, #B026FF, #FF2E92 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-24 right-[-120px] h-[300px] w-[300px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, #00E5FF, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(11,10,16,0.06) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};
