"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { TextField } from "./ui/text-field";
import { PasswordField } from "./ui/password-field";
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

const SMOOTH_EASE = [0.22, 1, 0.36, 1];

// ---- Timing tiap tahap animasi teks pembuka (mirip WelcomePreviewSection) ----
const GREETING_TEXT = "Halo, Calon Anggota SOPAN TEAM! \uD83D\uDC4B";
const CHAR_DELAY_MS = 28;
const CHAR_DURATION_MS = 500;
const GREETING_REVEAL_MS = (GREETING_TEXT.length - 1) * CHAR_DELAY_MS + CHAR_DURATION_MS;
const GREETING_HOLD_MS = 1100;
const GREETING_EXIT_MS = 450;

const QUESTION_LINE_1 = "Kami punya tiga divisi keren.";
const QUESTION_LINE_2 = "Kamu mau gabung di divisi mana?";
const QUESTION_HOLD_MS = 1000;

// ---- Komponen teks per-huruf (blur-in tipis + zoom) ----
function RevealText({ text, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: SMOOTH_EASE }}
    >
      <h2 className={className}>
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: "blur(1px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
              delay: (i * CHAR_DELAY_MS) / 1000,
              duration: CHAR_DURATION_MS / 1000,
              ease: "easeOut",
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </h2>
    </motion.div>
  );
}

// ---- Tahap 1: Sapaan ----
function GreetingStage({ onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, GREETING_REVEAL_MS + GREETING_HOLD_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      key="greeting"
      exit={{ opacity: 0, scale: 0.96, transition: { duration: GREETING_EXIT_MS / 1000, ease: "easeInOut" } }}
      className="flex flex-col items-center justify-center text-center px-6"
    >
      <RevealText
        text={GREETING_TEXT}
        className="font-display font-extrabold text-3xl md:text-5xl text-ink"
      />
    </motion.div>
  );
}

// ---- Tahap 2: Pertanyaan divisi (lalu geser ke atas jadi header di tahap 3) ----
function QuestionStage({ onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, QUESTION_HOLD_MS + 900);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      key="question"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: SMOOTH_EASE }}
      className="flex flex-col items-center justify-center text-center px-6 gap-2"
    >
      <h2 className="font-display font-extrabold text-2xl md:text-4xl text-ink">
        {QUESTION_LINE_1}
      </h2>
      <h2 className="font-display font-extrabold text-2xl md:text-4xl text-ink">
        {QUESTION_LINE_2}
      </h2>
    </motion.div>
  );
}

// ---- Tahap 3: Header naik ke atas + card divisi muncul ----
function PickDivisionStage({ division, onSelect, onContinue }) {
  return (
    <motion.div
      key="pick-division"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto px-4 sm:px-6"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: SMOOTH_EASE }}
        className="text-center mb-8"
      >
        <span className="font-body font-semibold text-xs sm:text-sm tracking-[0.3em] uppercase text-ink-muted">
          Pilih Divisi
        </span>
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-ink mt-2">
          {QUESTION_LINE_2}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DIVISIONS.map((item, i) => {
          const active = division === item.id;
          return (
            <motion.button
              type="button"
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: SMOOTH_EASE, delay: i * 0.12 }}
              onClick={() => onSelect(item.id)}
              className={`group relative text-left rounded-2xl p-5 border transition-all ${
                active ? "" : "border-black/10 dark:border-white/12 bg-black/[0.02] dark:bg-white/[0.04]"
              }`}
              style={
                active
                  ? {
                      borderColor: item.accentTo,
                      background: `linear-gradient(135deg, ${item.accentFrom}22, ${item.accentTo}22)`,
                      boxShadow: `0 0 0 1px ${item.accentTo}55, 0 12px 32px -12px ${item.accentTo}66`,
                    }
                  : undefined
              }
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full"
                  style={{ boxShadow: `0 0 0 2px ${item.accentTo}55` }}
                >
                  <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                </span>
                <span className="font-display font-bold text-lg text-ink">{item.name}</span>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: division ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center mt-8"
      >
        <Button
          type="button"
          size="lg"
          disabled={!division}
          onClick={onContinue}
          className="px-8"
        >
          Lanjut Isi Data
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center text-sm text-ink-muted mt-6"
      >
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-medium text-ink hover:underline">
          Masuk di sini
        </Link>
      </motion.p>
    </motion.div>
  );
}

// ---- Tahap 4: Form (zoom + fade) ----
function FormStage({ division, form, errors, loading, onChangeField, onBack, onSubmit }) {
  const selected = DIVISIONS.find((d) => d.id === division);

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: SMOOTH_EASE }}
      className="w-full max-w-lg mx-auto px-4 sm:px-0"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted hover:text-ink/80 transition-colors mb-4"
      >
        <ArrowLeft size={14} /> Ganti divisi
      </button>

      <div className="text-center mb-6">
        <span className="font-body font-semibold text-xs tracking-[0.3em] uppercase text-ink-muted">
          Formulir Pendaftaran
        </span>
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-ink mt-2">
          Daftar sebagai calon anggota{" "}
          <span style={{ color: selected?.accentTo }}>{selected?.name}</span>
        </h2>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="firstName"
            label="Nama depan"
            placeholder="Raka"
            value={form.firstName}
            onChange={onChangeField("firstName")}
            error={errors.firstName}
          />
          <TextField
            id="lastName"
            label="Nama belakang"
            placeholder="Aditya"
            value={form.lastName}
            onChange={onChangeField("lastName")}
            error={errors.lastName}
          />
        </div>

        <TextField
          id="email"
          type="email"
          label="Alamat email"
          placeholder="kamu@email.com"
          value={form.email}
          onChange={onChangeField("email")}
          error={errors.email}
        />

        <PasswordField value={form.password} onChange={onChangeField("password")} />
        {errors.password && (
          <p className="-mt-4 text-xs text-rose-400">{errors.password}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="group relative w-full disabled:opacity-100"
        >
          <span className={loading ? "opacity-0" : "opacity-100"}>Daftar Sekarang</span>
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

// ---- Tahap 5: Loading ----
function LoadingStage() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-4 text-center px-6"
    >
      <Loader2 size={32} className="animate-spin text-ink/80" />
      <p className="font-body text-sm text-ink-muted">Mengirim pendaftaran kamu...</p>
    </motion.div>
  );
}

// ---- Tahap 6: Sukses (dua baris teks bertahap) ----
function SuccessStage({ firstName, onBackHome }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: SMOOTH_EASE }}
      className="flex flex-col items-center justify-center text-center px-6 gap-4 max-w-md mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: SMOOTH_EASE }}
        className="font-display font-extrabold text-2xl md:text-3xl text-ink"
      >
        Terima kasih telah mendaftar di SOPAN TEAM{firstName ? `, ${firstName}` : ""}! 🎉
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: SMOOTH_EASE, delay: 0.5 }}
        className="font-body text-base md:text-lg text-ink-muted"
      >
        Pendaftaran kamu sedang diproses oleh admin. Kami akan mengabari lewat email yang kamu daftarkan.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: SMOOTH_EASE, delay: 1 }}
      >
        <Button type="button" variant="secondary" onClick={onBackHome} className="mt-2">
          Kembali ke Beranda
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function JoinForm() {
  const { toast } = useToast();
  const router = useRouter();

  // stage: greeting -> question -> pickDivision -> form -> loading -> success
  const [stage, setStage] = React.useState("greeting");
  const [division, setDivision] = React.useState(null);
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

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

    setStage("loading");
    setLoading(true);
    try {
      // TODO: sambungkan ke endpoint pendaftaran (mis. Firebase / API route) di sini.
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setStage("success");
    } catch (err) {
      toast({
        variant: "error",
        title: "Gagal mengirim pendaftaran",
        description: "Coba lagi dalam beberapa saat, ya.",
      });
      setStage("form");
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center overflow-y-auto bg-base">
      {/* gradient glow, sama pola dengan WelcomePreviewSection */}
      <div className="pointer-events-none absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full opacity-20 blur-3xl bg-gradient-to-br from-remix-from via-creator-from to-transparent" />
      <div className="pointer-events-none absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full opacity-15 blur-3xl bg-gradient-to-tr from-leadis-to via-creator-from to-transparent" />

      <div className="relative z-10 w-full flex items-center justify-center py-24 px-4">
        <AnimatePresence mode="wait">
          {stage === "greeting" && (
            <GreetingStage onDone={() => setStage("question")} />
          )}
          {stage === "question" && (
            <QuestionStage onDone={() => setStage("pickDivision")} />
          )}
          {stage === "pickDivision" && (
            <PickDivisionStage
              division={division}
              onSelect={setDivision}
              onContinue={() => division && setStage("form")}
            />
          )}
          {stage === "form" && (
            <FormStage
              division={division}
              form={form}
              errors={errors}
              loading={loading}
              onChangeField={updateField}
              onBack={() => setStage("pickDivision")}
              onSubmit={handleSubmit}
            />
          )}
          {stage === "loading" && <LoadingStage />}
          {stage === "success" && (
            <SuccessStage firstName={form.firstName} onBackHome={goHome} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
