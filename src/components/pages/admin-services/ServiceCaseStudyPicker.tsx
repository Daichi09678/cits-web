"use client";

import type { CaseStudyItem } from "@/types/schema";

export default function ServiceCaseStudyPicker({
  studies,
  value,
  onChange,
}: {
  studies: CaseStudyItem[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const active = studies.filter((study) => study.isActive !== false);
  const available = new Set(active.map((study) => study.id));
  const stale = value.filter((id) => !available.has(id));
  return (
    <fieldset className="min-w-0 space-y-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
      <legend className="px-1 text-xs font-semibold text-slate-800 dark:text-slate-100">Studi Kasus Terkait</legend>
      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Pilih proyek Portofolio untuk tombol Lihat Studi Kasus. Tautan akan membuka detail proyek berdasarkan ID.
      </p>
      <div className="max-h-60 space-y-2 overflow-y-auto">
        {active.map((study) => (
          <label
            key={study.id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 text-xs leading-relaxed dark:border-white/10"
          >
            <input
              type="checkbox"
              aria-label={`Hubungkan studi kasus ${study.title}`}
              checked={value.includes(study.id)}
              onChange={(event) =>
                onChange(event.target.checked ? [...value, study.id] : value.filter((id) => id !== study.id))
              }
              className="mt-0.5 size-4 shrink-0 accent-orange-600"
            />
            <span className="min-w-0">
              <span className="block font-semibold text-slate-800 dark:text-slate-100">{study.title}</span>
              <span className="mt-1 block text-slate-500">{study.clientShort || study.client}</span>
            </span>
          </label>
        ))}
        {active.length === 0 && (
          <p className="text-xs text-slate-500">Belum ada studi kasus aktif. Tambahkan melalui editor Portofolio.</p>
        )}
      </div>
      {stale.length > 0 && (
        <button
          type="button"
          onClick={() => onChange(value.filter((id) => available.has(id)))}
          className="min-h-10 text-xs font-semibold text-orange-700 dark:text-orange-300"
        >
          Bersihkan {stale.length} referensi yang dihapus/nonaktif
        </button>
      )}
    </fieldset>
  );
}
