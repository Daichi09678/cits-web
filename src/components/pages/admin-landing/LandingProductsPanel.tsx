"use client";
import Input, { Textarea } from "@/components/ui/Input";
import FieldLabel from "@/components/ui/FieldLabel";

import Link from "next/link";
import { ExternalLink, Package } from "lucide-react";
import type { LandingEditorState } from "./useLandingEditor";

export default function LandingProductsPanel({ editor }: { editor: LandingEditorState }) {
  const { activeTab, vis, toggleSection, formData, setFormData } = editor;
  return (
    <>
      {activeTab === "products" && (
        <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6 animate-in fade-in">
          {/* Section Active Status Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${vis.products ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
              />
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Status Section Produk Unggulan:{" "}
                {vis.products ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
              </span>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/15 bg-white dark:bg-white/10 px-3 py-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={vis.products}
                onChange={() => toggleSection("products")}
                aria-label="Tampilkan section ini di beranda"
                className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Tampilkan di beranda</span>
            </label>
          </div>

          {/* Section Header */}
          <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-white/10">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-600" />
              <span>Teks Pengantar Section Produk Unggulan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel
                  htmlFor="landing-products-panel-form-data-products-intro-badge-solusi-skala-nasional"
                  fieldSize="sm"
                >
                  Badge Teks Produk
                </FieldLabel>
                <Input
                  type="text"
                  value={formData.productsIntro?.badge || "Solusi Skala Nasional"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productsIntro: {
                        badge: e.target.value,
                        title: formData.productsIntro?.title || "Produk Unggulan CITS",
                        subtitle:
                          formData.productsIntro?.subtitle ||
                          "Platform kesistemanan yang telah teruji melayani jutaan transaksi data di berbagai kementerian dan institusi nasional.",
                        ...formData.productsIntro,
                      },
                    })
                  }
                  placeholder="e.g. Solusi Skala Nasional"
                  fieldSize="sm"
                  className="w-full"
                  id="landing-products-panel-form-data-products-intro-badge-solusi-skala-nasional"
                />
              </div>

              <div>
                <FieldLabel
                  htmlFor="landing-products-panel-form-data-products-intro-title-produk-unggulan-cits"
                  fieldSize="sm"
                >
                  Judul Utama Section
                </FieldLabel>
                <Input
                  type="text"
                  value={formData.productsIntro?.title || "Produk Unggulan CITS"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productsIntro: {
                        badge: formData.productsIntro?.badge || "Solusi Skala Nasional",
                        title: e.target.value,
                        subtitle:
                          formData.productsIntro?.subtitle ||
                          "Platform kesistemanan yang telah teruji melayani jutaan transaksi data di berbagai kementerian dan institusi nasional.",
                        ...formData.productsIntro,
                      },
                    })
                  }
                  placeholder="e.g. Produk Unggulan CITS"
                  fieldSize="sm"
                  className="w-full"
                  id="landing-products-panel-form-data-products-intro-title-produk-unggulan-cits"
                />
              </div>
            </div>

            <div>
              <FieldLabel
                htmlFor="landing-products-panel-form-data-products-intro-subtitle-platform-kesistemanan-yang-telah-teruji-melayani-jutaan-transaksi-data-di-berbagai-kementerian-dan-institusi-nasional"
                fieldSize="sm"
              >
                Subjudul / Deskripsi Pendukung
              </FieldLabel>
              <Textarea
                rows={2}
                value={
                  formData.productsIntro?.subtitle ||
                  "Platform kesistemanan yang telah teruji melayani jutaan transaksi data di berbagai kementerian dan institusi nasional."
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productsIntro: {
                      badge: formData.productsIntro?.badge || "Solusi Skala Nasional",
                      title: formData.productsIntro?.title || "Produk Unggulan CITS",
                      subtitle: e.target.value,
                      ...formData.productsIntro,
                    },
                  })
                }
                fieldSize="sm"
                className="w-full"
                id="landing-products-panel-form-data-products-intro-subtitle-platform-kesistemanan-yang-telah-teruji-melayani-jutaan-transaksi-data-di-berbagai-kementerian-dan-institusi-nasional"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 dark:border-orange-500/20 bg-orange-50/60 dark:bg-orange-500/10 p-5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Lima Produk Unggulan dari Katalog</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              Beranda otomatis menampilkan lima produk aktif pertama dari halaman Produk. Foto, nama, deskripsi, dan
              fitur mengikuti katalog yang sama. Pengunjung dapat membuka seluruh katalog melalui tombol Lihat Semua
              Produk.
            </p>
            <Link
              href="/admin/products"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-700 hover:bg-orange-800 px-4 py-2.5 text-xs font-bold text-white"
            >
              Kelola Foto & Konten Produk <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
