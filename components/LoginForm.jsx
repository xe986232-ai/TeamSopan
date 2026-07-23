"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { TextField } from "./ui/text-field";
import { PasswordField } from "./ui/password-field";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";
import { WELCOME_NAME_KEY } from "@/lib/welcome";
import { createPublicSupabaseClient } from "@/lib/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email wajib diisi";
    if (!form.password) next.password = "Password wajib diisi";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        variant: "error",
        title: "Form belum lengkap",
        description: "Cek lagi email dan password kamu.",
      });
      return;
    }

    setLoading(true);
    try {
      const supabase = createPublicSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (error || !data.session) {
        throw new Error("Email atau password salah.");
      }

      toast({
        variant: "success",
        title: "Berhasil masuk!",
        description: "Selamat datang kembali.",
      });

      sessionStorage.setItem(WELCOME_NAME_KEY, form.email.split("@")[0]);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast({
        variant: "error",
        title: "Gagal masuk",
        description: err.message || "Email atau password salah. Coba lagi, ya.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="mx-auto w-full max-w-lg space-y-6"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6"
      >
        <TextField
          id="email"
          type="email"
          label="Email"
          placeholder="renosopan@teamsopan.com"
          value={form.email}
          onChange={updateField("email")}
          error={errors.email}
        />

        <PasswordField
          value={form.password}
          onChange={updateField("password")}
          showStrength={false}
        />
        {errors.password && (
          <p className="-mt-4 text-xs text-rose-500">{errors.password}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="group relative w-full disabled:opacity-100"
        >
          <span className={loading ? "opacity-0" : "opacity-100"}>
            Masuk
          </span>
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin" />
            </span>
          )}
        </Button>

        <p className="text-center text-sm text-ink-muted">
          Belum punya akun?{" "}
          <a href="/gabung" className="font-medium text-ink hover:underline">
            Daftar di sini
          </a>
        </p>
      </form>
    </motion.div>
  );
}
