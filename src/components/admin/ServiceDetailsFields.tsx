"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import ServicePhoto from "@/components/ui/ServicePhoto";
import type { ServicePillar } from "@/types/schema";

export interface ServiceDetailsForm {
  image: string;
  details: string;
  techStack: string;
  caseStudies: string;
  deliverables: NonNullable<ServicePillar["deliverables"]>;
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3.5 py-2.5 text-xs font-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500";

export function ServiceImageField({
  image,
  name,
  fallbackImage,
  onChange,
}: {
  image: string;
  name: string;
  fallbackImage: string;
  onChange: (image: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState("");
  const [readingImage, setReadingImage] = useState(false);
  const changeImage = (image: string) => {
    setImageError("");
    onChange(image);
  };
  return (
    <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Foto / Gambar Layanan
          </span>
        </div>
        {image && (
          <button
            type="button"
            disabled={readingImage}
            onClick={() => {
              changeImage("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus Foto
          </button>
        )}
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121224] p-3 flex items-center gap-3.5 shadow-2xs">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 shrink-0">
          <ServicePhoto image={image || fallbackImage} name={name || "Layanan"} className="h-full" />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{image ? "Foto Layanan Berhasil Dipilih" : "Foto Bawaan Layanan"}</span>
          </div>
          {image && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {image.startsWith("data:") ? "Foto diunggah dari perangkat" : image}
            </p>
          )}
          <button
            type="button"
            disabled={readingImage}
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-[11px] font-bold text-slate-700 dark:text-white transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Upload className="w-3 h-3" />
            {readingImage ? "Membaca Foto..." : image ? "Ganti Foto" : "Unggah Foto Layanan"}
          </button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={readingImage}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
            setImageError("Gunakan JPG, PNG, atau WebP dengan ukuran maksimal 2 MB.");
            event.target.value = "";
            return;
          }
          setReadingImage(true);
          setImageError("");
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") onChange(reader.result);
            setReadingImage(false);
          };
          reader.onerror = () => {
            setImageError("Foto tidak dapat dibaca. Silakan pilih ulang.");
            setReadingImage(false);
          };
          reader.readAsDataURL(file);
        }}
      />
      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        Mendukung format PNG, JPG, atau WebP (maksimal 2 MB). Hapus foto untuk menggunakan foto bawaan.
      </p>
      {imageError && (
        <p role="alert" className="text-xs font-semibold text-red-700 dark:text-red-300">
          {imageError}
        </p>
      )}
      <label className="block text-[11px] text-slate-500 dark:text-slate-400">
        Atau masukkan Path / URL Gambar:
        <input
          value={image.startsWith("data:") ? "" : image}
          disabled={readingImage}
          onChange={(event) => changeImage(event.target.value)}
          placeholder="https://... atau /services/foto-layanan.webp"
          className={fieldClass}
        />
      </label>
    </div>
  );
}

export default function ServiceDetailsFields({
  value,
  onChange,
}: {
  value: ServiceDetailsForm;
  onChange: (value: ServiceDetailsForm) => void;
}) {
  return (
    <fieldset className="space-y-4 rounded-2xl border border-slate-200 dark:border-white/10 p-4 min-w-0">
      <legend className="px-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        Detail Layanan
      </legend>
      <div>
        <label htmlFor="service-details" className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
          Penjelasan Lengkap
        </label>
        <textarea
          id="service-details"
          rows={5}
          maxLength={8000}
          value={value.details}
          onChange={(event) => onChange({ ...value, details: event.target.value })}
          placeholder="Jelaskan kebutuhan yang dibantu, ruang lingkup pekerjaan, dan pendekatan layanan."
          className={fieldClass}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="service-technologies"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Teknologi / Standar
          </label>
          <textarea
            id="service-technologies"
            rows={4}
            value={value.techStack}
            onChange={(event) => onChange({ ...value, techStack: event.target.value })}
            placeholder="Satu teknologi atau standar per baris"
            className={fieldClass}
          />
        </div>
        <div>
          <label
            htmlFor="service-case-studies"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Contoh Implementasi
          </label>
          <textarea
            id="service-case-studies"
            rows={4}
            value={value.caseStudies}
            onChange={(event) => onChange({ ...value, caseStudies: event.target.value })}
            placeholder="Satu contoh implementasi per baris"
            className={fieldClass}
          />
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hasil yang Diserahkan</h4>
        {value.deliverables.map((item, index) => (
          <div key={index} className="rounded-xl border border-slate-200 dark:border-white/10 p-3 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
              Judul Hasil {index + 1}
              <input
                value={item.label}
                required
                maxLength={150}
                onChange={(event) =>
                  onChange({
                    ...value,
                    deliverables: value.deliverables.map((entry, current) =>
                      current === index ? { ...entry, label: event.target.value } : entry
                    ),
                  })
                }
                className={fieldClass}
              />
            </label>
            <div>
              <label
                htmlFor={`service-deliverable-${index}`}
                className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Keterangan Hasil {index + 1}
              </label>
              <textarea
                id={`service-deliverable-${index}`}
                rows={3}
                required
                maxLength={2000}
                value={item.description}
                onChange={(event) =>
                  onChange({
                    ...value,
                    deliverables: value.deliverables.map((entry, current) =>
                      current === index ? { ...entry, description: event.target.value } : entry
                    ),
                  })
                }
                className={fieldClass}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                onChange({ ...value, deliverables: value.deliverables.filter((_, current) => current !== index) })
              }
              className="text-xs font-semibold text-red-700 dark:text-red-300 underline"
            >
              Hapus Hasil {index + 1}
            </button>
          </div>
        ))}
        {value.deliverables.length < 20 && (
          <button
            type="button"
            onClick={() =>
              onChange({ ...value, deliverables: [...value.deliverables, { label: "", description: "" }] })
            }
            className="rounded-lg border border-orange-300 dark:border-orange-800 px-3 py-2 text-xs font-bold text-orange-800 dark:text-orange-300"
          >
            Tambah Hasil Layanan
          </button>
        )}
      </div>
    </fieldset>
  );
}
