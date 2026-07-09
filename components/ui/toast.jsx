"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = React.createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const ACCENTS = {
  success: "text-emerald-500",
  error: "text-rose-500",
  info: "text-ink-muted",
};

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const dismiss = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ title, description, variant = "success", duration = 4000 }) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast harus dipakai di dalam <ToastProvider>");
  }
  return ctx;
}

function Toaster({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.variant] || Info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border border-black/10 dark:border-white/10",
                "bg-base-elevated/95 backdrop-blur-xl shadow-lg shadow-black/10 p-4"
              )}
            >
              <Icon size={20} className={cn("shrink-0 mt-0.5", ACCENTS[t.variant])} />
              <div className="min-w-0 flex-1">
                {t.title && (
                  <p className="font-display text-sm text-ink leading-snug">{t.title}</p>
                )}
                {t.description && (
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => onDismiss(t.id)}
                aria-label="Tutup notifikasi"
                className="shrink-0 text-ink-dim hover:text-ink transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
