"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import { TextField } from "./ui/text-field";
import { TextareaField } from "./ui/textarea-field";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";
import { submitRegistrant } from "@/app/gabung/actions";

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
    name: "Creator Ladies",
    description: "Panggung buat kreator perempuan.",
    accentFrom: "#FFD166",
    accentTo: "#FF6FB5",
    image:
      "https://images.unsplash.com/photo-1744418939745-a4f22552b992?w=128&h=128&fit=crop&auto=format&q=70",
  },
];

const WHATSAPP_REGEX = /^(\+?\d[\d\s-]{7,15}\d)$/;

const TERMS_SECTIONS = [
  {
    title: "1. Keanggotaan",
    body: "Keanggotaan SOPAN TEAM bersifat sukarela. Tim admin berhak menyeleksi calon member lewat form ini, chat/telepon WhatsApp, dan masa trial sebelum status Member Resmi diberikan.",
  },
  {
    title: "2. Proses seleksi",
    body: "Setelah mendaftar, data kamu direview admin lalu (kalau lolos) dihubungi lewat WhatsApp untuk sesi seleksi. Lolos seleksi, kamu masuk masa Trial Member 2\u20134 minggu sebelum jadi Member Resmi.",
  },
  {
    title: "3. Kewajiban member",
    body: "Setiap member diharapkan berperilaku sopan, saling menghargai antar kreator, dan tidak menyalahgunakan nama SOPAN TEAM untuk kepentingan pribadi yang merugikan komunitas.",
  },
  {
    title: "4. Konten & karya",
    body: "Karya yang kamu buat tetap jadi hak milik kamu. SOPAN TEAM dapat menampilkan karya member di situs atau media sosial resmi sebagai showcase, dengan kredit yang sesuai.",
  },
  {
    title: "5. Data pendaftaran",
    body: "Data yang kamu isi (nama, umur, domisili, nomor WhatsApp, dll.) hanya dipakai untuk proses seleksi dan komunikasi internal SOPAN TEAM, tidak dibagikan ke pihak luar.",
  },
];

const SMOOTH_EASE = [0.22, 1, 0.36, 1];

// ---- Timing tiap tahap animasi teks pembuka (mirip WelcomePreviewSection) ----
const GREETING_TEXT = "Halo, Calon Anggota SOPAN TEAM!";
const CHAR_DELAY_MS = 28;
const CHAR_DURATION_MS = 500;
const GREETING_REVEAL_MS = (GREETING_TEXT.length - 1) * CHAR_DELAY_MS + CHAR_DURATION_MS;
const GREETING_HOLD_MS = 1100;
const GREETING_EXIT_MS = 450;

const QUESTION_LINE_1 = "SOPAN TEAM Memiliki Tiga Divisi";
const QUESTION_LINE_2 = "Silakan Pilih Sesuai Kemampuanmu";
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
              <div className="flex items-center gap-3">
                <span
                  className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full"
                  style={{ boxShadow: `0 0 0 2px ${item.accentTo}55` }}
                >
                  <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                </span>
                <span className="font-display font-bold text-lg text-ink">{item.name}</span>
              </div>
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

// ---- Tahap 3.5: Ketentuan (harus discroll sampai bawah dulu) ----
function TermsStage({ division, onBack, onAgree }) {
  const selected = DIVISIONS.find((d) => d.id === division);
  const contentRef = React.useRef(null);
  const [hasReadToBottom, setHasReadToBottom] = React.useState(false);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const scrollPercentage = el.scrollTop / (el.scrollHeight - el.clientHeight);
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  return (
    <motion.div
      key="terms"
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
          Sebelum Lanjut
        </span>
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-ink mt-2">
          Baca dulu ketentuan calon anggota{" "}
          <span style={{ color: selected?.accentTo }}>{selected?.name}</span>
        </h2>
      </div>

      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] overflow-hidden">
        <div
          ref={contentRef}
          onScroll={handleScroll}
          data-lenis-prevent
          className="max-h-[45vh] overflow-y-auto px-5 py-4 space-y-4"
        >
          {TERMS_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="font-display font-bold text-sm text-ink">{section.title}</p>
              <p className="font-body text-sm text-ink-muted leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-black/10 dark:border-white/10 px-5 py-3 flex items-center gap-2">
          {hasReadToBottom ? (
            <>
              <Check size={14} className="text-emerald-500 shrink-0" />
              <span className="text-xs text-ink-muted">Sudah dibaca sampai bawah</span>
            </>
          ) : (
            <span className="text-xs text-ink-dim">
              Scroll sampai bawah dulu buat lanjut
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          type="button"
          size="lg"
          disabled={!hasReadToBottom}
          onClick={onAgree}
          className="px-8 disabled:opacity-40"
        >
          Saya Setuju & Lanjut
        </Button>
      </div>

      <p className="text-center text-xs text-ink-dim mt-4">
        Baca versi lengkapnya di{" "}
        <Link href="/ketentuan" target="_blank" className="underline hover:text-ink-muted">
          halaman Ketentuan Layanan
        </Link>
      </p>
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
        <ArrowLeft size={14} /> Kembali
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
        className="space-y-6"
      >
        <TextField
          id="fullName"
          label="Nama lengkap / nama panggilan"
          placeholder="Raka Aditya"
          value={form.fullName}
          onChange={onChangeField("fullName")}
          error={errors.fullName}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="age"
            type="number"
            inputMode="numeric"
            min="1"
            label="Umur"
            placeholder="19"
            value={form.age}
            onChange={onChangeField("age")}
            error={errors.age}
          />
          <TextField
            id="domicile"
            label="Domisili"
            placeholder="Bandung"
            value={form.domicile}
            onChange={onChangeField("domicile")}
            error={errors.domicile}
          />
        </div>

        <TextField
          id="whatsapp"
          type="tel"
          inputMode="tel"
          label="Nomor WhatsApp"
          placeholder="0812xxxxxxx"
          value={form.whatsapp}
          onChange={onChangeField("whatsapp")}
          error={errors.whatsapp}
        />

        <TextareaField
          id="experience"
          label="Pengalaman"
          placeholder={`Ceritain pengalaman kamu di dunia ${selected?.name ?? "ini"}...`}
          rows={3}
          value={form.experience}
          onChange={onChangeField("experience")}
          error={errors.experience}
        />

        <TextField
          id="portfolio"
          type="url"
          label="Link portofolio / karya (opsional)"
          placeholder="https://instagram.com/username"
          value={form.portfolio}
          onChange={onChangeField("portfolio")}
          error={errors.portfolio}
        />

        <TextareaField
          id="reason"
          label="Alasan ingin bergabung"
          placeholder="Kenapa kamu pengen jadi bagian dari SOPAN TEAM?"
          rows={3}
          value={form.reason}
          onChange={onChangeField("reason")}
          error={errors.reason}
        />

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
function SuccessStage({ name, onBackHome }) {
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
        Terima kasih telah mendaftar di SOPAN TEAM{name ? `, ${name}` : ""}! 🎉
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: SMOOTH_EASE, delay: 0.5 }}
        className="font-body text-base md:text-lg text-ink-muted"
      >
        Data kamu sedang direview admin. Kalau lolos pengecekan awal, kami akan
        menghubungi kamu lewat nomor WhatsApp yang kamu daftarkan untuk sesi seleksi.
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

  // stage: greeting -> question -> pickDivision -> terms -> form -> loading -> success
  const [stage, setStage] = React.useState("greeting");
  const [division, setDivision] = React.useState(null);
  const [form, setForm] = React.useState({
    fullName: "",
    age: "",
    domicile: "",
    whatsapp: "",
    experience: "",
    portfolio: "",
    reason: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Nama wajib diisi";

    const ageNum = Number(form.age);
    if (!form.age) {
      next.age = "Umur wajib diisi";
    } else if (!Number.isInteger(ageNum) || ageNum < 10 || ageNum > 100) {
      next.age = "Masukkan umur yang valid";
    }

    if (!form.domicile.trim()) next.domicile = "Domisili wajib diisi";

    if (!form.whatsapp.trim()) {
      next.whatsapp = "Nomor WhatsApp wajib diisi";
    } else if (!WHATSAPP_REGEX.test(form.whatsapp.trim())) {
      next.whatsapp = "Format nomor WhatsApp tidak valid";
    }

    if (!form.experience.trim()) next.experience = "Ceritain pengalaman kamu dulu, ya";
    if (!form.reason.trim()) next.reason = "Alasan bergabung wajib diisi";

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
      const result = await submitRegistrant({
        fullName: form.fullName,
        age: Number(form.age),
        domicile: form.domicile,
        whatsapp: form.whatsapp,
        division,
        experience: form.experience,
        portfolio: form.portfolio,
        reason: form.reason,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setStage("success");
    } catch (err) {
      toast({
        variant: "error",
        title: "Gagal mengirim pendaftaran",
        description: err.message || "Coba lagi dalam beberapa saat, ya.",
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
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[6000] overflow-x-hidden overflow-y-auto bg-base"
    >
      {/* gradient glow, sama pola dengan WelcomePreviewSection */}
      <div className="pointer-events-none absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full opacity-20 blur-3xl bg-gradient-to-br from-remix-from via-creator-from to-transparent" />
      <div className="pointer-events-none absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full opacity-15 blur-3xl bg-gradient-to-tr from-leadis-to via-creator-from to-transparent" />

      <div className="relative z-10 min-h-full w-full flex flex-col items-center justify-center py-16 px-4 sm:py-24">
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
              onContinue={() => division && setStage("terms")}
            />
          )}
          {stage === "terms" && (
            <TermsStage
              division={division}
              onBack={() => setStage("pickDivision")}
              onAgree={() => setStage("form")}
            />
          )}
          {stage === "form" && (
            <FormStage
              division={division}
              form={form}
              errors={errors}
              loading={loading}
              onChangeField={updateField}
              onBack={() => setStage("terms")}
              onSubmit={handleSubmit}
            />
          )}
          {stage === "loading" && <LoadingStage />}
          {stage === "success" && (
            <SuccessStage name={form.fullName.split(" ")[0]} onBackHome={goHome} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
