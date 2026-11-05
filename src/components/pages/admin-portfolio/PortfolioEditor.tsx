"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, ChevronRight, ExternalLink, Info, LoaderCircle, Save } from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";
import { usePublicPageContent } from "@/lib/publicPageContentClient";
import { pageDefinition, parsePublicPageContent, type PublicPageContent } from "@/lib/publicPageContent";
import type { CaseStudyItem } from "@/types/schema";
import PortfolioSectionFields from "./PortfolioSectionFields";

const managementKey = "portfolio-study-management";
const contentSections = pageDefinition("portfolio").sections;
export const portfolioEditorSections = [
  contentSections[0],
  { key: managementKey, title: "Statistik & Manajemen Studi Kasus" },
  ...contentSections.slice(1),
];
const descriptions: Record<string, string> = {
  "portfolio-hero-heading": "Kelola judul, deskripsi, dan tombol pembuka halaman Portofolio.",
  [managementKey]: "Kelola seluruh penugasan, logo klien, status publikasi, serta rincian studi kasus.",
  "flagship-heading":
    "Ubah teks bagian proyek unggulan dan pilih penugasan yang ditampilkan sebagai flagship di halaman publik.",
  "case-studies-list-heading": "Ubah judul, keterangan, dan label pada daftar proyek di halaman publik.",
  "metrics-heading": "Kelola judul, daftar capaian, dan angka dampak proyek yang ditampilkan di website.",
  "testimonials-heading": "Kelola judul, isi, urutan, dan daftar testimoni klien.",
  "portfolio-cta-heading": "Kelola teks serta tombol ajakan konsultasi di bagian bawah halaman Portofolio.",
};
const cardClass = "min-w-0 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#151528]";

export default function PortfolioEditor({
  children,
  studies,
  onSaveStudies,
}: {
  children: ReactNode;
  studies: CaseStudyItem[];
  onSaveStudies: (next: CaseStudyItem[]) => Promise<void>;
}) {
  const { session } = useAdminAuth();
  const canEdit = canPerformAction(session?.user, "portfolio", "edit");
  const { content, loading, loadError, save } = usePublicPageContent("portfolio");
  const [selected, setSelected] = useState(portfolioEditorSections[0].key);
  const [draft, setDraft] = useState<PublicPageContent | null>(null);
  const [flagshipChanges, setFlagshipChanges] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const pending = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const data = draft || content;
  const management = selected === managementKey;
  const section = portfolioEditorSections.find((item) => item.key === selected)!;
  const disabled = !canEdit || saving || loading || Boolean(loadError);
  const changedStudies = studies.filter(
    (study) => Object.hasOwn(flagshipChanges, study.id) && flagshipChanges[study.id] !== Boolean(study.isFlagship)
  );
  const dirty = Boolean(draft) || changedStudies.length > 0;
  const change = (next: PublicPageContent) => {
    setDraft(next);
    setSaved(false);
    setError("");
  };
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending.current || disabled || !dirty) return;
    pending.current = true;
    setSaving(true);
    setSaved(false);
    setError("");
    let contentSaved = false;
    try {
      if (draft) {
        await save(parsePublicPageContent("portfolio", draft));
        contentSaved = true;
        setDraft(null);
      }
      if (changedStudies.length) {
        const ids = new Set(changedStudies.map((study) => study.id));
        await onSaveStudies(
          studies.map((study) => (ids.has(study.id) ? { ...study, isFlagship: flagshipChanges[study.id] } : study))
        );
        setFlagshipChanges({});
      }
      setSaved(true);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Konten Portofolio gagal disimpan.";
      setError(
        contentSaved
          ? `Teks halaman sudah tersimpan, tetapi pilihan proyek unggulan belum tersimpan. ${message}`
          : message
      );
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }
  return (
    <div className="mx-auto grid w-full max-w-[1600px] min-w-0 items-start gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(240px,27%)_minmax(0,1fr)] lg:gap-5 lg:p-8">
      <aside className={`${cardClass} p-5 lg:sticky lg:top-24`} aria-labelledby="portfolio-sections-title">
        <div className="flex items-center justify-between gap-3">
          <h2 id="portfolio-sections-title" className="text-sm font-semibold text-slate-900 dark:text-white">
            Bagian Konten
          </h2>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-300">
            7 section
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Pilih bagian halaman Portofolio yang ingin Anda kelola.
        </p>
        <nav aria-label="Bagian konten Portofolio" className="mt-4 space-y-2">
          {portfolioEditorSections.map((item, index) => (
            <button
              key={item.key}
              type="button"
              aria-current={selected === item.key ? "true" : undefined}
              aria-controls="portfolio-section-panel"
              disabled={saving}
              onClick={() => {
                setSelected(item.key);
                if (window.matchMedia("(max-width: 1023px)").matches)
                  requestAnimationFrame(() =>
                    panelRef.current?.scrollIntoView({ block: "start", behavior: "instant" })
                  );
              }}
              className={`flex min-h-12 w-full min-w-0 items-center gap-3 rounded-lg border px-3 py-3 text-left text-xs font-semibold leading-relaxed transition focus-visible:outline-2 focus-visible:outline-orange-500 disabled:opacity-50 ${selected === item.key ? "border-orange-300 bg-orange-50/70 text-orange-800 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-200" : "border-slate-200/80 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"}`}
            >
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] text-slate-500 dark:bg-white/5 dark:text-slate-300"
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">{item.title}</span>
              {selected === item.key && <ChevronRight aria-hidden="true" className="size-4 shrink-0" />}
            </button>
          ))}
        </nav>
        <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-blue-50 p-3.5 text-xs leading-relaxed text-slate-600 dark:bg-blue-500/10 dark:text-slate-300">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <p>
            Perubahan teks disimpan melalui Simpan Perubahan. Data proyek dikelola pada Statistik &amp; Manajemen Studi
            Kasus.
          </p>
        </div>
        {dirty && (
          <p role="status" className="mt-4 text-xs leading-relaxed text-orange-700 dark:text-orange-300">
            Ada perubahan konten yang belum disimpan. Draft tetap tersedia saat berpindah section.
          </p>
        )}
        <a
          href="/portfolio"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-slate-600 hover:text-orange-700 dark:text-slate-300 dark:hover:text-orange-300"
        >
          <ExternalLink className="size-3.5" /> Lihat Halaman Portofolio
        </a>
      </aside>
      <div
        ref={panelRef}
        id="portfolio-section-panel"
        role="region"
        aria-labelledby="portfolio-section-title"
        className={`${cardClass} scroll-mt-24`}
      >
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-white/10 sm:p-6">
          <div className="min-w-0 flex-1 basis-60">
            <h2 id="portfolio-section-title" className="text-base font-semibold text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{descriptions[selected]}</p>
          </div>
          {!management && (
            <label className="flex items-center gap-2 text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                disabled={disabled}
                checked={data.visibility[selected] !== false}
                onChange={(event) =>
                  change({ ...data, visibility: { ...data.visibility, [selected]: event.target.checked } })
                }
                className="size-4 shrink-0 accent-orange-600"
              />
              Tampilkan di halaman Portofolio
            </label>
          )}
        </header>
        {management ? (
          <div className="min-w-0 space-y-5 p-4 sm:p-6">{children}</div>
        ) : (
          <form onSubmit={submit} aria-labelledby="portfolio-section-title" className="min-w-0 p-5 sm:p-6">
            {loading && (
              <p role="status" className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                <LoaderCircle className="size-4 animate-spin" />
                Memuat konten Portofolio...
              </p>
            )}
            {loadError && (
              <p role="alert" className="mb-4 text-xs text-red-700 dark:text-red-300">
                {loadError}
              </p>
            )}
            <fieldset disabled={disabled} className="min-w-0 disabled:opacity-60">
              <PortfolioSectionFields sectionKey={selected} data={data} onChange={change} />
              {selected === "flagship-heading" && (
                <section
                  aria-labelledby="portfolio-flagship-selection"
                  className="mt-7 space-y-4 border-t border-slate-200 pt-6 dark:border-white/10"
                >
                  <h3
                    id="portfolio-flagship-selection"
                    className="text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    Pilih Proyek Unggulan
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Centang proyek yang menjadi flagship, lalu tekan Simpan Perubahan. Hanya proyek aktif yang tampil di
                    website.
                  </p>
                  {studies.length === 0 && (
                    <p className="text-xs text-slate-500">
                      Tambahkan proyek melalui Statistik &amp; Manajemen Studi Kasus terlebih dahulu.
                    </p>
                  )}
                  {studies.map((study) => (
                    <label
                      key={study.id}
                      className="flex min-w-0 cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3.5 dark:border-white/10"
                    >
                      <input
                        type="checkbox"
                        aria-label={`Jadikan ${study.title} proyek unggulan`}
                        checked={flagshipChanges[study.id] ?? Boolean(study.isFlagship)}
                        onChange={(event) => {
                          setFlagshipChanges({ ...flagshipChanges, [study.id]: event.target.checked });
                          setSaved(false);
                          setError("");
                        }}
                        className="mt-0.5 size-4 shrink-0 accent-orange-600"
                      />
                      <span className="min-w-0">
                        <span className="block text-[13px] font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                          {study.title}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                          {study.clientShort || study.client} ·{" "}
                          {study.isActive !== false ? "Aktif" : "Nonaktif — belum tampil di website"}
                        </span>
                      </span>
                    </label>
                  ))}
                </section>
              )}
            </fieldset>
            <footer className="mt-7 border-t border-slate-100 pt-5 dark:border-white/10">
              {error && (
                <p
                  role="alert"
                  className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-300"
                >
                  {error}
                </p>
              )}
              {saved && (
                <p
                  role="status"
                  className="mb-4 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300"
                >
                  <CheckCircle2 className="size-4" />
                  Perubahan konten Portofolio berhasil disimpan.
                </p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-slate-500">
                  {dirty ? "Perubahan konten belum disimpan." : "Sesuai konten tersimpan."}
                </p>
                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    disabled={disabled || !dirty}
                    onClick={() => {
                      setDraft(null);
                      setFlagshipChanges({});
                      setError("");
                      setSaved(false);
                    }}
                    className="min-h-11 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40 dark:border-white/15 dark:text-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={disabled || !dirty}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-orange-700 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-800 disabled:opacity-40"
                  >
                    {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </div>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
}
