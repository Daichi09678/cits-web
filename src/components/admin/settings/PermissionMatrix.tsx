"use client";

import { useState } from "react";
import { Check, LayoutGrid, Search } from "lucide-react";
import {
  EDITABLE_PAGES,
  PERMISSION_ACTIONS,
  availableActions,
  normalizePermissions,
  type PagePermissions,
} from "@/lib/internalAccess";
import { fieldClass } from "./styles";

const labels = { view: "Lihat", create: "Tambah", edit: "Edit", delete: "Hapus" };

export default function PermissionMatrix({
  value,
  onChange,
  id,
}: {
  value: PagePermissions;
  onChange: (value: PagePermissions) => void;
  id?: string;
}) {
  const [query, setQuery] = useState("");
  const pages = EDITABLE_PAGES.filter((page) =>
    `${page.label} ${page.description}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div id={id}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <label className="relative w-full sm:max-w-56">
          <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-[#64748B]" aria-hidden="true" />
          <input
            aria-label="Cari halaman atau modul"
            placeholder="Cari halaman atau modul..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={`${fieldClass} pl-9`}
          />
        </label>
        <div className="flex flex-wrap items-center gap-1 text-xs font-semibold">
          <button
            type="button"
            className="min-h-9 rounded-md px-2 text-[#FF4D00] hover:bg-[#FFF1E9] focus-visible:outline-2 focus-visible:outline-[#FF4D00] dark:hover:bg-orange-500/10"
            onClick={() =>
              onChange(Object.fromEntries(EDITABLE_PAGES.map(({ key }) => [key, [...availableActions(key)]])))
            }
          >
            Pilih semua
          </button>
          <span aria-hidden="true" className="h-4 w-px bg-[#E2E8F0] dark:bg-white/10" />
          <button
            type="button"
            className="min-h-9 rounded-md px-2 text-[#64748B] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#FF4D00] dark:hover:bg-white/5"
            onClick={() => onChange({})}
          >
            Hapus semua
          </button>
        </div>
      </div>

      <div
        className="relative overflow-x-auto rounded-lg border border-[#E2E8F0] dark:border-white/10"
        tabIndex={0}
        role="region"
        aria-label="Matriks hak akses; geser untuk melihat semua tindakan"
      >
        <table className="w-full min-w-[640px] text-sm">
          <caption className="sr-only">Hak akses per modul. Aktifkan Lihat sebelum memilih tindakan lainnya.</caption>
          <thead>
            <tr className="bg-[#F8FAFC] text-[11px] font-semibold tracking-wide text-[#64748B] uppercase dark:bg-white/5">
              <th scope="col" className="px-4 py-2.5 text-left">
                Modul
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-semibold">
                Deskripsi
              </th>
              {PERMISSION_ACTIONS.map((action) => (
                <th key={action} scope="col" className="w-16 px-1 py-2.5 text-center font-semibold">
                  {labels[action]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] dark:divide-white/5">
            {pages.map((page) => (
              <tr key={page.key} className="transition-colors hover:bg-[#F8FAFC] dark:hover:bg-white/[0.02]">
                <th scope="row" className="px-4 py-2.5 text-left font-medium whitespace-nowrap">
                  <span className="flex items-center gap-2.5">
                    <LayoutGrid className="size-4 shrink-0 text-[#64748B]" aria-hidden="true" />
                    <span className="text-[13px] text-[#0F172A] dark:text-slate-200">{page.shortLabel}</span>
                  </span>
                </th>
                <td className="px-3 py-2.5 text-xs leading-relaxed text-[#64748B] dark:text-slate-400">
                  {page.description}
                </td>
                {PERMISSION_ACTIONS.map((action) => {
                  const available = availableActions(page.key).includes(action);
                  const checked = value[page.key]?.includes(action) === true;
                  const disabled = action !== "view" && !value[page.key]?.includes("view");
                  return (
                    <td key={action} className="px-1 py-2.5 text-center">
                      {available ? (
                        <label
                          className={`relative inline-flex size-9 items-center justify-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <input
                            type="checkbox"
                            aria-label={`${labels[action]} ${page.shortLabel}`}
                            checked={checked}
                            disabled={disabled}
                            className="peer sr-only"
                            onChange={(event) => {
                              const current = value[page.key] || [];
                              const actions = event.target.checked
                                ? [...current, action]
                                : action === "view"
                                  ? []
                                  : current.filter((item) => item !== action);
                              onChange(normalizePermissions({ ...value, [page.key]: actions }));
                            }}
                          />
                          <span
                            className={`flex size-[18px] items-center justify-center rounded-[5px] border transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#FF4D00] peer-focus-visible:ring-offset-2 ${
                              checked
                                ? "border-[#FF4D00] bg-[#FF4D00] text-white"
                                : disabled
                                  ? "border-[#E2E8F0] bg-slate-100 dark:border-white/5 dark:bg-white/5"
                                  : "border-slate-300 bg-white dark:border-white/20 dark:bg-transparent"
                            }`}
                          >
                            {checked && <Check className="size-3" strokeWidth={3} aria-hidden="true" />}
                          </span>
                        </label>
                      ) : (
                        <span
                          title="Tindakan tidak tersedia untuk modul ini"
                          aria-label={`${labels[action]} tidak tersedia untuk ${page.shortLabel}`}
                          className="text-xs text-[#94A3B8]"
                        >
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {!pages.length && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm text-[#64748B]">
                  Tidak ada modul yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2.5 flex flex-wrap justify-between gap-2 text-[11px] text-[#64748B]">
        <span>Aktifkan Lihat untuk mengatur izin lainnya. — = tidak tersedia.</span>
        <span aria-live="polite" className="font-semibold text-[#FF4D00]">
          {Object.keys(value).length} dari {EDITABLE_PAGES.length} modul dipilih
        </span>
      </div>
    </div>
  );
}
