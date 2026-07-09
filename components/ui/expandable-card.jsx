"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";

export function ExpandableCards({ items }) {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") setActive(null);
    }
    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setActive(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-50 grid place-items-center px-4 pointer-events-none">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-md bg-base-elevated rounded-2xl overflow-hidden border border-black/10 shadow-2xl pointer-events-auto"
            >
              <motion.div
                layoutId={`thumb-${active.title}-${id}`}
                className={cn(
                  "h-40 w-full bg-gradient-to-br",
                  active.accent
                )}
              />
              <div className="p-6 relative">
                <div className="flex items-start justify-between">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-display text-xl text-ink"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`subtitle-${active.title}-${id}`}
                      className="text-sm text-ink-muted mt-1"
                    >
                      {active.subtitle}
                    </motion.p>
                  </div>
                  <span className="shrink-0 text-sm font-medium px-4 py-1.5 rounded-full bg-green-500 text-white">
                    Playing
                  </span>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-sm text-ink-dim mt-4 leading-relaxed"
                >
                  {active.description}
                </motion.p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 text-white grid place-items-center hover:bg-black/60 transition-colors"
                aria-label="Tutup"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ul className="max-w-2xl mx-auto flex flex-col gap-2">
        {items.map((item) => (
          <motion.li
            layoutId={`card-${item.title}-${id}`}
            key={item.title}
            onClick={() => setActive(item)}
            className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-black/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              <motion.div
                layoutId={`thumb-${item.title}-${id}`}
                className={cn(
                  "h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br",
                  item.accent
                )}
              />
              <div className="min-w-0">
                <motion.h4
                  layoutId={`title-${item.title}-${id}`}
                  className="font-medium text-ink truncate"
                >
                  {item.title}
                </motion.h4>
                <motion.p
                  layoutId={`subtitle-${item.title}-${id}`}
                  className="text-sm text-ink-muted truncate"
                >
                  {item.subtitle}
                </motion.p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActive(item);
              }}
              className="shrink-0 text-sm font-medium px-4 py-1.5 rounded-full bg-ink text-base hover:opacity-80 transition-opacity"
            >
              Play
            </button>
          </motion.li>
        ))}
      </ul>
    </>
  );
}