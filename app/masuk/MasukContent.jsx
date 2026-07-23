"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import ActivationForm from "@/components/ActivationForm";
import { checkActivationToken } from "./actions";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function MasukContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // "checking" -> lagi validasi token ke server
  // "activate" -> token valid, tampilkan form set password
  // "login" -> tidak ada token (atau sudah tidak valid), tampilkan login biasa
  const [mode, setMode] = React.useState(token ? "checking" : "login");
  const [activationData, setActivationData] = React.useState(null);

  React.useEffect(() => {
    if (!token) {
      setMode("login");
      return;
    }

    let cancelled = false;
    checkActivationToken(token).then((result) => {
      if (cancelled) return;
      if (result.valid) {
        setActivationData({ name: result.name, email: result.email });
        setMode("activate");
      } else {
        setMode("login");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const isActivate = mode === "activate";

  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="relative max-w-xl mx-auto text-center mb-12"
      >
        <span className="font-body font-semibold text-sm tracking-[0.3em] uppercase text-ink-muted">
          {isActivate ? "Aktivasi Akun" : "Masuk"}
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl mt-4 text-ink leading-tight">
          {isActivate ? "Satu Langkah Lagi" : "Masuk ke SOPAN TEAM"}
        </h1>
        <p className="font-body font-normal text-base text-ink-muted mt-4">
          {isActivate
            ? "Buat password sendiri untuk mulai pakai akunmu."
            : "Masukkan email dan password kamu untuk lanjut ke akun."}
        </p>
      </motion.div>

      {mode === "checking" && (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-ink/50" />
        </div>
      )}

      {mode === "activate" && (
        <ActivationForm
          token={token}
          name={activationData?.name}
          email={activationData?.email}
        />
      )}

      {mode === "login" && <LoginForm />}
    </>
  );
}
