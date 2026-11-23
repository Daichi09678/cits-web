"use client";
import FieldLabel from "@/components/ui/FieldLabel";

import { CONSULTATION_PURPOSES } from "@/lib/consultation";
import type { ConsultationPurpose } from "@/types/schema";
import Input, { Textarea } from "@/components/ui/Input";
import PublicSelect from "@/components/pages/public/PublicSelect";

export interface RequirementsFormValue {
  purpose: ConsultationPurpose;
  expectedOutcome: string;
  currentSystem: string;
  timeline: string;
  usageEstimate: string;
}

const hintClass = "mt-2 text-sm leading-relaxed font-normal text-gray-600 dark:text-gray-300";
const purposeHints: Record<ConsultationPurpose, string> = {
  discussion: "Ceritakan kebutuhan atau kendala Anda sebagai bahan diskusi dengan tim CITS.",
  demo: "Tim CITS akan menghubungi Anda untuk membahas kebutuhan dan mengatur jadwal demo produk.",
  quotation: "Sampaikan kebutuhan Anda agar tim CITS dapat menyiapkan penawaran yang sesuai.",
  customization: "Jelaskan sistem yang ingin dikembangkan atau disesuaikan dengan kebutuhan Anda.",
  support: "Ceritakan sistem dan kendala yang membutuhkan dukungan atau pemeliharaan.",
};

export default function ConsultationRequirementsFields({
  value,
  onChange,
}: {
  value: RequirementsFormValue;
  onChange: (value: RequirementsFormValue) => void;
}) {
  return (
    <fieldset className="space-y-4 sm:space-y-5">
      <legend className="mb-4 block text-sm font-bold text-gray-800 dark:text-white/90">Detail Kebutuhan</legend>
      <div>
        <FieldLabel htmlFor="consultation-purpose" fieldSize="md">
          Jenis Konsultasi
        </FieldLabel>
        <PublicSelect
          id="consultation-purpose"
          value={value.purpose}
          onChange={(purpose) => onChange({ ...value, purpose: purpose as ConsultationPurpose })}
          options={Object.entries(CONSULTATION_PURPOSES).map(([value, label]) => ({ value, label }))}
        />
        <p className={hintClass}>{purposeHints[value.purpose]}</p>
      </div>

      <div>
        <FieldLabel htmlFor="consultation-outcome" fieldSize="md">
          Hasil yang Diharapkan (opsional)
        </FieldLabel>
        <Textarea
          id="consultation-outcome"
          rows={2}
          maxLength={2000}
          value={value.expectedOutcome}
          onChange={(event) => onChange({ ...value, expectedOutcome: event.target.value })}
          placeholder="Contoh: ingin mempercepat pencarian arsip dan membatasi akses dokumen per divisi."
          fieldSize="md"
        />
      </div>

      <div>
        <FieldLabel htmlFor="consultation-current" fieldSize="md">
          Sistem / Cara Kerja Saat Ini (opsional)
        </FieldLabel>
        <Textarea
          id="consultation-current"
          rows={2}
          maxLength={2000}
          value={value.currentSystem}
          onChange={(event) => onChange({ ...value, currentSystem: event.target.value })}
          placeholder="Contoh: masih menggunakan Excel, arsip fisik, atau aplikasi lama yang perlu diintegrasikan."
          fieldSize="md"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div>
          <FieldLabel htmlFor="consultation-timeline" fieldSize="md">
            Target Waktu (opsional)
          </FieldLabel>
          <Input
            fieldSize="md"
            id="consultation-timeline"
            type="date"
            value={value.timeline}
            onChange={(event) => onChange({ ...value, timeline: event.target.value })}
            className="[color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
        <div>
          <FieldLabel htmlFor="consultation-usage" fieldSize="md">
            Perkiraan Penggunaan (opsional)
          </FieldLabel>
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
