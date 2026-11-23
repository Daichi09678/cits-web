"use client";
import { BackOfficeInput as Input } from "@/components/ui/Input";
import FieldLabel from "@/components/ui/FieldLabel";

import type { LandingEditorState } from "./useLandingEditor";

export default function LandingHeroCtaFields({ editor }: { editor: LandingEditorState }) {
  const { formData, setFormData } = editor;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-white/10">
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
        <span className="block font-bold text-xs text-orange-600 dark:text-orange-400">Tombol Utama (Primary CTA)</span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FieldLabel htmlFor="landing-hero-cta-fields-form-data-hero-primary-cta-text" fieldSize="sm">
              Teks Tombol
            </FieldLabel>
            <Input
              type="text"
              value={formData.hero.primaryCtaText}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, primaryCtaText: e.target.value },
                })
              }
              fieldSize="sm"
              className="w-full"
              id="landing-hero-cta-fields-form-data-hero-primary-cta-text"
            />
          </div>
          <div>
            <FieldLabel htmlFor="landing-hero-cta-fields-form-data-hero-primary-cta-link" fieldSize="sm">
              Link Tujuan
            </FieldLabel>
            <Input
              type="text"
              value={formData.hero.primaryCtaLink}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, primaryCtaLink: e.target.value },
                })
              }
              fieldSize="sm"
              className="w-full"
              id="landing-hero-cta-fields-form-data-hero-primary-cta-link"
            />
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
        <span className="block font-bold text-xs text-slate-700 dark:text-slate-300">
          Tombol Sekunder (Secondary CTA)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FieldLabel htmlFor="landing-hero-cta-fields-form-data-hero-secondary-cta-text" fieldSize="sm">
              Teks Tombol
            </FieldLabel>
            <Input
              type="text"
              value={formData.hero.secondaryCtaText}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, secondaryCtaText: e.target.value },
                })
              }
              fieldSize="sm"
              className="w-full"
              id="landing-hero-cta-fields-form-data-hero-secondary-cta-text"
            />
          </div>
          <div>
            <FieldLabel htmlFor="landing-hero-cta-fields-form-data-hero-secondary-cta-link" fieldSize="sm">
              Link Tujuan
            </FieldLabel>
            <Input
              type="text"
              value={formData.hero.secondaryCtaLink}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, secondaryCtaLink: e.target.value },
                })
              }
              fieldSize="sm"
              className="w-full"
              id="landing-hero-cta-fields-form-data-hero-secondary-cta-link"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
