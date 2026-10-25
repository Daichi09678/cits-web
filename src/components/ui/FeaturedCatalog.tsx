"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Filter, Package, Sparkles } from "lucide-react";
import ProductPhoto from "@/components/ui/ProductPhoto";
import ServicePhoto from "@/components/ui/ServicePhoto";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { consultationHref } from "@/lib/consultation";
import { resolveServiceCatalog } from "@/lib/serviceCatalog";
import type { ProductItem, ServicePillar } from "@/types/schema";

type FeaturedCatalogProps = {
  services: ServicePillar[];
  products: ProductItem[];
  title?: string;
  subtitle?: string;
};

type CatalogItem = {
  id: string;
  kind: "Layanan" | "Produk";
  category: string;
  title: string;
  description: string;
  tags: string[];
  features: string[];
  image?: string;
  href: string;
  consultationHref: string;
};

export default function FeaturedCatalog({ services, products, title, subtitle }: FeaturedCatalogProps) {
  const [category, setCategory] = useState("Semua");
  const items = useMemo<CatalogItem[]>(() => {
    const serviceItems = resolveServiceCatalog(services.filter((item) => item.isActive !== false && item.showOnHome !== false)).map(
      (item) => ({
        id: `service-${item.id}`,
        kind: "Layanan" as const,
        category: item.category || "Layanan CITS",
        title: item.title,
        description: item.description,
        tags: item.tags || [],
        features: item.features || [],
        image: item.image,
        href: `/services#${encodeURIComponent(item.id)}`,
        consultationHref: consultationHref({ service: item.title, source: "home" }),
      })
    );
    const productItems = products.filter((item) => item.isActive && item.showOnHome !== false).map((item) => ({
      id: `product-${item.id}`,
      kind: "Produk" as const,
      category: item.category || "Produk CITS",
      title: item.name,
      description: item.description,
      tags: item.tags || [],
      features: item.features || [],
      image: item.image,
      href: `/products#${encodeURIComponent(item.id)}`,
      consultationHref: consultationHref({ productId: item.id, source: "home" }),
    }));
    return [...serviceItems, ...productItems];
  }, [products, services]);

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(items.map((item) => item.category)))], [items]);
  const visibleItems = category === "Semua" ? items : items.filter((item) => item.category === category);

  return (
    <section className="relative overflow-hidden bg-white py-24 transition-colors dark:bg-[#1A1A2E]" data-testid="featured-catalog">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-xs font-semibold text-orange-800 dark:border-orange-800/50 dark:bg-orange-950/40 dark:text-orange-300">
            <Sparkles className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
            <span>Layanan Unggulan</span>
          </div>
          <h2 className="text-3xl font-bold text-dark dark:text-white md:text-4xl lg:text-5xl">
            {title || "Solusi yang dapat disesuaikan dengan kebutuhan Anda"}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-white/85 md:text-base">
            {subtitle || "Pilih kategori untuk melihat layanan, tag, dan kapabilitas utama yang tersedia."}
          </p>
        </div>

        <div className="mx-auto mb-10 flex max-w-xl flex-col gap-2 sm:flex-row sm:items-center" data-testid="featured-category-control">
          <label htmlFor="featured-category" className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            <Filter className="h-4 w-4 text-orange-600" />
            Kategori
          </label>
          <select
            id="featured-category"
            aria-label="Pilih kategori layanan"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {categories.map((item) => (
              <option key={item} value={item} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                {item === "Semua" ? "Semua kategori" : item}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500 dark:text-slate-400">{visibleItems.length} item</span>
        </div>

        <div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-3" aria-label="Pilihan cepat kategori layanan">
          {categories.slice(1, 4).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                category === item
                  ? "border-orange-600 bg-orange-600 text-white shadow-md shadow-orange-600/20"
                  : "border-slate-200 bg-white text-slate-700 hover:border-orange-400 hover:text-orange-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-orange-500 dark:hover:text-orange-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {visibleItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
            Belum ada layanan atau produk yang ditampilkan pada kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item) => (
              <SpotlightCard key={item.id} className="h-full">
                <article className="flex min-h-[620px] h-full flex-col overflow-hidden" data-featured-item={item.id}>
                  {item.kind === "Produk" ? (
                    <Link href={item.href} aria-label={`Lihat ${item.title}`} className="block overflow-hidden bg-slate-100 dark:bg-white/5">
                      <ProductPhoto image={item.image} name={item.title} className="h-48 transition-transform duration-300 hover:scale-105" />
                    </Link>
                  ) : (
                    <Link href={item.href} aria-label={`Lihat ${item.title}`} className="block overflow-hidden bg-slate-100 dark:bg-white/5">
                      <ServicePhoto image={item.image || ""} name={item.title} className="h-48 transition-transform duration-300 hover:scale-105" />
                    </Link>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300">
                        {item.kind === "Produk" ? <Package className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                        {item.kind}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-white/10 dark:text-slate-200">{item.category}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-dark dark:text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-white/85">{item.description}</p>
                    {item.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5" aria-label={`Tag ${item.title}`}>
                        {item.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-orange-200 px-2.5 py-1 text-[11px] font-medium text-orange-800 dark:border-orange-800/60 dark:text-orange-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.features.length > 0 && (
                      <ul className="mt-5 space-y-2 text-sm text-gray-700 dark:text-white/85" aria-label={`Fitur utama ${item.title}`}>
                        {item.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-700 dark:text-orange-400" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <Link href={item.href} className="inline-flex items-center gap-2 text-sm font-semibold text-orange-800 hover:underline dark:text-orange-300">
                        Lihat detail <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link href={item.consultationHref} className="inline-flex items-center gap-2 rounded-xl bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800">
                        Konsultasi <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
