"use client";

export default function ReadOnlyOverlay({ active, message, children }) {
  if (!active) return children;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => alert(message)}
        aria-label="Terkunci"
        className="absolute inset-0 z-10 h-full w-full cursor-not-allowed bg-transparent"
      />
      <div className="pointer-events-none select-none opacity-60">
        {children}
      </div>
    </div>
  );
}
