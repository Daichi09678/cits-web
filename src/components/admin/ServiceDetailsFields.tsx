"use client";

import { useRef, useState } from "react";
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
  "mt-1.5 w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#121222] px-3 py-2.5 text-sm font-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30";

export default function ServiceDetailsFields({
  value,
  name,
  fallbackImage,
  onChange,
}: {
  value: ServiceDetailsForm;
  name: string;
  fallbackImage: string;
  onChange: (value: ServiceDetailsForm) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState("");
  const [readingImage, setReadingImage] = useState(false);
  const changeImage = (image: string) => {
    setImageError("");
    onChange({ ...value, image });
  };
  return (
    <fieldset className="space-y-4 rounded-2xl border border-slate-200 dark:border-white/10 p-4 min-w-0">
      <legend className="px-1 text-sm font-bold text-slate-900 dark:text-white">Foto & Detail Pilar Layanan</legend>
      <ServicePhoto
        image={value.image || fallbackImage}
        name={name || "Pilar Layanan"}
        className="h-40 sm:h-52 rounded-xl"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer rounded-lg bg-orange-700 hover:bg-orange-800 px-3 py-2.5 text-xs font-bold text-white">
          {readingImage ? "Membaca Foto..." : "Unggah Foto Layanan"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={readingImage}
            className="sr-only"
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
                if (typeof reader.result === "string") onChange({ ...value, image: reader.result });
                setReadingImage(false);
              };
              reader.onerror = () => {
                setImageError("Foto tidak dapat dibaca. Silakan pilih ulang.");
                setReadingImage(false);
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {value.image && (
          <button
            type="button"
            onClick={() => {
              changeImage("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="text-xs font-semibold text-orange-800 dark:text-orange-300 underline"
          >
            Gunakan Foto Bawaan
          </button>
        )}
      </div>
      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        JPG, PNG, atau WebP, maksimal 2 MB. Foto ini digunakan di halaman Layanan dan beranda.
      </p>
      {imageError && (
        <p role="alert" className="text-xs font-semibold text-red-700 dark:text-red-300">
          {imageError}
        </p>
      )}
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
        Alamat Foto (opsional)
        <input
          value={value.image.startsWith("data:") ? "" : value.image}
          onChange={(event) => changeImage(event.target.value)}
          placeholder="https://... atau /services/foto-layanan.webp"
          className={fieldClass}
        />
      </label>
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
