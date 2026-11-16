"use client";
import Input, { Textarea } from "@/components/ui/Input";
import FieldLabel from "@/components/ui/FieldLabel";

import Link from "next/link";
import { Shield } from "lucide-react";
import { DEFAULT_FOCUS_EXPLANATION, resolveFocusItems } from "@/lib/focusContent";
import type { LandingEditorState } from "./useLandingEditor";

export default function LandingFocusFields({ editor }: { editor: LandingEditorState }) {
  const { formData, setFormData, handleCard4FocusChange } = editor;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 rounded-2xl border border-orange-200 dark:border-orange-500/20 bg-orange-50/60 dark:bg-orange-500/10 p-5">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Layanan Beranda Mengikuti Katalog Layanan</h4>
        <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          Judul, deskripsi, fitur, ikon, dan SLA pada tiga kartu beranda mengambil data yang sama dengan halaman
          Layanan. Pengaturan prinsip kerja FOCUS tetap tersedia di bawah.
        </p>
        <Link
          href="/admin/services"
          className="mt-4 inline-flex rounded-xl bg-orange-700 px-4 py-2.5 text-xs font-bold text-white"
        >
          Kelola Data Layanan
        </Link>
      </div>
      {/* Card 4: Prinsip Kerja FOCUS */}
      <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
          <Shield className="w-4 h-4" /> Kartu 4: Prinsip FOCUS & SLA (Span 2)
        </span>

        <div>
          <FieldLabel
            htmlFor="landing-focus-fields-form-data-services-intro-card-focus-badge-budaya-kerja-standar-sla"
            fieldSize="sm"
          >
            Badge
          </FieldLabel>
          <Input
            type="text"
            value={formData.servicesIntro.cardFocus?.badge || "Budaya Kerja & Standar SLA"}
            onChange={(e) =>
              setFormData({
                ...formData,
                servicesIntro: {
                  ...formData.servicesIntro,
                  cardFocus: {
                    ...formData.servicesIntro.cardFocus,
                    badge: e.target.value,
                  },
                },
              })
            }
            fieldSize="sm"
            className="w-full"
            id="landing-focus-fields-form-data-services-intro-card-focus-badge-budaya-kerja-standar-sla"
          />
        </div>

        <div>
          <FieldLabel
            htmlFor="landing-focus-fields-form-data-services-intro-card-focus-title-prinsip-kerja-focus"
            fieldSize="sm"
          >
            Judul Kartu
          </FieldLabel>
          <Input
            type="text"
            value={formData.servicesIntro.cardFocus?.title || "Prinsip Kerja FOCUS"}
            onChange={(e) =>
              setFormData({
                ...formData,
                servicesIntro: {
                  ...formData.servicesIntro,
                  cardFocus: {
                    ...formData.servicesIntro.cardFocus,
                    title: e.target.value,
                  },
                },
              })
            }
            fieldSize="sm"
            className="w-full"
            id="landing-focus-fields-form-data-services-intro-card-focus-title-prinsip-kerja-focus"
          />
        </div>

        <div>
          <FieldLabel
            htmlFor="landing-focus-fields-form-data-services-intro-card-focus-desc-setiap-tahapan-kolaborasi-kami-berakar-pada-5-pilar-keunggulan-operasional"
            fieldSize="sm"
          >
            Deskripsi
          </FieldLabel>
          <Textarea
            rows={2}
            value={
              formData.servicesIntro.cardFocus?.desc ||
              "Setiap tahapan kolaborasi kami berakar pada 5 pilar keunggulan operasional:"
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                servicesIntro: {
                  ...formData.servicesIntro,
                  cardFocus: {
                    ...formData.servicesIntro.cardFocus,
                    desc: e.target.value,
                  },
                },
              })
            }
            fieldSize="sm"
            className="w-full"
            id="landing-focus-fields-form-data-services-intro-card-focus-desc-setiap-tahapan-kolaborasi-kami-berakar-pada-5-pilar-keunggulan-operasional"
          />
        </div>

        <div data-focus-editor>
          <FieldLabel htmlFor="focus-explanation" fieldSize="sm">
            Penjelasan Lengkap FOCUS
          </FieldLabel>
          <Textarea
            id="focus-explanation"
            rows={3}
            maxLength={2000}
            value={formData.servicesIntro.cardFocus?.explanation ?? DEFAULT_FOCUS_EXPLANATION}
            onChange={(event) =>
              setFormData({
                ...formData,
                servicesIntro: {
                  ...formData.servicesIntro,
                  cardFocus: { ...formData.servicesIntro.cardFocus, explanation: event.target.value },
                },
              })
            }
            fieldSize="sm"
            className="mt-1.5 w-full"
          />
        </div>

        <div>
          <FieldLabel
            htmlFor="landing-focus-fields-form-data-services-intro-card-focus-footer-text-terpercaya-menangani-sistem-kementerian-sejak-2006"
            fieldSize="sm"
          >
            Teks Footer Kartu
          </FieldLabel>
          <Input
            type="text"
            value={formData.servicesIntro.cardFocus?.footerText || "Terpercaya menangani sistem kementerian sejak 2006"}
            onChange={(e) =>
              setFormData({
                ...formData,
                servicesIntro: {
                  ...formData.servicesIntro,
                  cardFocus: {
                    ...formData.servicesIntro.cardFocus,
                    footerText: e.target.value,
                  },
                },
              })
            }
            fieldSize="sm"
            className="w-full"
            id="landing-focus-fields-form-data-services-intro-card-focus-footer-text-terpercaya-menangani-sistem-kementerian-sejak-2006"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <FieldLabel
              htmlFor="landing-focus-fields-form-data-services-intro-card-focus-link-text-kenali-cits-lebih-dekat"
              fieldSize="sm"
            >
              Teks Link
            </FieldLabel>
            <Input
              type="text"
              value={formData.servicesIntro.cardFocus?.linkText || "Kenali CITS Lebih Dekat"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  servicesIntro: {
                    ...formData.servicesIntro,
                    cardFocus: {
                      ...formData.servicesIntro.cardFocus,
                      linkText: e.target.value,
                    },
                  },
                })
              }
              fieldSize="sm"
              className="w-full"
              id="landing-focus-fields-form-data-services-intro-card-focus-link-text-kenali-cits-lebih-dekat"
            />
          </div>
          <div>
            <FieldLabel
              htmlFor="landing-focus-fields-form-data-services-intro-card-focus-link-url-about"
              fieldSize="sm"
            >
              URL Link
            </FieldLabel>
            <Input
              type="text"
              value={formData.servicesIntro.cardFocus?.linkUrl || "/about"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  servicesIntro: {
                    ...formData.servicesIntro,
                    cardFocus: {
                      ...formData.servicesIntro.cardFocus,
                      linkUrl: e.target.value,
                    },
                  },
                })
              }
              fieldSize="sm"
              className="w-full"
              id="landing-focus-fields-form-data-services-intro-card-focus-link-url-about"
            />
          </div>
        </div>

        {/* 5 FOCUS Items Editor */}
        <div className="pt-2 border-t border-slate-200/70 dark:border-white/10 space-y-2">
          <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            5 Pilar Prinsip Kerja FOCUS (F - O - C - U - S)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resolveFocusItems(formData.servicesIntro.cardFocus?.focusItems).map((fItem, fIdx) => (
              <div
                key={fIdx}
                className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5"
              >
                <div className="flex items-center gap-1.5">
                  <Input
                    type="text"
                    maxLength={2}
                    value={fItem.letter}
                    onChange={(e) => handleCard4FocusChange(fIdx, "letter", e.target.value)}
                    fieldSize="sm"
                    className="w-7"
                  />
                  <Input
                    type="text"
                    value={fItem.word}
                    onChange={(e) => handleCard4FocusChange(fIdx, "word", e.target.value)}
                    placeholder="Kata"
                    fieldSize="sm"
                    className="min-w-0 flex-1"
                  />
                </div>
                <Input
                  type="text"
                  value={fItem.desc}
                  onChange={(e) => handleCard4FocusChange(fIdx, "desc", e.target.value)}
                  placeholder="Deskripsi"
                  fieldSize="sm"
                  className="w-full"
                />
                <div data-focus-editor>
                  <label
                    htmlFor={`focus-detail-${fIdx}`}
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Penjelasan Prinsip {fItem.word}
                  </label>
                  <Textarea
                    id={`focus-detail-${fIdx}`}
                    rows={4}
                    maxLength={1000}
                    value={fItem.detail || ""}
                    onChange={(event) => handleCard4FocusChange(fIdx, "detail", event.target.value)}
                    fieldSize="sm"
                    className="mt-1.5 w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
