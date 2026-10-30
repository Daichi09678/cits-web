"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Search,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import ProductPhoto from "@/components/ui/ProductPhoto";
import ServicePhoto from "@/components/ui/ServicePhoto";
import { CONSULTATION_PURPOSES, consultationHref } from "@/lib/consultation";
import {
  buildFeaturedCatalog,
  EMPTY_CATALOG_FILTERS,
  filterFeaturedCatalog,
  selectedCatalogFeatures,
  type CatalogFilters,
} from "@/lib/catalogFinder";
import type { ConsultationPurpose, ProductItem, ServicePillar } from "@/types/schema";

type FeaturedCatalogProps = {
  services: ServicePillar[];
  products: ProductItem[];
  title?: string;
  subtitle?: string;
  anchorId?: string;
  bottomCtaText?: string;
  bottomCtaLink?: string;
};

const selectClass =
  "mt-2 min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 pr-8 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#1A1A2E] dark:text-slate-100";
const fieldLabelClass = "block min-w-0 text-xs font-semibold text-slate-600 dark:text-slate-300";

export default function FeaturedCatalog({
  services,
  products,
  title,
  subtitle,
  anchorId,
  bottomCtaText,
  bottomCtaLink,
}: FeaturedCatalogProps) {
  const id = useId();
  const router = useRouter();
  const [filters, setFilters] = useState<CatalogFilters>({ ...EMPTY_CATALOG_FILTERS });
  const [selectedId, setSelectedId] = useState("");
  const [featureChoices, setFeatureChoices] = useState<Record<string, string[]>>({});
  const [purpose, setPurpose] = useState<ConsultationPurpose>("discussion");
  const items = useMemo(() => buildFeaturedCatalog(services, products), [services, products]);
  const result = useMemo(() => filterFeaturedCatalog(items, filters), [items, filters]);
  const selected = result.matches.find((item) => item.id === selectedId) || result.matches[0];
  const selectedFeatures = selected
    ? selectedCatalogFeatures(selected, featureChoices[selected.id], result.filters.capability)
    : [];
  const hasFilters = Object.values(result.filters).some((value) => value.trim());
  const servicesOnly = items.length > 0 && items.every((item) => item.kind === "Layanan");
  const productsOnly = items.length > 0 && items.every((item) => item.kind === "Produk");
  const itemLabel = servicesOnly ? "layanan" : productsOnly ? "produk" : "solusi";
  const resetFilters = () => {
    setFilters({ ...EMPTY_CATALOG_FILTERS });
    setSelectedId("");
  };
  const updateCategory = (category: string) =>
    setFilters({ ...result.filters, category, capability: "", technology: "" });
  const consultationLink = selected
    ? consultationHref({
        service: selected.serviceTitle,
        productId: selected.productId,
        purpose,
        features: selectedFeatures,
        source: "home",
      })
    : consultationHref({ source: "home" });

  return (
    <section
      id={anchorId ?? "temukan-layanan"}
      aria-labelledby={id + "-heading"}
      className="relative overflow-hidden border-t border-slate-200/70 bg-white py-16 transition-colors sm:py-20 lg:py-24 dark:border-white/10 dark:bg-[#1A1A2E]"
      data-testid="featured-catalog"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-9 max-w-3xl text-center sm:mb-12">
          <h2
            id={id + "-heading"}
            className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white"
          >
            {title ?? "Temukan solusi untuk kebutuhan Anda"}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
            {subtitle ??
              "Cari kebutuhan Anda, pilih kapabilitas yang sesuai, lalu diskusikan solusinya bersama tim CITS."}
          </p>
        </div>

        <form
          action="/contact#consultation-form"
          method="get"
          onSubmit={(event) => {
            event.preventDefault();
            if (selected) router.push(consultationLink);
          }}
          aria-label={`Pencarian dan pemilihan kebutuhan ${itemLabel}`}
          className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/[0.04] sm:rounded-[2rem] dark:border-white/10 dark:bg-[#1A1A2E] dark:shadow-black/20"
          data-testid="service-finder"
        >
          <div className="border-b border-slate-200/80 bg-slate-50/60 p-5 sm:p-7 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm shadow-orange-600/20">
                  <SlidersHorizontal className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                    Sesuaikan dengan kebutuhan Anda
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Hasil langsung menyesuaikan pilihan Anda.
                  </p>
                </div>
              </div>
              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-orange-600 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-orange-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset filter
                </button>
              )}
            </div>
            <div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]"
              data-testid="featured-category-control"
            >
              <label className={fieldLabelClass} htmlFor={id + "-query"}>
                Cari kebutuhan
                <span className="relative mt-2 block">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-slate-400"
                  />
                  <input
                    id={id + "-query"}
                    type="search"
                    value={filters.query}
                    onChange={(event) =>
                      setFilters({ ...result.filters, query: event.target.value, capability: "", technology: "" })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") event.preventDefault();
                    }}
                    placeholder="Aplikasi, SPBE, server..."
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#1A1A2E] dark:text-white"
                  />
                </span>
              </label>
              <label className={fieldLabelClass} htmlFor={id + "-category"}>
                Kategori
                <select
                  id={id + "-category"}
                  aria-label={`Pilih kategori ${itemLabel}`}
                  value={result.filters.category}
                  onChange={(event) => updateCategory(event.target.value)}
                  className={selectClass}
                >
                  <option value="">Semua kategori</option>
                  {result.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className={fieldLabelClass} htmlFor={id + "-capability"}>
                Kapabilitas yang dibutuhkan
                <select
                  id={id + "-capability"}
                  value={result.filters.capability}
                  disabled={!result.capabilities.length}
                  onChange={(event) =>
                    setFilters({ ...result.filters, capability: event.target.value, technology: "" })
                  }
                  className={selectClass}
                >
                  <option value="">Semua kapabilitas</option>
                  {result.capabilities.map((capability) => (
                    <option key={capability} value={capability}>
                      {capability}
                    </option>
                  ))}
                </select>
              </label>
              <label className={fieldLabelClass} htmlFor={id + "-technology"}>
                Teknologi / standar
                <select
                  id={id + "-technology"}
                  value={result.filters.technology}
                  disabled={!result.technologies.length}
                  onChange={(event) => setFilters({ ...result.filters, technology: event.target.value })}
                  className={selectClass}
                >
                  <option value="">Semua teknologi</option>
                  {result.technologies.map((technology) => (
                    <option key={technology} value={technology}>
                      {technology}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {hasFilters && (
              <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter aktif">
                {Object.entries(result.filters)
                  .filter(([, value]) => value.trim())
                  .map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      aria-label={"Hapus filter " + value}
                      onClick={() => {
                        if (key === "category") updateCategory("");
                        else
                          setFilters({
                            ...result.filters,
                            [key]: "",
                            ...(key === "query" || key === "capability" ? { technology: "" } : {}),
                          });
                      }}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-[11px] font-medium text-orange-900 transition hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200"
                    >
                      <span className="truncate">{value}</span>
                      <X className="h-3 w-3 shrink-0" />
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
            <div className="min-w-0 border-b border-slate-200/80 p-5 sm:p-7 lg:border-r lg:border-b-0 dark:border-white/10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pilihan {itemLabel}</h3>
                <span
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300"
                >
                  {result.matches.length} tersedia
                </span>
              </div>
              <p className="mb-5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Pilih salah satu untuk melihat rincian dan menyesuaikan kebutuhan konsultasi.
              </p>
              {result.matches.length ? (
                <fieldset className="max-h-[28rem] space-y-2.5 overflow-y-auto p-1 -m-1">
                  <legend className="sr-only">Pilih {itemLabel} yang sesuai</legend>
                  {result.matches.map((item) => (
                    <label
                      key={item.id}
                      className="relative block cursor-pointer"
                      data-featured-item={item.id}
                      data-product-id={item.productId}
                      data-service-id={item.serviceTitle ? item.id : undefined}
                    >
                      <input
                        type="radio"
                        name="catalog-choice"
                        value={item.id}
                        checked={selected?.id === item.id}
                        onChange={() => setSelectedId(item.id)}
                        className="peer sr-only"
                      />
                      <span className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 transition hover:border-orange-300 hover:bg-orange-50/30 peer-checked:border-orange-500 peer-checked:bg-orange-50/60 peer-checked:shadow-sm peer-focus-visible:ring-4 peer-focus-visible:ring-orange-500/20 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-orange-500/50 dark:hover:bg-orange-500/5 dark:peer-checked:border-orange-500 dark:peer-checked:bg-orange-500/10">
                        <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                          {item.kind === "Produk" ? (
                            <ProductPhoto image={item.image} name={item.title} className="h-full" />
                          ) : (
                            <ServicePhoto image={item.image || ""} name={item.title} className="h-full" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          {result.categories.length > 1 && (
                            <span className="mb-1 block truncate text-[10px] font-semibold text-orange-800 dark:text-orange-300">
                              {item.category}
                            </span>
                          )}
                          <span className="block text-sm font-bold text-slate-900 dark:text-white">{item.title}</span>
                          <span className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                            {item.description}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border " +
                            (selected?.id === item.id
                              ? "border-orange-600 bg-orange-600 text-white"
                              : "border-slate-300 dark:border-white/20")
                          }
                        >
                          {selected?.id === item.id && <Check className="h-3 w-3" />}
                        </span>
                      </span>
                    </label>
                  ))}
                </fieldset>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
                  <Search className="mx-auto mb-3 h-6 w-6 text-slate-400" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    {items.length ? "Belum ada yang sesuai" : `Pilihan ${itemLabel} sedang diperbarui`}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {items.length
                      ? "Coba kata kunci lain atau kurangi filter untuk melihat lebih banyak pilihan."
                      : "Anda tetap bisa mendiskusikan kebutuhan langsung bersama tim kami."}
                  </p>
                  {hasFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-4 min-h-10 text-xs font-bold text-orange-700 hover:underline dark:text-orange-300"
                    >
                      Tampilkan semua {itemLabel}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div
              className="min-w-0 bg-slate-50/40 p-5 sm:p-7 dark:bg-white/[0.015]"
              data-testid="selected-catalog-detail"
            >
              {selected ? (
                <div key={selected.id}>
                  <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-800 dark:text-orange-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    Pilihan Anda
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {selected.category}
                      </span>
                      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {selected.title}
                      </h3>
                    </div>
                    <Link
                      href={selected.href}
                      aria-label={"Lihat detail " + selected.title}
                      className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-orange-800 transition hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-orange-600 dark:text-orange-300 dark:hover:bg-orange-500/10"
                    >
                      Detail
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {selected.description}
                  </p>
                  {selected.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5" aria-label={"Tag " + selected.title}>
                      {selected.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {selected.sla && (
                    <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50/70 p-3 text-xs leading-relaxed text-emerald-800 dark:border-emerald-500/15 dark:bg-emerald-500/5 dark:text-emerald-300">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{selected.sla}</span>
                    </div>
                  )}
                  {selected.features.length > 0 && (
                    <fieldset className="mt-6">
                      <legend className="text-sm font-bold text-slate-900 dark:text-white">
                        Apa yang ingin Anda bahas?
                      </legend>
                      <p className="mb-3 mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        Centang kapabilitas yang dibutuhkan. Pilihan akan dibawa ke formulir konsultasi.
                      </p>
                      <div className="grid max-h-60 gap-2 overflow-y-auto p-1 -m-1 sm:grid-cols-2">
                        {selected.features.map((feature) => (
                          <label
                            key={feature}
                            className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-700 transition hover:border-orange-300 has-checked:border-orange-400 has-checked:bg-orange-50/60 has-focus-visible:ring-2 has-focus-visible:ring-orange-500/30 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-200 dark:has-checked:border-orange-500/50 dark:has-checked:bg-orange-500/10"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFeatures.includes(feature)}
                              disabled={!selectedFeatures.includes(feature) && selectedFeatures.length >= 20}
                              onChange={(event) =>
                                setFeatureChoices({
                                  ...featureChoices,
                                  [selected.id]: event.target.checked
                                    ? [...selectedFeatures, feature]
                                    : selectedFeatures.filter((item) => item !== feature),
                                })
                              }
                              className="mt-0.5 h-4 w-4 shrink-0 accent-orange-600"
                            />
                            <span>{feature}</span>
                          </label>
                        ))}
                      </div>
                      {selectedFeatures.length >= 20 && (
                        <p role="status" className="mt-2 text-xs text-slate-500">
                          Maksimal 20 kapabilitas untuk satu konsultasi.
                        </p>
                      )}
                    </fieldset>
                  )}
                  {selected.technologies.length > 0 && (
                    <details className="mt-5 text-xs text-slate-500 dark:text-slate-400">
                      <summary className="cursor-pointer font-semibold">Teknologi & standar yang didukung</summary>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selected.technologies.map((technology) => (
                          <span key={technology} className="rounded-md bg-slate-100 px-2 py-1 dark:bg-white/5">
                            {technology}
                          </span>
                        ))}
                      </div>
                    </details>
                  )}
                  <label className={"mt-6 " + fieldLabelClass} htmlFor={id + "-purpose"}>
                    Tujuan konsultasi
                    <select
                      id={id + "-purpose"}
                      value={purpose}
                      onChange={(event) => setPurpose(event.target.value as ConsultationPurpose)}
                      className={selectClass}
                    >
                      {Object.entries(CONSULTATION_PURPOSES).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : (
                <div className="flex h-full min-h-64 flex-col items-center justify-center px-4 py-10 text-center">
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                    <SlidersHorizontal className="h-6 w-6" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Kebutuhan Anda tetap bisa didiskusikan
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Tim kami dapat membantu menentukan pendekatan yang sesuai, termasuk untuk kebutuhan khusus.
                  </p>
                  <Link
                    href={consultationHref({ source: "home" })}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-800"
                  >
                    Diskusikan kebutuhan lain
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex min-w-0 items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {selected ? (
                  <>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selected.title}</span>
                    <span className="block">
                      {selectedFeatures.length
                        ? selectedFeatures.length + " kapabilitas dipilih untuk dibahas."
                        : "Konsultasi awal untuk memahami kebutuhan Anda."}
                    </span>
                  </>
                ) : (
                  "Sesuaikan pencarian untuk menemukan pilihan yang sesuai."
                )}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <input type="hidden" name="source" value="home" />
              <input type="hidden" name="purpose" value={purpose} />
              {selected?.serviceTitle && <input type="hidden" name="service" value={selected.serviceTitle} />}
              {selected?.productId && <input type="hidden" name="product" value={selected.productId} />}
              {selectedFeatures.map((feature) => (
                <input key={feature} type="hidden" name="feature" value={feature} />
              ))}
              <button
                type="submit"
                disabled={!selected}
                data-consultation-href={consultationLink}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-600/15 transition hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none dark:disabled:bg-white/10 dark:disabled:text-slate-500"
              >
                Lanjutkan konsultasi
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>

        {bottomCtaText && bottomCtaLink && (
          <div className="mt-6 text-center">
            <Link
              href={bottomCtaLink}
              className="inline-flex min-h-11 items-center justify-center gap-2 text-xs font-semibold text-slate-600 transition hover:text-orange-700 sm:text-sm dark:text-slate-300 dark:hover:text-orange-300"
            >
              {bottomCtaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
