"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { TextField } from "./ui/text-field";
import { PasswordField } from "./ui/password-field";
import { CheckboxCard } from "./ui/checkbox";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";

const DIVISIONS = [
  {
    id: "remix",
    name: "Remix",
    description: "Mashup, bootleg, sampai remix full produksi.",
    accentFrom: "#B026FF",
    accentTo: "#FF2E92",
    image:
      "https://images.unsplash.com/photo-1730818203797-897b2838105a?w=128&h=128&fit=crop&auto=format&q=70",
  },
  {
    id: "creator",
    name: "Creator",
    description: "Video editing, color grading, motion graphic.",
    accentFrom: "#00E5FF",
    accentTo: "#3D5AFE",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=128&h=128&fit=crop&auto=format&q=70",
  },
  {
    id: "leadis",
    name: "Leadis",
    description: "Panggung buat kreator perempuan.",
    accentFrom: "#FFD166",
    accentTo: "#FF6FB5",
    image:
      "https://images.unsplash.com/photo-1744418939745-a4f22552b992?w=128&h=128&fit=crop&auto=format&q=70",
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function JoinForm() {
  const { toast } = useToast();

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [division, setDivision] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const selectDivision = (id) => {
    setDivision((prev) => (prev === id ? null : id));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "Nama depan wajib diisi";
    if (!form.lastName.trim()) next.lastName = "Nama belakang wajib diisi";
    if (!form.email.trim()) {
      next.email = "Email wajib diisi";
    } else if (!EMAIL_REGEX.test(form.email)) {
      next.email = "Format email tidak valid";
    }
    if (!form.password || form.password.length < 8) {
      next.password = "Password minimal 8 karakter";
    }
    if (!division) {
      next.divisions = "Pilih satu divisi";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        variant: "error",
        title: "Form belum lengkap",
        description: "Cek lagi isian yang masih kosong atau belum sesuai.",
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: sambungkan ke endpoint pendaftaran (mis. Firebase / API route) di sini.
      await new Promise((resolve) => setTimeout(resolve, 1200));

      toast({
        variant: "success",
        title: "Pendaftaran terkirim!",
        description: `Terima kasih, ${form.firstName}. Tim kami bakal hubungi kamu lewat email.`,
      });

      setForm({ firstName: "", lastName: "", email: "", password: "" });
      setDivision(null);
      setErrors({});
    } catch (err) {
      toast({
        variant: "error",
        title: "Gagal mengirim pendaftaran",
        description: "Coba lagi dalam beberapa saat, ya.",
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
      <div className="space-y-2.5">
        <span className="text-sm font-medium text-ink">Pilih divisi</span>
        <div className="space-y-2">
          {DIVISIONS.map((item) => (
            <CheckboxCard
              key={item.id}
              id={`division-${item.id}`}
              label={item.name}
              image={item.image}
              accentTo={item.accentTo}
              checked={division === item.id}
              onChange={() => selectDivision(item.id)}
            />
          ))}
        </div>
        {errors.divisions && (
          <p className="text-xs text-rose-500">{errors.divisions}</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-xl border border-black/10 dark:border-white/10 bg-base-elevated p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="firstName"
            label="Nama depan"
            placeholder="Raka"
            value={form.firstName}
            onChange={updateField("firstName")}
            error={errors.firstName}
          />
          <TextField
            id="lastName"
            label="Nama belakang"
            placeholder="Aditya"
            value={form.lastName}
            onChange={updateField("lastName")}
            error={errors.lastName}
          />
        </div>

        <TextField
          id="email"
          type="email"
          label="Alamat email"
          placeholder="kamu@email.com"
          value={form.email}
          onChange={updateField("email")}
          error={errors.email}
        />

        <PasswordField
          value={form.password}
          onChange={updateField("password")}
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
            Daftar Sekarang
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
