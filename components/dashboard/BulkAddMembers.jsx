"use client";

import * as React from "react";
import { Loader2, Copy, X, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { bulkCreateMembers } from "@/app/dashboard/anggota/bulk-actions";

const DIVISIONS = [
  { value: "remix", label: "Remix" },
  { value: "creator", label: "Creator" },
  { value: "leadis", label: "Leadis" },
];

// Bersihin format list WA yang biasa dipaste admin, misal:
// "1. CANDRA SOPAN" atau "2. ⁠DJ SOPAN" (ada karakter zero-width invisible)
// jadi cuma "CANDRA SOPAN" / "DJ SOPAN".
function parseNames(raw) {
  return raw
    .split("\n")
    .map((line) =>
      line
        .replace(/[\u200B-\u200D\uFEFF\u2060]/g, "") // buang karakter invisible
        .replace(/^\s*\d+[.)]\s*/, "") // buang "1. " / "2) " di depan
        .replace(/^[-•*]\s*/, "") // buang bullet "- " / "• "
        .trim()
    )
    .filter(Boolean);
}

function CopyBtn({ value, label }) {
  const { toast } = useToast();
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          toast({ variant: "success", title: `${label} disalin` });
        } catch {
          toast({ variant: "error", title: "Gagal menyalin" });
        }
      }}
      className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black/80 transition-colors"
      aria-label={`Salin ${label}`}
    >
      <Copy size={13} />
    </button>
  );
}

export default function BulkAddMembers() {
  const { toast } = useToast();
  const [step, setStep] = React.useState("input"); // input | preview | result
  const [rawText, setRawText] = React.useState("");
  const [entries, setEntries] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState(null); // { results, errors }

  const handleParse = () => {
    const names = parseNames(rawText);
    if (names.length === 0) {
      toast({ variant: "error", title: "Belum ada nama yang terdeteksi" });
      return;
    }
    setEntries(names.map((name) => ({ name, division: "creator" })));
    setStep("preview");
  };

  const updateEntry = (index, patch) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  };

  const removeEntry = (index) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const setAllDivision = (division) => {
    setEntries((prev) => prev.map((e) => ({ ...e, division })));
  };

  const handleSubmit = async () => {
    if (entries.length === 0) return;
    setIsSubmitting(true);
    const res = await bulkCreateMembers(entries);
    setIsSubmitting(false);
    setResult(res);
    setStep("result");
    if (res.results.length > 0) {
      toast({ variant: "success", title: `${res.results.length} akun berhasil dibuat` });
    }
    if (res.errors.length > 0) {
      toast({ variant: "error", title: `${res.errors.length} nama gagal diproses` });
    }
  };

  const copyAllAsText = () => {
    if (!result?.results?.length) return;
    const text = result.results
      .map(
        (r) =>
          `${r.name}\nEmail: ${r.email}\nPassword: ${r.password}\nAktivasi: ${r.activationLink}\n`
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    toast({ variant: "success", title: "Semua kredensial disalin" });
  };

  // ---------- STEP 1: paste nama ----------
  if (step === "input") {
    return (
      <div className="rounded-2xl border border-black/[0.06] p-5">
        <p className="text-sm text-black/60 mb-3">
          Tempel daftar nama, satu nama per baris. Format nomor/bullet di depan
          (mis. <span className="font-mono text-xs bg-black/5 px-1 rounded">1. CANDRA SOPAN</span>)
          otomatis dibersihkan.
        </p>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={10}
          placeholder={"1. CANDRA SOPAN\n2. DJ SOPAN\n3. FERI SOPAN\n..."}
          className="w-full rounded-xl border border-black/10 p-3 text-sm font-mono outline-none focus:border-black/30 transition-colors"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-black/40">
            {parseNames(rawText).length} nama terdeteksi
          </span>
          <button
            type="button"
            onClick={handleParse}
            className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            Lanjut &rarr; Atur Divisi
          </button>
        </div>
      </div>
    );
  }

  // ---------- STEP 2: preview & atur divisi per nama ----------
  if (step === "preview") {
    return (
      <div className="rounded-2xl border border-black/[0.06] p-5">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setStep("input")}
            className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black/80 transition-colors"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
          <span className="text-sm text-black/50">{entries.length} nama</span>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl bg-black/[0.03] p-3">
          <span className="text-xs text-black/50 shrink-0">Set semua jadi divisi:</span>
          {DIVISIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setAllDivision(d.value)}
              className="rounded-lg border border-black/10 bg-white px-2.5 py-1 text-xs font-medium text-black/70 hover:bg-black/5 transition-colors"
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {entries.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-black/[0.06] p-2.5"
            >
              <input
                value={entry.name}
                onChange={(e) => updateEntry(i, { name: e.target.value })}
                className="flex-1 min-w-0 bg-transparent text-sm font-medium text-[#111827] outline-none"
              />
              <select
                value={entry.division}
                onChange={(e) => updateEntry(i, { division: e.target.value })}
                className="rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs font-medium text-black/70 outline-none"
              >
                {DIVISIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeEntry(i)}
                className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-black/40 hover:bg-red-50 hover:text-red-600 transition-colors"
                aria-label={`Hapus ${entry.name}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || entries.length === 0}
            className="flex items-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            Buat {entries.length} Akun Sekarang
          </button>
        </div>
      </div>
    );
  }

  // ---------- STEP 3: hasil ----------
  return (
    <div className="rounded-2xl border border-black/[0.06] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <h3 className="font-display font-bold text-base text-[#111827]">
            {result?.results?.length || 0} akun berhasil dibuat
          </h3>
        </div>
        {result?.results?.length > 0 && (
          <button
            type="button"
            onClick={copyAllAsText}
            className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-black/70 hover:bg-black/5 transition-colors"
          >
            Salin semua sebagai teks
          </button>
        )}
      </div>

      <p className="text-xs text-black/50 mb-4">
        Password &amp; link aktivasi cuma ditampilkan sekali di sini — salin
        sekarang dan kirim manual ke tiap member lewat WhatsApp (personal chat,
        bukan grup, biar akun orang lain gak kelihatan sesama member).
      </p>

      {result?.errors?.length > 0 && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 space-y-1">
          {result.errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {(result?.results || []).map((r, i) => (
          <div key={i} className="rounded-xl border border-black/[0.08] p-3.5">
            <p className="text-sm font-semibold text-[#111827] mb-2">{r.name}</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-black/40 w-16 shrink-0">Email</span>
                <span className="flex-1 truncate font-mono">{r.email}</span>
                <CopyBtn value={r.email} label="Email" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-black/40 w-16 shrink-0">Password</span>
                <span className="flex-1 truncate font-mono">{r.password}</span>
                <CopyBtn value={r.password} label="Password" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-black/40 w-16 shrink-0">Aktivasi</span>
                <span className="flex-1 truncate font-mono">{r.activationLink}</span>
                <CopyBtn value={r.activationLink} label="Link aktivasi" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setStep("input");
          setRawText("");
          setEntries([]);
          setResult(null);
        }}
        className="mt-4 text-sm text-black/50 hover:text-black/80 transition-colors"
      >
        &larr; Tambah lagi
      </button>
    </div>
  );
}
