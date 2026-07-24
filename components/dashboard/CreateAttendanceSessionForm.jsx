"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, Check, ArrowRight, Loader2 } from "lucide-react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { DIVISIONS_ABSENSI } from "@/lib/absensi";
import { createAttendanceSession } from "@/app/dashboard/absensi/actions";

const DURATION_PRESETS = [15, 30, 60, 120];

function todayDateValue() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function nowTimeValue() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CreateAttendanceSessionForm() {
  const { toast } = useToast();
  const [division, setDivision] = React.useState("remix");
  const [date, setDate] = React.useState(todayDateValue());
  const [startTime, setStartTime] = React.useState(nowTimeValue());
  const [duration, setDuration] = React.useState(60);
  const [isPending, setIsPending] = React.useState(false);
  const [created, setCreated] = React.useState(null);
  const [copied, setCopied] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setCreated(null);

    const result = await createAttendanceSession({
      division,
      date,
      startTime,
      durationMinutes: duration,
    });

    setIsPending(false);

    if (result.error) {
      toast({
        variant: "error",
        title: "Gagal membuat sesi",
        description: result.error,
      });
      return;
    }

    setCreated(result.session);
    setCopied(false);
    toast({ variant: "success", title: "Sesi absensi dibuat" });
  };

  const link = created
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/absensi/${created.room_id}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard gak tersedia -- gapapa, user bisa select manual.
    }
  };

  return (
    <div className="rounded-2xl border border-black/[0.06] p-5 mb-8">
      <p className="font-display font-bold text-sm text-[#111827] mb-1">
        Buat Sesi Absensi Baru
      </p>
      <p className="text-xs text-black/45 mb-4">
        Pilih divisi, tentukan tanggal & jam mulai, serta durasi sesi.
        Link absensi bakal digenerate otomatis buat dibagikan ke anggota.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-xs font-medium text-black/60 mb-2">Divisi</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(DIVISIONS_ABSENSI).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDivision(d.id)}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  division === d.id
                    ? "border-black/20"
                    : "border-black/[0.08] hover:border-black/15"
                }`}
                style={{
                  background:
                    division === d.id
                      ? `linear-gradient(135deg, ${d.accentFrom}18, ${d.accentTo}18)`
                      : undefined,
                }}
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full mb-1.5"
                  style={{
                    background: `linear-gradient(135deg, ${d.accentFrom}, ${d.accentTo})`,
                  }}
                />
                <p className="text-xs font-semibold text-[#111827]">{d.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <TextField
            id="tanggalSesi"
            type="date"
            label="Tanggal"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <TextField
            id="jamMulaiSesi"
            type="time"
            label="Jam mulai"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <TextField
            id="durasiSesi"
            type="number"
            label="Durasi (menit)"
            min={5}
            step={5}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DURATION_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setDuration(p)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                Number(duration) === p
                  ? "bg-black/10 text-black/80"
                  : "bg-black/[0.04] text-black/50 hover:bg-black/[0.08]"
              }`}
            >
              {p >= 60 ? `${p / 60} jam` : `${p} menit`}
            </button>
          ))}
        </div>

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Buat Sesi & Generate Link"
          )}
        </Button>
      </form>

      {created && (
        <div className="mt-5 rounded-2xl border border-black/[0.08] bg-black/[0.02] p-4">
          <p className="text-xs text-black/50 mb-2">
            Link sesi absensi divisi{" "}
            <span className="font-semibold text-[#111827]">
              {DIVISIONS_ABSENSI[created.division]?.name}
            </span>{" "}
            — share ke anggota:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-black/5 px-3 py-2.5 text-xs text-black/80">
              {link}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy link"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5 hover:bg-black/10 transition-colors text-black/70"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          <Link href={`/absensi/${created.room_id}`} className="block mt-3">
            <Button variant="secondary" className="w-full h-10 gap-2">
              Buka Room Absensi <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
