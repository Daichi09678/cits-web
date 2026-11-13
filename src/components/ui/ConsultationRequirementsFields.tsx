"use client";

import { CONSULTATION_PURPOSES } from "@/lib/consultation";
import type { ConsultationPurpose } from "@/types/schema";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export interface RequirementsFormValue {
  purpose: ConsultationPurpose;
  expectedOutcome: string;
  currentSystem: string;
  timeline: string;
  usageEstimate: string;
}

// Label, jarak, dan ukuran kontrol mengikuti form kontak induk supaya seluruh
// isian terlihat sebagai satu sistem (bukan blok dengan skala sendiri).
const labelClass = "block text-sm font-bold text-gray-800 dark:text-white/90 mb-1.5";
const hintClass = "mt-2 text-sm leading-relaxed font-normal text-gray-600 dark:text-gray-300";
const textareaClass =
  "w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-relaxed text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-white/15 dark:bg-[#121222] dark:text-white dark:placeholder:text-white/40";

export default function ConsultationRequirementsFields({
  value,
  onChange,
}: {
  value: RequirementsFormValue;
  onChange: (value: RequirementsFormValue) => void;
}) {
  return (
    <fieldset className="space-y-4 sm:space-y-5">
      <legend className="mb-1 block text-sm font-bold tracking-wider text-gray-800 uppercase dark:text-white/90">
        Tujuan &amp; Hasil yang Anda Inginkan
      </legend>
      <div>
        <label htmlFor="consultation-purpose" className={labelClass}>
          Tujuan Konsultasi
        </label>
        <Select
          selectSize="md"
          id="consultation-purpose"
          value={value.purpose}
          onChange={(event) => onChange({ ...value, purpose: event.target.value as ConsultationPurpose })}
        >
          {(["discussion", "demo"] as const).map((key) => (
            <option key={key} value={key}>
              {key === "discussion" ? "Konsultasi Saja" : CONSULTATION_PURPOSES[key]}
            </option>
          ))}
        </Select>
        <p className={hintClass}>
          {value.purpose === "demo"
            ? "Tim CITS akan membahas kebutuhan Anda sekaligus menindaklanjuti permintaan demo produk yang dipilih. Jadwal demo dikonfirmasi setelah formulir diterima."
            : "Tim CITS akan membahas kebutuhan dan pertanyaan Anda terlebih dahulu. Anda dapat mengubah pilihan ini jika ingin sekaligus meminta demo."}
        </p>
      </div>

      <div>
        <label htmlFor="consultation-outcome" className={labelClass}>
          Hasil yang Diharapkan (opsional)
        </label>
        <textarea
          id="consultation-outcome"
          rows={2}
          maxLength={2000}
          value={value.expectedOutcome}
          onChange={(event) => onChange({ ...value, expectedOutcome: event.target.value })}
          placeholder="Contoh: ingin mempercepat pencarian arsip dan membatasi akses dokumen per divisi."
          className={textareaClass}
        />
      </div>

      <div>
        <label htmlFor="consultation-current" className={labelClass}>
          Sistem / Cara Kerja Saat Ini (opsional)
        </label>
        <textarea
          id="consultation-current"
          rows={2}
          maxLength={2000}
          value={value.currentSystem}
          onChange={(event) => onChange({ ...value, currentSystem: event.target.value })}
          placeholder="Contoh: masih menggunakan Excel, arsip fisik, atau aplikasi lama yang perlu diintegrasikan."
          className={textareaClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div>
          <label htmlFor="consultation-timeline" className={labelClass}>
            Target Waktu (opsional)
          </label>
          <Input
            fieldSize="md"
            id="consultation-timeline"
            maxLength={200}
            value={value.timeline}
            onChange={(event) => onChange({ ...value, timeline: event.target.value })}
            placeholder="Contoh: 3 bulan / awal 2027"
          />
        </div>
        <div>
          <label htmlFor="consultation-usage" className={labelClass}>
            Perkiraan Penggunaan (opsional)
          </label>
          <Input
            fieldSize="md"
            id="consultation-usage"
            maxLength={200}
            value={value.usageEstimate}
            onChange={(event) => onChange({ ...value, usageEstimate: event.target.value })}
            placeholder="Contoh: 20 pengguna, 5.000 dokumen"
          />
        </div>
      </div>
    </fieldset>
  );
}
