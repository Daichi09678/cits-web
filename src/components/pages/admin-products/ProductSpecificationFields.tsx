"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ProductItem } from "@/types/schema";

const fieldClass =
  "mt-1.5 min-h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-normal text-slate-900 dark:border-white/15 dark:bg-[#151528] dark:text-white";

export default function ProductSpecificationFields({
  details,
  specifications,
  onDetails,
  onSpecifications,
}: {
  details: string;
  specifications: NonNullable<ProductItem["specifications"]>;
  onDetails: (next: string) => void;
  onSpecifications: (next: NonNullable<ProductItem["specifications"]>) => void;
}) {
  return (
    <section
      aria-label="Rincian spesifikasi produk"
      className="min-w-0 space-y-5 rounded-xl border border-slate-200 p-4 dark:border-white/10"
    >
      <label htmlFor="product-long-details" className="block text-xs font-semibold text-slate-800 dark:text-slate-100">
        Penjelasan Lengkap
        <textarea
          id="product-long-details"
          rows={5}
          maxLength={12000}
          value={details}
          onChange={(event) => onDetails(event.target.value)}
          placeholder="Jelaskan fungsi, cara kerja, ruang lingkup, dan penggunaan produk."
          className={fieldClass}
        />
      </label>
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Tabel Spesifikasi</h4>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Tambahkan spesifikasi sesuai produk, misalnya platform, basis data, atau integrasi yang tersedia.
        </p>
        {specifications.map((row, index) => (
          <div
            key={index}
            className="flex min-w-0 items-start gap-2 rounded-lg border border-slate-200 p-3 dark:border-white/10"
          >
            <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
              <label className="min-w-0 text-xs font-semibold text-slate-700 dark:text-slate-200">
                Nama spesifikasi {index + 1}
                <input
                  required
                  maxLength={120}
                  value={row.name}
                  onChange={(event) =>
                    onSpecifications(
                      specifications.map((item, i) => (i === index ? { ...item, name: event.target.value } : item))
                    )
                  }
                  placeholder="Contoh: Basis data"
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-xs font-semibold text-slate-700 dark:text-slate-200">
                Nilai spesifikasi {index + 1}
                <textarea
                  required
                  rows={2}
                  maxLength={2000}
                  value={row.value}
                  onChange={(event) =>
                    onSpecifications(
                      specifications.map((item, i) => (i === index ? { ...item, value: event.target.value } : item))
                    )
                  }
                  placeholder="Contoh: PostgreSQL"
                  className={fieldClass}
                />
              </label>
            </div>
            <button
              type="button"
              aria-label={`Hapus spesifikasi ${index + 1}`}
              onClick={() => onSpecifications(specifications.filter((_, i) => i !== index))}
              className="mt-6 shrink-0 rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={specifications.length >= 50}
          onClick={() => onSpecifications([...specifications, { name: "", value: "" }])}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-orange-200 px-3 text-xs font-semibold text-orange-700 disabled:opacity-40 dark:border-orange-500/30 dark:text-orange-300"
        >
          <Plus className="size-4" />
          Tambah Spesifikasi
        </button>
      </div>
    </section>
  );
}
