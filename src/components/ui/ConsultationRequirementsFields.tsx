"use client";

import { CONSULTATION_PURPOSES } from "@/lib/consultation";
import type { ConsultationPurpose } from "@/types/schema";

export interface RequirementsFormValue {
  purpose: ConsultationPurpose;
  expectedOutcome: string;
  currentSystem: string;
  timeline: string;
  usageEstimate: string;
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#121222] px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-600";

export default function ConsultationRequirementsFields({
  value,
  onChange,
}: {
  value: RequirementsFormValue;
  onChange: (value: RequirementsFormValue) => void;
}) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-slate-200 dark:border-white/10 p-4">
      <legend className="px-1 text-sm font-bold text-slate-900 dark:text-white">
        Tujuan & Hasil yang Anda Inginkan
      </legend>
      <div>
        <label
          htmlFor="consultation-purpose"
          className="block text-xs font-semibold text-slate-800 dark:text-slate-100"
        >
          Tujuan Konsultasi
        </label>
        <select
          id="consultation-purpose"
          value={value.purpose}
          onChange={(event) => onChange({ ...value, purpose: event.target.value as ConsultationPurpose })}
          className={inputClass}
        >
          {(["discussion", "demo"] as const).map((key) => (
            <option key={key} value={key}>
              {key === "discussion" ? "Konsultasi Saja" : CONSULTATION_PURPOSES[key]}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs leading-relaxed font-normal text-slate-600 dark:text-slate-300">
          {value.purpose === "demo"
            ? "Tim CITS akan membahas kebutuhan Anda sekaligus menindaklanjuti permintaan demo produk yang dipilih. Jadwal demo dikonfirmasi setelah formulir diterima."
            : "Tim CITS akan membahas kebutuhan dan pertanyaan Anda terlebih dahulu. Anda dapat mengubah pilihan ini jika ingin sekaligus meminta demo."}
        </p>
      </div>
      <label className="block text-xs font-semibold text-slate-800 dark:text-slate-100">
        Hasil yang Diharapkan (opsional)
        <textarea
          rows={2}
          maxLength={2000}
          value={value.expectedOutcome}
          onChange={(event) => onChange({ ...value, expectedOutcome: event.target.value })}
          placeholder="Contoh: ingin mempercepat pencarian arsip dan membatasi akses dokumen per divisi."
          className={inputClass}
        />
      </label>
      <label className="block text-xs font-semibold text-slate-800 dark:text-slate-100">
        Sistem / Cara Kerja Saat Ini (opsional)
        <textarea
          rows={2}
          maxLength={2000}
          value={value.currentSystem}
          onChange={(event) => onChange({ ...value, currentSystem: event.target.value })}
          placeholder="Contoh: masih menggunakan Excel, arsip fisik, atau aplikasi lama yang perlu diintegrasikan."
          className={inputClass}
        />
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-xs font-semibold text-slate-800 dark:text-slate-100">
          Target Waktu (opsional)
          <input
            maxLength={200}
            value={value.timeline}
            onChange={(event) => onChange({ ...value, timeline: event.target.value })}
            placeholder="Contoh: 3 bulan / awal 2027"
            className={inputClass}
          />
        </label>
        <label className="block text-xs font-semibold text-slate-800 dark:text-slate-100">
          Perkiraan Penggunaan (opsional)
          <input
            maxLength={200}
            value={value.usageEstimate}
            onChange={(event) => onChange({ ...value, usageEstimate: event.target.value })}
            placeholder="Contoh: 20 pengguna, 5.000 dokumen"
            className={inputClass}
          />
        </label>
      </div>
    </fieldset>
  );
}
