"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { TextField } from "./ui/text-field";
import { PasswordField } from "./ui/password-field";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";
import { activateAccount } from "@/app/masuk/actions";
import { createPublicSupabaseClient } from "@/lib/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// Ditampilkan saat pendaftar buka link aktivasi (/masuk?token=xxx) pertama
// kali. Mereka set password sendiri di sini, lalu langsung masuk ke
// dashboard. Setelah dipakai, link ini mati (tidak bisa dipakai ulang).
export default function ActivationForm({ token, name, email }) {
  const { toast } = useToast();
  const router = useRouter();

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const validate = () => {
    const next = {};
    if (!password || password.length < 8) {
      next.password = "Password minimal 8 karakter";
    }
    if (password !== confirm) {
      next.confirm = "Konfirmasi password tidak sama";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await activateAccount(token, password);
      if (result.error) {
        throw new Error(result.error);
      }

      // Setelah password berhasil di-set di server, login-kan otomatis di
      // browser supaya sesi (cookie) langsung aktif dan bisa masuk dashboard.
      const supabase = createPublicSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: result.email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      toast({
        variant: "success",
        title: "Akun berhasil diaktifkan!",
        description: "Selamat datang di SOPAN TEAM.",
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast({
        variant: "error",
        title: "Gagal mengaktifkan akun",
        description: err.message || "Coba lagi dalam beberapa saat, ya.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="mx-auto w-full max-w-lg space-y-6"
    >
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] p-4 text-center">
        <p className="text-sm text-ink-muted">
          Halo{name ? `, ${name}` : ""}! Ini pertama kalinya kamu masuk.
          Silakan buat password sendiri untuk akun:
        </p>
        <p className="mt-1 font-semibold text-ink">{email}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <PasswordField
          label="Password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="-mt-4 text-xs text-rose-500">{errors.password}</p>
        )}

        <TextField
          id="confirm-password"
          type="password"
          label="Konfirmasi password"
          placeholder="Ulangi password baru"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />

        <Button
          type="submit"
          disabled={loading}
          className="group relative w-full disabled:opacity-100"
        >
          <span className={loading ? "opacity-0" : "opacity-100"}>
            Aktifkan & Masuk
          </span>
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin" />
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
