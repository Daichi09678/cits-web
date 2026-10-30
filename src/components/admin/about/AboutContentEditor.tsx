"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, GripVertical, Home, Info, LoaderCircle, RefreshCw, Save } from "lucide-react";
import { Inter } from "next/font/google";
import { useAdminAuth } from "@/lib/auth";
import { citsApi } from "@/lib/api";
import { canPerformAction } from "@/lib/internalAccess";
import { usePublicPageContent } from "@/lib/publicPageContentClient";
import { pageDefinition, type ContentRecord, type PublicPageContent } from "@/lib/publicPageContent";
import { aboutSectionDescriptions, persistAboutChanges } from "@/lib/aboutEditor";
import { useCitsStore } from "@/stores/citsStore";
import type { AboutData } from "@/types/schema";
import AboutSectionFields from "./AboutSectionFields";
import { aboutSecondaryButton } from "./AboutFields";

const font = Inter({ subsets: ["latin"], display: "swap" });
const sections = pageDefinition("about").sections;
const cardClass = "min-w-0 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#151528]";

export default function AboutContentEditor() {
  const { session } = useAdminAuth();
  const canEdit = canPerformAction(session?.user, "about", "edit");
  const { actions } = useCitsStore();
  const { content, loading: contentLoading, loadError, save: saveContent } = usePublicPageContent("about");
  const [profileBase, setProfileBase] = useState<AboutData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [selected, setSelected] = useState(sections[0].key);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [draftContent, setDraftContent] = useState<PublicPageContent | null>(null);
  const [draftProfile, setDraftProfile] = useState<AboutData | null>(null);
  const [saving, setSaving] = useState(false);
  const [readingImages, setReadingImages] = useState(0);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const pending = useRef(false);
  useEffect(() => {
    let cancelled = false;
    void citsApi
      .getAboutData()
      .then((data: AboutData | null) => {
        if (cancelled) return;
        if (!data || !Array.isArray(data.mission) || !Array.isArray(data.stats))
          throw new Error("Profil perusahaan belum dapat dimuat. Silakan coba lagi.");
        setProfileBase(data);
      })
      .catch((error) => {
        if (!cancelled)
          setProfileError(error instanceof Error ? error.message : "Profil perusahaan belum dapat dimuat.");
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const data = draftContent || content;
  const profile = draftProfile || profileBase;
  const dirty = draftContent !== null || draftProfile !== null;
  const section = sections.find((item) => item.key === selected)!;
  const visible = data.visibility[selected] !== false;
  const homeVisible = data.homeVisibility[selected] === true;
  const orderedSections = data.order
    .map((key) => sections.find((item) => item.key === key))
    .filter((item): item is (typeof sections)[number] => Boolean(item));
  const editingDisabled = !canEdit || saving || readingImages > 0;
  const changeTexts = (patch: Record<string, string>) => {
    setDraftContent((previous) => ({ ...(previous || content), texts: { ...(previous || content).texts, ...patch } }));
    setSaved(false);
    setError("");
  };
  const changeCollection = (key: string, rows: ContentRecord[]) => {
    setDraftContent((previous) => ({
      ...(previous || content),
      collections: { ...(previous || content).collections, [key]: rows },
    }));
    setSaved(false);
    setError("");
  };
  const changeProfile = (patch: Partial<AboutData>) => {
    setDraftProfile((previous) => ({ ...(previous || profileBase!), ...patch }));
    setSaved(false);
    setError("");
  };
  const changeVisibility = (key: string, checked: boolean) => {
    setDraftContent((previous) => ({
      ...(previous || content),
      visibility: { ...(previous || content).visibility, [key]: checked },
    }));
    setSaved(false);
    setError("");
  };
  const changeHomeVisibility = (key: string, checked: boolean) => {
    setDraftContent((previous) => ({
      ...(previous || content),
      homeVisibility: { ...(previous || content).homeVisibility, [key]: checked },
    }));
    setSaved(false);
    setError("");
  };
  const moveSection = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;
    const order = orderedSections.map((item) => item.key);
    const [moved] = order.splice(from, 1);
    order.splice(to, 0, moved);
    setDraftContent((previous) => ({ ...(previous || content), order }));
    setSaved(false);
    setError("");
  };
  const cancel = () => {
    setDraftContent(null);
    setDraftProfile(null);
    setError("");
    setSaved(false);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending.current || editingDisabled || !dirty) return;
    pending.current = true;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const result = await persistAboutChanges({
        profile: draftProfile,
        content: draftContent,
        saveProfile: (next) => actions.saveAboutData(next),
        saveContent,
      });
      if (result.profileSaved) {
        setProfileBase(draftProfile);
        setDraftProfile(null);
      }
      if (result.contentSaved) setDraftContent(null);
      if (result.error) setError(result.error);
      else setSaved(true);
    } finally {
      pending.current = false;
      setSaving(false);
    }
  };

  if (profileLoading || contentLoading)
    return (
      <div role="status" className="mx-auto flex w-full max-w-[1600px] items-center gap-2 p-6 text-sm text-slate-500">
        <LoaderCircle className="size-4 animate-spin" />
        Memuat konten Tentang Kami...
      </div>
    );
  if (loadError || profileError || !profile)
    return (
      <div role="alert" className="m-4 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 sm:m-6">
        <p>{loadError || profileError || "Profil perusahaan belum dapat dimuat."}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={`${aboutSecondaryButton} mt-4 bg-white`}
        >
          <RefreshCw className="size-4" />
          Coba Lagi
        </button>
      </div>
    );

  return (
    <div
      className={`${font.className} mx-auto grid w-full max-w-[1600px] min-w-0 gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(260px,29%)_minmax(0,1fr)] lg:gap-5 lg:p-8`}
    >
      <aside
        className={`${cardClass} p-5 lg:sticky lg:top-24 lg:min-h-[760px] lg:self-start`}
        aria-labelledby="about-sections-title"
      >
        <h2 id="about-sections-title" className="text-sm font-semibold text-slate-900 dark:text-white">
          Bagian Konten
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Pilih bagian yang ingin Anda ubah.
        </p>
        <nav aria-label="Bagian konten Tentang Kami" className="mt-4 space-y-1.5">
          {orderedSections.map((item, index) => (
            <div
              key={item.key}
              draggable={!editingDisabled}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) moveSection(dragIndex, index);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`flex min-w-0 items-center gap-1 rounded-lg border py-1 pr-1 pl-1.5 transition-colors ${
                dragIndex === index ? "opacity-50" : ""
              } ${
                selected === item.key
                  ? "border-orange-300 bg-orange-50/70 dark:border-orange-500/40 dark:bg-orange-500/10"
                  : "border-slate-200/80 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
              }`}
            >
              <span
                title="Geser untuk mengubah urutan"
                aria-hidden="true"
                className="flex size-8 shrink-0 cursor-grab items-center justify-center rounded text-slate-400 active:cursor-grabbing dark:text-slate-500"
              >
                <GripVertical className="size-4" />
              </span>
              <button
                type="button"
                disabled={saving}
                aria-current={selected === item.key ? "true" : undefined}
                aria-controls="about-section-panel"
                onClick={() => {
                  setSelected(item.key);
                  if (window.matchMedia("(max-width: 1023px)").matches) {
                    window.requestAnimationFrame(() =>
                      document.getElementById("about-section-panel")?.scrollIntoView({
                        block: "start",
                        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
                      })
                    );
                  }
                }}
                className="min-h-10 min-w-0 flex-1 rounded px-1.5 py-2.5 text-left text-xs leading-relaxed font-semibold text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-wait dark:text-slate-200"
              >
                {item.title}
              </button>
              {data.homeVisibility[item.key] && (
                <span
                  title="Tampil di beranda"
                  className="mr-1 flex size-6 shrink-0 items-center justify-center rounded bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300"
                >
                  <Home className="size-3.5" aria-hidden="true" />
                </span>
              )}
            </div>
          ))}
        </nav>
        <div className="mt-4 flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-xs leading-relaxed text-slate-600 dark:bg-blue-500/10 dark:text-slate-300">
          <Info className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <p>
            Urutkan bagian dengan menarik ikon enam titik. Centang “Tampilkan di halaman Tentang Kami” atau “Tampilkan
            di beranda” pada form di samping. Perubahan diterapkan setelah disimpan.
          </p>
        </div>
        {!canEdit && (
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Akun Anda hanya memiliki izin melihat konten ini.
          </p>
        )}
      </aside>

      <form
        id="about-section-panel"
        aria-labelledby="about-section-title"
        onSubmit={submit}
        className={`${cardClass} flex min-w-0 scroll-mt-20 flex-col`}
      >
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-white/10 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1 basis-64">
            <h2
              id="about-section-title"
              className="text-base font-semibold tracking-tight text-slate-900 dark:text-white"
            >
              {section.title}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {aboutSectionDescriptions[selected]}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <label className="flex cursor-pointer items-center gap-2 text-[11px] font-medium text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={visible}
                disabled={editingDisabled}
                onChange={(event) => changeVisibility(selected, event.target.checked)}
                className="size-4 accent-[#FF4D00]"
              />
              Tampilkan di halaman Tentang Kami
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-[11px] font-medium text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={homeVisible}
                disabled={editingDisabled}
                onChange={(event) => changeHomeVisibility(selected, event.target.checked)}
                className="size-4 accent-[#FF4D00]"
              />
              <Home className="size-3.5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
              Tampilkan di beranda
            </label>
            <span className="text-[11px] text-slate-500">
              {dirty ? "Perubahan belum disimpan" : "Sesuai konten tersimpan"}
            </span>
            <span className="max-w-56 text-right text-[10px] leading-relaxed text-slate-400">
              Centang “Tampilkan di beranda” lalu tekan Simpan Perubahan agar ringkasan muncul di halaman utama.
            </span>
          </div>
        </header>
        <fieldset disabled={editingDisabled} className="min-w-0 flex-1 p-5 disabled:opacity-70 sm:p-6">
          <AboutSectionFields
            key={selected}
            sectionKey={selected}
            profile={profile}
            content={data}
            onText={(key, value) => changeTexts({ [key]: value })}
            onTexts={changeTexts}
            onProfile={changeProfile}
            onCollection={changeCollection}
            onReading={(reading) => setReadingImages((count) => Math.max(0, count + (reading ? 1 : -1)))}
            onError={setError}
          />
        </fieldset>
        <footer className="px-5 pb-5 sm:px-6 sm:pb-6">
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            >
              {error}
            </p>
          )}
          {saved && (
            <p
              role="status"
              className="mb-4 flex items-start gap-2 text-xs leading-relaxed text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 className="size-4 shrink-0" />
              Perubahan Tentang Kami berhasil disimpan.
            </p>
          )}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={cancel}
              disabled={editingDisabled || !dirty}
              className={`${aboutSecondaryButton} sm:min-w-24`}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={editingDisabled || !dirty}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#D63F00] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#C43B00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving || readingImages > 0 ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {saving ? "Menyimpan..." : readingImages > 0 ? "Membaca logo..." : "Simpan Perubahan"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
