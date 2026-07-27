"use client";

import * as React from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  ArrowRight,
  Loader2,
  CalendarPlus,
} from "lucide-react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { DIVISIONS_ABSENSI } from "@/lib/absensi";
import { createAttendanceSession } from "@/app/dashboard/absensi/actions";

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

// Default jam selesai = 1 jam setelah sekarang, biar admin nggak wajib
// isi manual kalau memang mau durasi standar -- tapi tetap bisa diubah
// bebas ke jam berapa pun.
function defaultEndTimeValue() {
  const d = new Date(Date.now() + 60 * 60000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CreateAttendanceSessionForm() {
  const { toast } = useToast();
  const [division, setDivision] = React.useState("remix");
  const [date, setDate] = React.useState(todayDateValue());
  const [startTime, setStartTime] = React.useState(nowTimeValue());
  const [endTime, setEndTime] = React.useState(defaultEndTimeValue());
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
      endTime,
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
      <div className="flex items-start gap-3 mb-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1677F5]/10 text-[#1677F5]">
          <CalendarPlus size={17} />
        </span>
        <div>
          <p className="font-display font-bold text-sm text-[#111827]">
            Buat Sesi Absensi Baru
          </p>
          <p className="text-xs text-black/45 mt-0.5">
            Pilih divisi, lalu tentukan jam mulai dan jam selesai sesi.
            Link absensi digenerate otomatis buat dibagikan ke anggota.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="text-xs font-medium text-black/60 mb-2">Divisi</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(DIVISIONS_ABSENSI).map((d) => {
              const isActive = division === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDivision(d.id)}
                  aria-pressed={isActive}
                  className={`relative overflow-hidden rounded-xl border p-3 pl-4 text-left transition-all ${
                    isActive
                      ? "border-black/15 bg-black/[0.03]"
                      : "border-black/[0.08] hover:border-black/15 hover:bg-black/[0.02]"
                  }`}
                >
                  <span
                    className="absolute inset-y-2.5 left-1.5 w-[3px] rounded-full transition-opacity"
                    style={{
                      background: `linear-gradient(180deg, ${d.accentFrom}, ${d.accentTo})`,
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${d.accentFrom}, ${d.accentTo})`,
                      }}
                    />
                    <p className="text-xs font-semibold text-[#111827] truncate">
                      {d.name}
                    </p>
                  </span>
                  {isActive && (
                    <Check
                      size={13}
                      className="absolute top-2.5 right-2.5 text-[#1677F5]"
                      strokeWidth={2.5}
                    />
                  )}
                </button>
              );
            })}
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
            id="jamSelesaiSesi"
            type="time"
            label="Jam selesai"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <p className="text-xs text-black/40 -mt-2">
          Jam mulai/selesai pakai patokan <strong>WIB</strong>. Sesi
          otomatis terbuka begitu jam mulai tiba, dan tertutup begitu jam
          selesai lewat — <strong>kebuka di waktu yang sama buat semua
          anggota</strong>, apa pun zona waktu HP mereka (WIB/WITA/WIT).
        </p>

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
          <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-2.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
              <Check size={10} strokeWidth={3} />
            </span>
            Sesi berhasil dibuat
          </p>
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
