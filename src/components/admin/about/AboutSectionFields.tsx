"use client";

import { Plus, Trash2 } from "lucide-react";
import { aboutFieldLabels } from "@/lib/aboutEditor";
import { pageDefinition, type PublicPageContent, type ContentRecord } from "@/lib/publicPageContent";
import type { AboutData } from "@/types/schema";
import { AboutField, AboutFieldGroup, AboutLogoField, aboutSecondaryButton } from "./AboutFields";
import AboutCollectionEditor from "./AboutCollectionEditor";

const definition = pageDefinition("about");

export default function AboutSectionFields({
  sectionKey,
  content,
  profile,
  onText,
  onTexts,
  onProfile,
  onCollection,
  onReading,
  onError,
}: {
  sectionKey: string;
  content: PublicPageContent;
  profile: AboutData;
  onText: (key: string, value: string) => void;
  onTexts: (patch: Record<string, string>) => void;
  onProfile: (patch: Partial<AboutData>) => void;
  onCollection: (key: string, rows: ContentRecord[]) => void;
  onReading: (reading: boolean) => void;
  onError: (error: string) => void;
}) {
  const section = definition.sections.find((item) => item.key === sectionKey)!;
  const field = (key: string, hint?: string) => {
    const spec = section.fields.find((item) => item.key === key)!;
    return (
      <AboutField
        key={key}
        label={aboutFieldLabels[key] || spec.label}
        hint={hint}
        value={content.texts[key]}
        multiline={spec.kind === "textarea"}
        onChange={(value) => onText(key, value)}
      />
    );
  };
  return (
    <div className="space-y-6">
      {sectionKey === "about-hero-heading" ? (
        <>
          <AboutFieldGroup title="Informasi Utama">
            {[1, 2, 3, 4].map((index) => field(`about_hero_text_${index}`))}
          </AboutFieldGroup>
          <AboutFieldGroup title="Logo Perusahaan">
            {[false, true].map((dark) => {
              const srcKey = dark ? "about_hero_src_7" : "about_hero_src_5";
              const altKey = dark ? "about_hero_alt_8" : "about_hero_alt_6";
              return (
                <AboutLogoField
                  key={srcKey}
                  dark={dark}
                  value={content.texts[srcKey]}
                  alt={content.texts[altKey]}
                  onChange={(value, alt) => onTexts({ [srcKey]: value, [altKey]: alt })}
                  onReading={onReading}
                  onError={onError}
                />
              );
            })}
          </AboutFieldGroup>
          <AboutField
            label="Deskripsi Pembuka"
            hint="Teks yang menjelaskan tentang perusahaan di bagian pembuka halaman."
            value={profile.story}
            onChange={(story) => onProfile({ story })}
            multiline
          />
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {field("about_hero_text_12", "Teks ajakan utama yang ditampilkan pada tombol.")}
            {field("about_hero_href_11", "Alamat halaman tujuan ketika tombol diklik.")}
            {field("about_hero_text_14", "Teks tombol tambahan yang ditampilkan.")}
            {field("about_hero_href_13", "Alamat halaman atau bagian yang dituju.")}
          </div>
          <details className="border-t border-slate-100 pt-5 dark:border-white/10">
            <summary className="w-fit cursor-pointer rounded text-[13px] font-semibold text-slate-700 focus-visible:outline-2 focus-visible:outline-orange-500 dark:text-slate-200">
              Judul Profil, Keterangan & Statistik
            </summary>
            <div className="mt-5 space-y-6">
              <AboutFieldGroup title="Profil Perusahaan">
                <AboutField
                  label="Judul utama profil"
                  value={profile.title}
                  onChange={(title) => onProfile({ title })}
                />
                <AboutField
                  label="Subjudul profil"
                  value={profile.subtitle}
                  onChange={(subtitle) => onProfile({ subtitle })}
                />
                {field("about_hero_text_9")}
                {field("about_hero_text_10")}
              </AboutFieldGroup>
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Statistik Pencapaian</h3>
                {profile.stats.map((stat, index) => (
                  <div key={index} className="rounded-lg border border-slate-200 p-4 dark:border-white/10">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Statistik {index + 1}
                      </h4>
                      <button
                        type="button"
                        aria-label={`Hapus statistik ${index + 1}`}
                        onClick={() => onProfile({ stats: profile.stats.filter((_, position) => position !== index) })}
                        className="rounded p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-orange-500"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(["value", "label", "description"] as const).map((key) => (
                        <AboutField
                          key={key}
                          label={key === "value" ? "Nilai" : key === "label" ? "Label capaian" : "Keterangan capaian"}
                          value={stat[key]}
                          onChange={(value) =>
                            onProfile({
                              stats: profile.stats.map((item, position) =>
                                position === index ? { ...item, [key]: value } : item
                              ),
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
                {profile.stats.length < 12 && (
                  <button
                    type="button"
                    className={aboutSecondaryButton}
                    onClick={() => onProfile({ stats: [...profile.stats, { label: "", value: "", description: "" }] })}
                  >
                    <Plus className="size-4" />
                    Tambah Statistik
                  </button>
                )}
              </section>
            </div>
          </details>
        </>
      ) : (
        <>
          <AboutFieldGroup title="Informasi Bagian">
            {section.fields
              .filter((item) => sectionKey !== "vision-mission-heading" || Number(item.key.split("_").at(-1)) <= 4)
              .map((item) => field(item.key))}
          </AboutFieldGroup>
          {sectionKey === "vision-mission-heading" && (
            <>
              <section className="space-y-5 border-t border-slate-100 pt-6 dark:border-white/10">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Visi & Misi Perusahaan</h3>
                <AboutField
                  label="Visi perusahaan"
                  value={profile.vision}
                  onChange={(vision) => onProfile({ vision })}
                  multiline
                />
                <div className="space-y-3">
                  <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Daftar Misi Strategis</h4>
                  {profile.mission.map((mission, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <div className="min-w-0 flex-1">
                        <AboutField
                          label={`Misi ${index + 1}`}
                          value={mission}
                          onChange={(value) =>
                            onProfile({
                              mission: profile.mission.map((item, position) => (position === index ? value : item)),
                            })
                          }
                        />
                      </div>
                      <button
                        type="button"
                        aria-label={`Hapus misi ${index + 1}`}
                        onClick={() =>
                          onProfile({ mission: profile.mission.filter((_, position) => position !== index) })
                        }
                        className={`${aboutSecondaryButton} !px-3 hover:text-red-600`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={aboutSecondaryButton}
                    onClick={() => onProfile({ mission: [...profile.mission, ""] })}
                  >
                    <Plus className="size-4" />
                    Tambah Misi
                  </button>
                </div>
              </section>
              <details className="border-t border-slate-100 pt-5 dark:border-white/10">
                <summary className="w-fit cursor-pointer rounded text-[13px] font-semibold text-slate-700 focus-visible:outline-2 focus-visible:outline-orange-500 dark:text-slate-200">
                  Judul dan Label Visi & Misi
                </summary>
                <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  {section.fields
                    .filter((item) => Number(item.key.split("_").at(-1)) > 4)
                    .map((item) => field(item.key))}
                </div>
              </details>
            </>
          )}
        </>
      )}
      {Object.entries(definition.collections)
        .filter(([, schema]) => schema.section === sectionKey)
        .map(([key, schema]) => (
          <AboutCollectionEditor
            key={key}
            collectionKey={key}
            title={schema.title}
            shape={schema.items[0]}
            items={content.collections[key]}
            onChange={(rows) => onCollection(key, rows)}
          />
        ))}
    </div>
  );
}
