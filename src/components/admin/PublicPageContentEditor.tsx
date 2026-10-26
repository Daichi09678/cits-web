"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, FilePenLine, Plus, Save, Trash2 } from "lucide-react";
import { usePublicPageContent } from "@/lib/publicPageContentClient";
import {
  pageDefinition,
  parsePublicPageContent,
  validContentAddress,
  type ContentRecord,
  type PublicContentPage,
  type PublicPageContent,
} from "@/lib/publicPageContent";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-normal text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 dark:border-white/10 dark:bg-white/5 dark:text-white";
const fieldLabels: Record<string, string> = {
  letter: "Huruf",
  word: "Nama prinsip",
  subtitle: "Subjudul",
  description: "Deskripsi",
  year: "Tahun",
  category: "Kategori",
  scope: "Lingkup",
  title: "Judul",
  issuer: "Pemberi penghargaan",
  badge: "Label",
  icon: "Ikon",
  items: "Poin penjelasan",
  value: "Nilai",
  label: "Label capaian",
  quote: "Isi testimoni",
  name: "Nama / jabatan",
  company: "Instansi / perusahaan",
};

export default function PublicPageContentEditor({ page }: { page: PublicContentPage }) {
  const { content, loading, loadError, save } = usePublicPageContent(page);
  const [draft, setDraft] = useState<PublicPageContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [readingImage, setReadingImage] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const data = draft || content;
  const definition = pageDefinition(page);
  const change = (next: PublicPageContent) => {
    setDraft(next);
    setSaved(false);
  };
  const text = (key: string, value: string) => change({ ...data, texts: { ...data.texts, [key]: value } });
  const collection = (key: string, rows: ContentRecord[]) =>
    change({ ...data, collections: { ...data.collections, [key]: rows } });
  const itemField = (key: string, index: number, field: string, value: string | string[]) =>
    collection(
      key,
      data.collections[key].map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );

  return (
    <details className="rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-white/10 dark:bg-[#151528]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
        <span className="flex items-center gap-3">
          <FilePenLine className="h-5 w-5 shrink-0 text-orange-600" />
          <span>
            <span className="block text-sm font-extrabold text-slate-900 dark:text-white">
              Konten Halaman {definition.title}
            </span>
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
              Edit bagian pembuka, seluruh isi halaman, dan ajakan kerja sama di bagian bawah.
            </span>
          </span>
        </span>
        <span className="shrink-0 text-xs font-bold text-orange-700 dark:text-orange-300">Edit Konten</span>
      </summary>
      <form
        className="space-y-4 border-t border-slate-100 p-5 sm:p-6 dark:border-white/10"
        onSubmit={async (event) => {
          event.preventDefault();
          if (saving || readingImage || loading || loadError) return;
          setSaving(true);
          setError("");
          setSaved(false);
          try {
            const normalized = {
              ...data,
              collections: Object.fromEntries(
                Object.entries(data.collections).map(([key, rows]) => [
                  key,
                  rows.map((row) =>
                    Object.fromEntries(
                      Object.entries(row).map(([field, value]) => [
                        field,
                        Array.isArray(value) ? value.map((line) => line.trim()).filter(Boolean) : value,
                      ])
                    )
                  ),
                ])
              ),
            };
            await save(parsePublicPageContent(page, normalized));
            setDraft(null);
            setSaved(true);
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Konten halaman gagal disimpan.");
          } finally {
            setSaving(false);
          }
        }}
      >
        {loading && (
          <p role="status" className="text-xs text-slate-500">
            Memuat konten tersimpan...
          </p>
        )}
        {loadError && (
          <p role="alert" className="text-xs text-rose-700 dark:text-rose-300">
            {loadError}
          </p>
        )}
        <fieldset
          disabled={loading || saving || readingImage || !!loadError}
          className="min-w-0 space-y-4 disabled:opacity-60"
        >
          {definition.sections.map((section) => (
            <details key={section.key} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 dark:text-white">
                {section.title}
              </summary>
              <div className="mt-4 space-y-5">
                <label className="flex items-center justify-between gap-3 rounded-xl bg-orange-50 p-3 text-xs font-semibold text-slate-800 dark:bg-orange-500/10 dark:text-slate-200">
                  Tampilkan bagian ini pada halaman {definition.title}
                  <input
                    type="checkbox"
                    checked={data.visibility[section.key] !== false}
                    onChange={(event) =>
                      change({ ...data, visibility: { ...data.visibility, [section.key]: event.target.checked } })
                    }
                    className="h-5 w-5 shrink-0 accent-orange-600"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <label
                      key={field.key}
                      className={`block text-xs font-bold text-slate-700 dark:text-slate-300 ${field.kind === "textarea" ? "sm:col-span-2" : ""}`}
                    >
                      {field.label}
                      <span
                        className="mt-0.5 block truncate text-[11px] font-normal text-slate-500"
                        title={definition.texts[field.key]}
                      >
                        {field.kind === "link" || field.kind === "image" ? "" : definition.texts[field.key]}
                      </span>
                      {field.kind === "textarea" ? (
                        <textarea
                          className={fieldClass}
                          rows={3}
                          maxLength={8000}
                          value={data.texts[field.key]}
                          onChange={(event) => text(field.key, event.target.value)}
                        />
                      ) : (
                        <input
                          className={fieldClass}
                          maxLength={field.kind === "image" ? undefined : 8000}
                          required={
                            field.kind === "link" ||
                            (field.kind === "image" && !data.texts[field.key].startsWith("data:"))
                          }
                          value={
                            field.kind === "image" && data.texts[field.key].startsWith("data:")
                              ? ""
                              : data.texts[field.key]
                          }
                          placeholder={field.kind === "image" ? "/logo.webp atau unggah gambar" : undefined}
                          onChange={(event) => text(field.key, event.target.value)}
                        />
                      )}
                      {field.kind === "image" && (
                        <span className="mt-2 flex flex-wrap items-center gap-3">
                          {validContentAddress(data.texts[field.key], true) && (
                            <Image
                              src={data.texts[field.key]}
                              alt="Pratinjau logo"
                              width={140}
                              height={56}
                              unoptimized
                              className="h-14 w-36 rounded-lg bg-slate-100 object-contain p-2 dark:bg-white/10"
                            />
                          )}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="max-w-full text-[11px] font-normal"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              if (
                                !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
                                file.size > 2 * 1024 * 1024
                              ) {
                                setError("Gunakan JPG, PNG, atau WebP maksimal 2 MB.");
                                event.target.value = "";
                                return;
                              }
                              setReadingImage(true);
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  text(field.key, reader.result);
                                  setError("");
                                }
                                setReadingImage(false);
                              };
                              reader.onerror = () => {
                                setReadingImage(false);
                                setError("Gambar gagal dibaca. Silakan pilih kembali.");
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </span>
                      )}
                    </label>
                  ))}
                </div>
                {Object.entries(definition.collections)
                  .filter(([, schema]) => schema.section === section.key)
                  .map(([key, schema]) => (
                    <div key={key} className="space-y-3 border-t border-slate-100 pt-4 dark:border-white/10">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Daftar {schema.title}</h4>
                      {data.collections[key].map((item, index) => (
                        <div
                          key={index}
                          className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-white/10 dark:bg-white/5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-slate-800 dark:text-white">
                              {index + 1}.{" "}
                              {String(item.title || item.word || item.name || item.label || item.year || schema.title)}
                            </span>
                            <span className="flex shrink-0 gap-1">
                              {[-1, 1].map((direction) => (
                                <button
                                  key={direction}
                                  type="button"
                                  aria-label={direction < 0 ? "Pindahkan ke atas" : "Pindahkan ke bawah"}
                                  disabled={index + direction < 0 || index + direction >= data.collections[key].length}
                                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-white/10"
                                  onClick={() => {
                                    const rows = [...data.collections[key]];
                                    [rows[index], rows[index + direction]] = [rows[index + direction], rows[index]];
                                    collection(key, rows);
                                  }}
                                >
                                  {direction < 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                </button>
                              ))}
                              <button
                                type="button"
                                aria-label={`Hapus item ${index + 1}`}
                                className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                                onClick={() =>
                                  collection(
                                    key,
                                    data.collections[key].filter((_, i) => i !== index)
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </span>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {Object.entries(schema.items[0])
                              .filter(([field]) => field !== "id")
                              .map(([field, initial]) => (
                                <label
                                  key={field}
                                  className={`block text-xs font-semibold text-slate-700 dark:text-slate-300 ${["description", "quote", "items"].includes(field) ? "sm:col-span-2" : ""}`}
                                >
                                  {fieldLabels[field] || field}
                                  {(field === "category" && key === "awards") || field === "icon" ? (
                                    <select
                                      className={fieldClass}
                                      value={item[field] as string}
                                      onChange={(event) => itemField(key, index, field, event.target.value)}
                                    >
                                      {(field === "icon"
                                        ? [
                                            ["Building2", "Perusahaan"],
                                            ["FileCheck", "Legalitas"],
                                            ["ShieldCheck", "Keamanan"],
                                            ["Users", "Tim ahli"],
                                          ]
                                        : [
                                            ["kementerian", "Kementerian & Lembaga"],
                                            ["bumn", "BUMN & Pelayanan Publik"],
                                            ["egov", "Tata Kelola & e-Gov"],
                                          ]
                                      ).map(([value, label]) => (
                                        <option key={value} value={value}>
                                          {label}
                                        </option>
                                      ))}
                                    </select>
                                  ) : Array.isArray(initial) || ["description", "quote"].includes(field) ? (
                                    <textarea
                                      className={fieldClass}
                                      rows={3}
                                      maxLength={8000}
                                      value={
                                        Array.isArray(item[field])
                                          ? (item[field] as string[]).join("\n")
                                          : (item[field] as string)
                                      }
                                      onChange={(event) =>
                                        itemField(
                                          key,
                                          index,
                                          field,
                                          Array.isArray(initial) ? event.target.value.split("\n") : event.target.value
                                        )
                                      }
                                      placeholder={Array.isArray(initial) ? "Satu poin per baris" : undefined}
                                    />
                                  ) : (
                                    <input
                                      className={fieldClass}
                                      maxLength={8000}
                                      value={item[field] as string}
                                      onChange={(event) => itemField(key, index, field, event.target.value)}
                                    />
                                  )}
                                </label>
                              ))}
                          </div>
                        </div>
                      ))}
                      {data.collections[key].length < 100 && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-300"
                          onClick={() =>
                            collection(key, [
                              ...data.collections[key],
                              Object.fromEntries(
                                Object.entries(schema.items[0]).map(([field, value]) => [
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
                          <Plus className="h-4 w-4" />
                          Tambah {schema.title}
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </details>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
            <p className="text-xs text-slate-500">Perubahan berlaku pada halaman {definition.title} di website.</p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-700"
            >
              <Save className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan Konten Halaman"}
            </button>
          </div>
        </fieldset>
        {error && (
          <p role="alert" className="text-xs text-rose-700 dark:text-rose-300">
            {error}
          </p>
        )}
        {saved && (
          <p role="status" className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Konten halaman berhasil disimpan.
          </p>
        )}
      </form>
    </details>
  );
}
