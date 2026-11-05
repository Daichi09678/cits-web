"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { pageDefinition, type ContentRecord, type PublicPageContent } from "@/lib/publicPageContent";

const definition = pageDefinition("portfolio");
const fieldClass =
  "mt-2 min-h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-normal leading-relaxed text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 dark:border-white/15 dark:bg-[#151528] dark:text-slate-100";
const labels: Record<string, string> = {
  portfolio_hero_text_2: "Judul utama halaman",
  portfolio_hero_text_3: "Lanjutan judul utama",
  portfolio_hero_text_4: "Deskripsi pembuka",
  portfolio_hero_text_8: "Judul informasi katalog produk",
  portfolio_hero_href_12: "Tujuan tombol katalog produk",
  portfolio_hero_text_13: "Teks tombol katalog produk",
  flagship_text_2: "Judul proyek unggulan",
  flagship_text_3: "Lanjutan judul proyek unggulan",
  flagship_text_4: "Deskripsi proyek unggulan",
  case_studies_list_text_2: "Judul daftar proyek",
  case_studies_list_text_3: "Lanjutan judul daftar proyek",
  case_studies_list_text_4: "Deskripsi daftar proyek",
  metrics_text_2: "Judul capaian proyek",
  metrics_text_3: "Lanjutan judul capaian proyek",
  metrics_text_4: "Deskripsi capaian proyek",
  testimonials_text_2: "Judul testimoni",
  testimonials_text_3: "Lanjutan judul testimoni",
  testimonials_text_4: "Deskripsi testimoni",
  portfolio_cta_text_2: "Judul ajakan konsultasi",
  portfolio_cta_text_3: "Deskripsi ajakan konsultasi",
  portfolio_cta_href_4: "Tujuan tombol konsultasi",
  portfolio_cta_text_5: "Teks tombol konsultasi",
  portfolio_cta_href_6: "Tujuan tombol kedua",
  portfolio_cta_text_7: "Teks tombol kedua",
};
const collectionLabels: Record<string, string> = {
  value: "Nilai capaian",
  label: "Nama capaian",
  description: "Penjelasan capaian",
  quote: "Isi testimoni",
  name: "Nama / jabatan pemberi testimoni",
  company: "Instansi / perusahaan",
};

export default function PortfolioSectionFields({
  sectionKey,
  data,
  onChange,
}: {
  sectionKey: string;
  data: PublicPageContent;
  onChange: (next: PublicPageContent) => void;
}) {
  const section = definition.sections.find((item) => item.key === sectionKey);
  if (!section) return null;
  const collection = (key: string, rows: ContentRecord[]) =>
    onChange({ ...data, collections: { ...data.collections, [key]: rows } });
  return (
    <div className="space-y-7">
      <div className="grid min-w-0 gap-x-6 gap-y-5 sm:grid-cols-2">
        {section.fields.map((field) => {
          const id = `portfolio-field-${field.key}`;
          return (
            <label
              key={field.key}
              htmlFor={id}
              className={`block min-w-0 text-[13px] font-semibold text-slate-800 dark:text-slate-100 ${field.kind === "textarea" ? "sm:col-span-2" : ""}`}
            >
              {labels[field.key] || field.label}
              {field.kind !== "link" && (
                <span className="mt-1 block text-xs font-normal leading-relaxed text-slate-500 dark:text-slate-400">
                  Contoh: {definition.texts[field.key]}
                </span>
              )}
              {field.kind === "textarea" ? (
                <textarea
                  id={id}
                  rows={3}
                  maxLength={8000}
                  value={data.texts[field.key]}
                  onChange={(event) => onChange({ ...data, texts: { ...data.texts, [field.key]: event.target.value } })}
                  className={fieldClass}
                />
              ) : (
                <input
                  id={id}
                  required={field.kind === "link"}
                  maxLength={8000}
                  value={data.texts[field.key]}
                  onChange={(event) => onChange({ ...data, texts: { ...data.texts, [field.key]: event.target.value } })}
                  className={fieldClass}
                />
              )}
            </label>
          );
        })}
      </div>
      {Object.entries(definition.collections)
        .filter(([, schema]) => schema.section === sectionKey)
        .map(([key, schema]) => (
          <section
            key={key}
            aria-label={schema.title}
            className="space-y-4 border-t border-slate-200 pt-6 dark:border-white/10"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{schema.title}</h3>
            {data.collections[key].length === 0 && (
              <p className="text-xs leading-relaxed text-slate-500">
                Belum ada item. Tambahkan untuk ditampilkan di website.
              </p>
            )}
            {data.collections[key].map((item, index) => (
              <div key={index} className="min-w-0 rounded-xl border border-slate-200 p-4 dark:border-white/10">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">Item {index + 1}</h4>
                  <div className="flex gap-1">
                    {[-1, 1].map((direction) => (
                      <button
                        key={direction}
                        type="button"
                        aria-label={`Pindahkan item ${index + 1} ke ${direction < 0 ? "atas" : "bawah"}`}
                        disabled={index + direction < 0 || index + direction >= data.collections[key].length}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-white/10"
                        onClick={() => {
                          const rows = [...data.collections[key]];
                          [rows[index], rows[index + direction]] = [rows[index + direction], rows[index]];
                          collection(key, rows);
                        }}
                      >
                        {direction < 0 ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
                      </button>
                    ))}
                    <button
                      type="button"
                      aria-label={`Hapus item ${index + 1}`}
                      onClick={() =>
                        collection(
                          key,
                          data.collections[key].filter((_, i) => i !== index)
                        )
                      }
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="grid min-w-0 gap-x-6 gap-y-4 sm:grid-cols-2">
                  {Object.keys(schema.items[0])
                    .filter((field) => field !== "id")
                    .map((field) => {
                      const multiline = field === "description" || field === "quote";
                      const props = {
                        id: `portfolio-${key}-${index}-${field}`,
                        maxLength: 8000,
                        value: String(item[field]),
                        className: fieldClass,
                        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          collection(
                            key,
                            data.collections[key].map((row, i) =>
                              i === index ? { ...row, [field]: event.target.value } : row
                            )
                          ),
                      };
                      return (
                        <label
                          key={field}
                          htmlFor={props.id}
                          className={`min-w-0 text-xs font-semibold text-slate-700 dark:text-slate-200 ${multiline ? "sm:col-span-2" : ""}`}
                        >
                          {collectionLabels[field] || field}
                          {multiline ? <textarea {...props} rows={3} /> : <input {...props} />}
                        </label>
                      );
                    })}
                </div>
              </div>
            ))}
            <button
              type="button"
              disabled={data.collections[key].length >= 100}
              onClick={() =>
                collection(key, [
                  ...data.collections[key],
                  Object.fromEntries(
                    Object.keys(schema.items[0]).map((field) => [field, field === "id" ? crypto.randomUUID() : ""])
                  ),
                ])
              }
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-orange-200 px-4 py-2 text-xs font-semibold text-orange-700 disabled:opacity-40 dark:border-orange-500/30 dark:text-orange-300"
            >
              <Plus className="size-4" /> Tambah {schema.title}
            </button>
          </section>
        ))}
    </div>
  );
}
