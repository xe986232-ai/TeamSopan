"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { useDashboardSidebar } from "./DashboardSidebarContext";

export default function DashboardTopbar({
  title,
  subtitle,
  searchPlaceholder = "Cari data...",
}) {
  const { open, toggle } = useDashboardSidebar();

  return (
    <div className="flex flex-col items-center gap-6 mb-8">
      <div className="w-full flex items-center justify-between">
        <motion.button
          type="button"
          onClick={toggle}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.15 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-black/50 hover:bg-black/5 hover:text-black/80 transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-center"
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <div className="w-10" />
      </div>

      <div className="text-center">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#111827]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-black/50 mt-1.5 max-w-md mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="w-full max-w-xl">
        <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3">
          <Search size={16} className="text-black/40 shrink-0" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-sm text-black/80 placeholder:text-black/40 outline-none"
          />
          <kbd className="hidden sm:inline-block rounded-md bg-black/5 px-1.5 py-0.5 text-[11px] font-medium text-black/40">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  );
}
