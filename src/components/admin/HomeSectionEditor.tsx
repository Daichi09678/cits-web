"use client";

import { useState } from "react";
import { Home, Plus, Save, Trash2 } from "lucide-react";
import { useCitsStore } from "@/stores/citsStore";
import { initialLandingPageData } from "@/data/initialData";
import { HOME_SECTIONS, homeSectionPatch, type HomeEditorPage } from "@/lib/homeSections";
import type { LandingPageData } from "@/types/schema";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-white/10 dark:bg-white/5 dark:text-white";

export default function HomeSectionEditor({ page }: { page: HomeEditorPage }) {
  const { landingData, actions } = useCitsStore();
  const [draft, setDraft] = useState<LandingPageData | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const source = landingData || initialLandingPageData;
  const data: LandingPageData = draft || {
    ...initialLandingPageData,
    ...source,
    hero: { ...initialLandingPageData.hero, ...source.hero },
    servicesIntro: { ...initialLandingPageData.servicesIntro, ...source.servicesIntro },
    productsIntro: { ...initialLandingPageData.productsIntro, ...source.productsIntro },
    clientsIntro: { ...initialLandingPageData.clientsIntro, ...source.clientsIntro },
    cta: { ...initialLandingPageData.cta, ...source.cta },
    sectionVisibility: { ...initialLandingPageData.sectionVisibility!, ...source.sectionVisibility },
  };
  const change = (next: LandingPageData) => {
    setDraft(next);
    setSaved(false);
  };
  const visibility = (key: keyof NonNullable<LandingPageData["sectionVisibility"]>, checked: boolean) =>
    change({ ...data, sectionVisibility: { ...data.sectionVisibility!, [key]: checked } });

  return (
    <details className="group rounded-3xl border border-slate-200/90 bg-white shadow-xs dark:border-white/10 dark:bg-[#151528]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 sm:p-6">
        <span className="flex items-center gap-3">
          <Home className="h-5 w-5 shrink-0 text-orange-600" />
          <span>
            <span className="block text-sm font-extrabold text-slate-900 dark:text-white">Konten Beranda</span>
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
              Edit teks dan centang bagian yang ingin ditampilkan di halaman utama.
            </span>
          </span>
        </span>
        <span className="shrink-0 text-xs font-bold text-orange-700 dark:text-orange-300">Atur</span>
      </summary>
      <form
        className="border-t border-slate-100 p-5 sm:p-6 dark:border-white/10"
        onSubmit={async (event) => {
          event.preventDefault();
          if (saving) return;
          setSaving(true);
          setError("");
          setSaved(false);
          try {
            await actions.saveHomeSection(page, homeSectionPatch(page, data));
            setDraft(null);
            setSaved(true);
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Isi beranda gagal disimpan.");
          } finally {
            setSaving(false);
          }
        }}
      >
        <fieldset disabled={saving} className="min-w-0 space-y-6 disabled:opacity-60">
          {HOME_SECTIONS[page].map((section) => (
            <div key={section.key} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{section.title}</h3>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-orange-200 bg-orange-50/50 p-3.5 text-xs font-bold text-slate-900 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-white">
                Tampilkan bagian ini di Beranda
                <input
                  type="checkbox"
                  checked={data.sectionVisibility?.[section.visibility] !== false}
                  onChange={(event) => visibility(section.visibility, event.target.checked)}
                  className="h-5 w-5 shrink-0 accent-orange-600"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                {section.fields.map((field) => {
                  const content = data[section.key] as unknown as Record<string, string | string[]>;
                  const value = content?.[field.key] ?? "";
                  const props = {
                    className: fieldClass,
                    maxLength: field.kind === "textarea" || field.kind === "list" ? 4000 : 500,
                  };
                  return (
                    <label
                      key={field.key}
                      className={`block text-xs font-bold text-slate-700 dark:text-slate-300 ${field.kind === "textarea" || field.kind === "list" ? "sm:col-span-2" : ""}`}
                    >
                      {field.label}
                      {field.kind === "textarea" || field.kind === "list" ? (
                        <textarea
                          {...props}
                          rows={3}
                          value={Array.isArray(value) ? value.join("\n") : value}
                          onChange={(event) =>
                            change({
                              ...data,
                              [section.key]: {
                                ...data[section.key],
                                [field.key]:
                                  field.kind === "list" ? event.target.value.split("\n") : event.target.value,
                              },
                            })
                          }
                          onBlur={() => {
                            if (field.kind === "list" && Array.isArray(value))
                              change({
                                ...data,
                                [section.key]: {
                                  ...data[section.key],
                                  [field.key]: value.map((item) => item.trim()).filter(Boolean),
                                },
                              });
                          }}
                        />
                      ) : (
                        <input
                          {...props}
                          required={field.kind === "link"}
                          value={value as string}
                          placeholder={field.kind === "link" ? "/contact atau https://..." : undefined}
                          onChange={(event) =>
                            change({
                              ...data,
                              [section.key]: { ...data[section.key], [field.key]: event.target.value },
                            })
                          }
                        />
                      )}
                      {field.kind === "list" && (
                        <span className="mt-1 block text-[11px] font-normal text-slate-500">Satu teks per baris.</span>
                      )}
                    </label>
                  );
                })}
              </div>
              {page === "about" && (
                <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={data.hero.showMockup !== false}
                    onChange={(event) => change({ ...data, hero: { ...data.hero, showMockup: event.target.checked } })}
                    className="h-5 w-5 accent-orange-600"
                  />
                  Tampilkan panel ilustrasi di samping judul
                </label>
              )}
            </div>
          ))}
          {page === "about" && (
            <div className="space-y-4 border-t border-slate-100 pt-5 dark:border-white/10">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Statistik Beranda</h3>
              <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={data.sectionVisibility?.highlights !== false}
                  onChange={(event) => visibility("highlights", event.target.checked)}
                  className="h-5 w-5 accent-orange-600"
                />
                Tampilkan statistik di Beranda
              </label>
              {data.highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10"
                >
                  <label className="min-w-32 flex-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Label statistik
                    <input
                      className={fieldClass}
                      maxLength={150}
                      value={item.label}
                      onChange={(event) =>
                        change({
                          ...data,
                          highlights: data.highlights.map((entry, i) =>
                            i === index ? { ...entry, label: event.target.value } : entry
                          ),
                        })
                      }
                    />
                  </label>
                  <label className="w-28 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nilai
                    <input
                      className={fieldClass}
                      maxLength={50}
                      value={item.value}
                      onChange={(event) =>
                        change({
                          ...data,
                          highlights: data.highlights.map((entry, i) =>
                            i === index ? { ...entry, value: event.target.value } : entry
                          ),
                        })
                      }
                    />
                  </label>
                  <label className="flex items-center gap-2 py-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={item.isActive !== false}
                      onChange={(event) =>
                        change({
                          ...data,
                          highlights: data.highlights.map((entry, i) =>
                            i === index ? { ...entry, isActive: event.target.checked } : entry
                          ),
                        })
                      }
                      className="h-4 w-4 accent-orange-600"
                    />
                    Tampilkan
                  </label>
                  <button
                    type="button"
                    aria-label={`Hapus statistik ${index + 1}`}
                    className="p-2.5 text-rose-600"
                    onClick={() => change({ ...data, highlights: data.highlights.filter((_, i) => i !== index) })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {data.highlights.length < 12 && (
                <button
                  type="button"
                  onClick={() =>
                    change({ ...data, highlights: [...data.highlights, { label: "", value: "", isActive: true }] })
                  }
                  className="inline-flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-300"
                >
                  <Plus className="h-4 w-4" />
                  Tambah statistik
                </button>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
            <p className="text-xs text-slate-500">
              Pilihan tiap produk atau layanan diatur lewat form edit masing-masing.
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-700"
            >
              <Save className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan Konten Beranda"}
            </button>
          </div>
        </fieldset>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
          >
            {error}
          </p>
        )}
        {saved && (
          <p role="status" className="mt-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Konten beranda berhasil disimpan.
          </p>
        )}
      </form>
    </details>
  );
}
