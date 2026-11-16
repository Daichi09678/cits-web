"use client";

import { SectionVisibility } from "@/types/schema";
import { initialLandingPageData, defaultSectionVisibility } from "@/data/initialData";
import { resolveFocusItems } from "@/lib/focusContent";
import type { LandingEditorContext } from "./useLandingEditorState";

export default function createLandingContentActions(state: LandingEditorContext) {
  const { formData, setFormData, setIsSaving, actions, setSavedSuccess, dialog, setSaveError, contentBusy } = state;
  const toggleSection = (section: keyof SectionVisibility) => {
    const currentVis = formData.sectionVisibility || defaultSectionVisibility;
    setFormData({
      ...formData,
      sectionVisibility: {
        ...currentVis,
        [section]: !currentVis[section],
      },
    });
  };

  const handleTypewriterChange = (index: number, val: string) => {
    setFormData((prev) => {
      const words = [...prev.hero.typewriterWords];
      words[index] = val;
      return { ...prev, hero: { ...prev.hero, typewriterWords: words } };
    });
  };

  const addTypewriterWord = () => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, typewriterWords: [...prev.hero.typewriterWords, "Solusi Unggulan Baru"] },
    }));
  };

  const removeTypewriterWord = (index: number) => {
    setFormData((prev) => {
      if (prev.hero.typewriterWords.length <= 1) return prev;
      return {
        ...prev,
        hero: { ...prev.hero, typewriterWords: prev.hero.typewriterWords.filter((_, i) => i !== index) },
      };
    });
  };

  const handleTrustBadgeChange = (index: number, val: string) => {
    setFormData((prev) => {
      const badges = [...prev.hero.trustBadges];
      badges[index] = val;
      return { ...prev, hero: { ...prev.hero, trustBadges: badges } };
    });
  };

  const addTrustBadge = () => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, trustBadges: [...prev.hero.trustBadges, "Poin Kepercayaan Baru"] },
    }));
  };

  const removeTrustBadge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, trustBadges: prev.hero.trustBadges.filter((_, i) => i !== index) },
    }));
  };

  const handleCard4FocusChange = (idx: number, field: "letter" | "word" | "desc" | "detail", val: string) => {
    const current = resolveFocusItems(formData.servicesIntro.cardFocus?.focusItems);
    const updated = [...current];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData({
      ...formData,
      servicesIntro: {
        ...formData.servicesIntro,
        cardFocus: {
          ...formData.servicesIntro.cardFocus,
          focusItems: updated,
        },
      },
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (contentBusy.current) return;
    contentBusy.current = true;
    setIsSaving(true);
    setSaveError("");
    setSavedSuccess(false);
    try {
      await actions.saveLandingData(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
      void dialog.alert({
        title: "Beranda berhasil disimpan",
        description: "Seluruh perubahan konten landing page sudah disinkronkan ke front office.",
        variant: "success",
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Konten Beranda gagal disimpan. Silakan coba lagi.");
    } finally {
      contentBusy.current = false;
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (contentBusy.current) return;
    contentBusy.current = true;
    setSaveError("");
    setSavedSuccess(false);
    try {
      const confirmed = await dialog.confirm({
        title: "Reset konten Beranda?",
        description:
          "Seluruh konten landing page akan dikembalikan ke pengaturan awal bawaan CITS. Perubahan yang belum disimpan akan hilang.",
        confirmLabel: "Ya, Reset Beranda",
        variant: "warning",
      });
      if (confirmed) {
        setIsSaving(true);
        await actions.saveLandingData(initialLandingPageData);
        setFormData(initialLandingPageData);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        await dialog.alert({
          title: "Beranda direset",
          description: "Konten landing page berhasil dikembalikan ke pengaturan awal.",
          variant: "success",
        });
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Konten Beranda gagal direset. Silakan coba lagi.");
    } finally {
      contentBusy.current = false;
      setIsSaving(false);
    }
  };
  return {
    toggleSection,
    handleTypewriterChange,
    addTypewriterWord,
    removeTypewriterWord,
    handleTrustBadgeChange,
    addTrustBadge,
    removeTrustBadge,
    handleCard4FocusChange,
    handleSave,
    handleReset,
  };
}
