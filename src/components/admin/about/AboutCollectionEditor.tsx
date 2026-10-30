"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { type ContentRecord } from "@/lib/publicPageContent";
import { AboutField, aboutInputClass, aboutSecondaryButton } from "./AboutFields";

const labels: Record<string, string> = {
  letter: "Huruf prinsip",
  word: "Nama prinsip",
  subtitle: "Subjudul",
  description: "Deskripsi",
  year: "Tahun",
  category: "Kategori",
  scope: "Lingkup kegiatan",
  title: "Judul",
  issuer: "Pemberi penghargaan",
  badge: "Label",
  icon: "Ikon",
  items: "Daftar informasi",
  value: "Nilai",
  label: "Label capaian",
};

export default function AboutCollectionEditor({
  collectionKey,
  title,
  shape,
  items,
  onChange,
}: {
  collectionKey: string;
  title: string;
  shape: ContentRecord;
  items: ContentRecord[];
  onChange: (items: ContentRecord[]) => void;
}) {
  const update = (index: number, field: string, value: string | string[]) =>
    onChange(items.map((item, position) => (position === index ? { ...item, [field]: value } : item)));
  return (
    <section className="space-y-4 border-t border-slate-100 pt-6 dark:border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Daftar {title}</h3>
        <span className="text-xs text-slate-500">{items.length} item</span>
      </div>
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-slate-200 p-4 dark:border-white/10 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-2">
            <h4 className="min-w-0 text-[13px] leading-relaxed font-semibold text-slate-800 dark:text-slate-100">
              {index + 1}. {String(item.title || item.word || item.year || title)}
            </h4>
            <div className="flex shrink-0 items-center gap-1">
              {[-1, 1].map((direction) => (
                <button
                  key={direction}
                  type="button"
                  aria-label={`${direction < 0 ? "Pindahkan ke atas" : "Pindahkan ke bawah"} item ${index + 1}`}
                  disabled={index + direction < 0 || index + direction >= items.length}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-orange-500 disabled:opacity-30 dark:hover:bg-white/5"
                  onClick={() => {
                    const next = [...items];
                    [next[index], next[index + direction]] = [next[index + direction], next[index]];
                    onChange(next);
                  }}
                >
                  {direction < 0 ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
                </button>
              ))}
              <button
                type="button"
                aria-label={`Hapus item ${index + 1}`}
                onClick={() => onChange(items.filter((_, position) => position !== index))}
                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-500 dark:hover:bg-red-500/10"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            {Object.entries(shape)
              .filter(([field]) => field !== "id")
              .map(([field, initial]) => {
                const options =
                  field === "icon"
                    ? [
                        ["Building2", "Perusahaan"],
                        ["FileCheck", "Legalitas"],
                        ["ShieldCheck", "Keamanan"],
                        ["Users", "Tim ahli"],
                      ]
                    : field === "category" && collectionKey === "awards"
                      ? [
                          ["kementerian", "Kementerian & Lembaga"],
                          ["bumn", "BUMN & Pelayanan Publik"],
                          ["egov", "Tata Kelola & e-Gov"],
                        ]
                      : null;
                return options ? (
                  <label key={field} className="block min-w-0 text-[13px] font-semibold text-slate-900 dark:text-white">
                    {labels[field]}
                    <select
                      className={`${aboutInputClass} mt-1.5 font-normal`}
                      value={item[field] as string}
                      onChange={(event) => update(index, field, event.target.value)}
                    >
                      {options.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <AboutField
                    key={field}
                    label={labels[field] || field}
                    value={Array.isArray(item[field]) ? (item[field] as string[]).join("\n") : (item[field] as string)}
                    onChange={(value) => update(index, field, Array.isArray(initial) ? value.split("\n") : value)}
                    multiline={Array.isArray(initial) || field === "description"}
                    hint={Array.isArray(initial) ? "Tulis satu informasi pada setiap baris." : undefined}
                  />
                );
              })}
          </div>
        </div>
      ))}
      {!items.length && (
        <p className="rounded-lg border border-dashed border-slate-200 p-5 text-center text-xs text-slate-500 dark:border-white/10">
          Belum ada item. Tambahkan informasi sesuai kebutuhan.
        </p>
      )}
      {items.length < 100 && (
        <button
          type="button"
          className={aboutSecondaryButton}
          onClick={() =>
            onChange([
              ...items,
              Object.fromEntries(
                Object.entries(shape).map(([field, value]) => [
                  field,
                  field === "id"
                    ? crypto.randomUUID()
                    : Array.isArray(value)
                      ? []
                      : field === "category" || field === "icon"
                        ? value
                        : "",
                ])
              ),
            ])
          }
        >
          <Plus className="size-4" />
          Tambah {title}
        </button>
      )}
    </section>
  );
}
