"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";

/**
 * ChipField — input daftar nilai (fitur / kapabilitas / tag) berbentuk centang.
 *
 * Dipakai di modal tambah-edit produk dan layanan. Nilai tersimpan sebagai
 * array string; pemanggil bebas mengubahnya ke format lama (koma / baris baru)
 * agar kompatibel dengan API yang sudah ada.
 */
export interface ChipFieldProps {
  /** Judul field, mis. "Fitur Utama". */
  label: string;
  /** Petunjuk singkat di bawah judul. */
  hint?: string;
  /** Nilai terpilih saat ini. */
  value: string[];
  /** Dipanggil setiap daftar berubah. */
  onChange: (next: string[]) => void;
  /** Pilihan cepat yang ditampilkan sebagai kotak centang. */
  presets?: string[];
  /** Placeholder kolom isian bebas. */
  placeholder?: string;
  /** Warna aksen (default orange). */
  accent?: "orange" | "emerald";
}

const ACCENT = {
  orange: {
    chip: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-200 dark:border-orange-500/30",
    input: "focus:ring-orange-500",
    button: "bg-orange-600 hover:bg-orange-700 text-white",
    check: "accent-orange-600",
  },
  emerald: {
    chip: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30",
    input: "focus:ring-emerald-500",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white",
    check: "accent-emerald-600",
  },
} as const;

export default function ChipField({
  label,
  hint,
  value,
  onChange,
  presets = [],
  placeholder = "Tulis lalu tekan Enter untuk menambah",
  accent = "orange",
}: ChipFieldProps) {
  const [draft, setDraft] = useState("");
  const colors = ACCENT[accent];
  const selected = value.filter((item) => item.trim().length > 0);

  const has = (item: string) => selected.some((existing) => existing.toLowerCase() === item.toLowerCase());

  const add = (raw: string) => {
    const items = raw
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (items.length === 0) return;

    const next = [...selected];
    for (const item of items) {
      if (!next.some((existing) => existing.toLowerCase() === item.toLowerCase())) next.push(item);
    }
    onChange(next);
    setDraft("");
  };

  const remove = (item: string) => onChange(selected.filter((existing) => existing !== item));

  const togglePreset = (item: string) => {
    if (has(item)) {
      remove(item);
      return;
    }
    add(item);
  };

  return (
    <div className="space-y-2.5">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{label}</label>
        {hint && <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{hint}</p>}
      </div>

      {/* Nilai terpilih */}
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-2.5">
          {selected.map((item) => (
            <span
              key={item}
              className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold ${colors.chip}`}
            >
              {item}
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Hapus ${item}`}
                className="rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/20 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400">
          Belum ada item dipilih. Centang pilihan cepat di bawah atau tulis sendiri.
        </p>
      )}

      {/* Isian bebas */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add(draft);
            }
          }}
          placeholder={placeholder}
          className={`min-w-0 flex-1 rounded-xl bg-white dark:bg-[#121224] border border-slate-200 dark:border-white/10 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${colors.input}`}
        />
        <button
          type="button"
          onClick={() => add(draft)}
          disabled={draft.trim().length === 0}
          className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${colors.button}`}
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah
        </button>
      </div>

      {/* Pilihan cepat (centang) */}
      {presets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/5 p-2.5 max-h-40 overflow-y-auto">
          {presets.map((preset) => {
            const checked = has(preset);
            return (
              <label
                key={preset}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-semibold cursor-pointer transition-colors ${
                  checked
                    ? "bg-orange-50 dark:bg-orange-500/10 text-orange-800 dark:text-orange-200"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePreset(preset)}
                  className={`h-4 w-4 shrink-0 rounded cursor-pointer ${colors.check}`}
                />
                <span className="truncate" title={preset}>
                  {preset}
                </span>
                {checked && <Check className="ml-auto h-3 w-3 shrink-0 opacity-70" />}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
