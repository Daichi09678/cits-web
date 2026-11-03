"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, Play, X } from "lucide-react";
import ProductPhoto from "@/components/ui/ProductPhoto";
import { useModalFocus } from "@/components/ui/useModalFocus";
import { consultationHref } from "@/lib/consultation";
import { productDiscoveryQuestions } from "@/lib/productDetails";
import type { ProductItem } from "@/types/schema";

export default function ProductDetailsDialog({ product, onClose }: { product: ProductItem; onClose: () => void }) {
  const ref = useModalFocus(true, onClose);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const features = [...new Set(product.features.filter(Boolean))];
  const tags = [...new Set(product.tags.filter(Boolean))];
  const toggle = (feature: string) =>
    setSelectedFeatures((current) =>
      current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]
    );
  const selectionText = selectedFeatures.length
    ? selectedFeatures.length + " fitur dipilih"
    : "Belum ada fitur dipilih";
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl max-h-[92dvh] min-h-0 flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16162c] shadow-2xl overflow-hidden">
        <header className="shrink-0 flex items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 px-4 py-3 sm:px-6">
          <p className="text-sm font-bold text-slate-900 dark:text-white">Spesifikasi Produk</p>
          <button
            type="button"
            aria-label="Tutup jendela spesifikasi produk"
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div
          data-testid="product-details-content"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6 [overflow-wrap:anywhere]"
        >
          <div className="grid md:grid-cols-2 items-start gap-5 sm:gap-6">
            <ProductPhoto image={product.image} name={product.name} className="h-40 sm:h-52 md:h-60 rounded-xl" />
            <div className="min-w-0">
              <span className="inline-block max-w-full rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 px-2.5 py-1 text-xs font-semibold text-orange-800 dark:text-orange-300">
                {product.category}
              </span>
              <h2
                id="modal-product-title"
                className="mt-3 text-xl sm:text-2xl font-extrabold leading-snug text-slate-900 dark:text-white"
              >
                {product.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200">
                {product.description}
              </p>
              {tags.length > 0 && (
                <ul aria-label="Kapabilitas produk" className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="max-w-full rounded-lg border border-slate-200 dark:border-white/10 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <section aria-labelledby="product-features-heading">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 id="product-features-heading" className="font-bold text-slate-900 dark:text-white">
                Fitur & Ruang Lingkup
              </h3>
              <span className="text-xs font-semibold text-orange-800 dark:text-orange-300" aria-live="polite">
                {selectionText}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Pilih fitur yang ingin dibahas, maksimal 20. Pilihan akan dibawa ke kontak untuk konsultasi atau demo.
            </p>
            <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
              {features.map((feature) => {
                const selected = selectedFeatures.includes(feature);
                return (
                  <label
                    key={feature}
                    className={
                      "min-w-0 flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors " +
                      (selected
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950/40"
                        : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-orange-300 dark:hover:border-orange-700")
                    }
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={!selected && selectedFeatures.length >= 20}
                      onChange={() => toggle(feature)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-orange-700"
                    />
                    <span className="min-w-0 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                      {feature}
                    </span>
                  </label>
                );
              })}
            </div>
            {!features.length && (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Rincian fitur belum dicantumkan. Tim CITS dapat menjelaskannya saat konsultasi.
              </p>
            )}
          </section>
          <details className="group rounded-xl border border-slate-200 dark:border-white/10 p-4">
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-white">
              Persiapan Konsultasi & Implementasi
              <ChevronDown className="h-4 w-4 shrink-0 group-open:rotate-180 transition-transform" aria-hidden="true" />
            </summary>
            <ul className="mt-4 space-y-3">
              {productDiscoveryQuestions(product).map((question) => (
                <li
                  key={question}
                  className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-orange-700 dark:text-orange-300"
                    aria-hidden="true"
                  />
                  <span>{question}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-slate-200 dark:border-white/10 pt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Kapasitas, server/cloud, keamanan, integrasi, biaya, dan SLA dikonfirmasi sesuai kebutuhan proyek.
            </p>
          </details>
        </div>
        <footer className="shrink-0 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#16162c] p-3 sm:px-6 sm:py-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Link
              href={consultationHref({
                productId: product.id,
                purpose: "discussion",
                features: selectedFeatures,
                source: "products",
              })}
              className="min-w-0 min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-700 hover:bg-orange-800 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-white"
            >
              Konsultasi Produk
              <ArrowRight className="hidden sm:block h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
            <Link
              href={consultationHref({
                productId: product.id,
                purpose: "demo",
                features: selectedFeatures,
                source: "products",
              })}
              className="min-w-0 min-h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
            >
              <Play className="hidden sm:block h-4 w-4 shrink-0" aria-hidden="true" />
              Minta Demo
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
