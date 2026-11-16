"use client";

import { CaseStudyItem } from "@/types/schema";
import { SECTOR_OPTIONS } from "./constants";
import type { PortfolioEditorContext } from "./usePortfolioEditorState";

export default function createPortfolioEditorActions(state: PortfolioEditorContext) {
  const {
    dialog,
    setReadingLogo,
    setMutationError,
    setFormClientLogo,
    setEditingStudy,
    setFormTitle,
    setFormClient,
    setFormClientShort,
    setFormSector,
    setFormCategoryTag,
    setFormPeriod,
    setFormServicePillar,
    setFormIsFlagship,
    setFormTagline,
    setFormChallenge,
    setFormSolution,
    setFormKpiValue,
    setFormKpiLabel,
    setFormKpiDetail,
    setFormScopeOfWork,
    setFormTechStack,
    setFormDeliverables,
    setFormIsActive,
    setFormShowOnHome,
    setModalOpen,
    saving,
    readingLogo,
    setSaving,
    formTitle,
    formClient,
    formClientShort,
    formClientLogo,
    formSector,
    formCategoryTag,
    formPeriod,
    formServicePillar,
    formIsFlagship,
    formTagline,
    formChallenge,
    formSolution,
    formKpiValue,
    formKpiLabel,
    formKpiDetail,
    formScopeOfWork,
    formTechStack,
    formDeliverables,
    formIsActive,
    formShowOnHome,
    editingStudy,
    actions,
    setSavedSuccess,
  } = state;
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (file.size > 3 * 1024 * 1024) {
      void dialog.alert({
        title: "Ukuran file terlalu besar",
        description: "Ukuran file logo maksimal 3 MB. Silakan pilih file yang lebih kecil.",
        variant: "warning",
      });
      return;
    }

    setReadingLogo(true);
    setMutationError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormClientLogo(event.target.result as string);
      }
      setReadingLogo(false);
    };
    reader.onerror = () => {
      setReadingLogo(false);
      setMutationError("Logo gagal dibaca. Silakan pilih kembali.");
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setMutationError("");
    setEditingStudy(null);
    setFormTitle("");
    setFormClient("");
    setFormClientShort("");
    setFormClientLogo("/clients/kemendagri.svg");
    setFormSector(SECTOR_OPTIONS[0]);
    setFormCategoryTag("Digitalisasi Layanan Publik");
    setFormPeriod("2024 - Sekarang");
    setFormServicePillar("Software House & Rekayasa Arsitektur");
    setFormIsFlagship(false);
    setFormTagline("");
    setFormChallenge("");
    setFormSolution("");
    setFormKpiValue("100%");
    setFormKpiLabel("Keberhasilan Implementasi");
    setFormKpiDetail("Operasional stabil dan lulus audit SPBE.");
    setFormScopeOfWork("Analisis Kebutuhan Sistem, Rekayasa Arsitektur, Pengujian Keamanan, Pelatihan Pengguna");
    setFormTechStack("Next.js, TypeScript, PostgreSQL, REST API");
    setFormDeliverables("Aplikasi Web Enterprise, Dokumentasi SAD, Manual Book Pengguna");
    setFormIsActive(true);
    setFormShowOnHome(true);
    setModalOpen(true);
  };

  const openEditModal = (study: CaseStudyItem) => {
    setMutationError("");
    setEditingStudy(study);
    setFormTitle(study.title);
    setFormClient(study.client);
    setFormClientShort(study.clientShort);
    setFormClientLogo(study.clientLogo);
    setFormSector(study.sector);
    setFormCategoryTag(study.categoryTag);
    setFormPeriod(study.period);
    setFormServicePillar(study.servicePillar);
    setFormIsFlagship(!!study.isFlagship);
    setFormTagline(study.tagline);
    setFormChallenge(study.challenge);
    setFormSolution(study.solution);
    setFormKpiValue(study.measurableImpact?.highlightValue || "");
    setFormKpiLabel(study.measurableImpact?.highlightLabel || "");
    setFormKpiDetail(study.measurableImpact?.detail || "");
    setFormScopeOfWork(study.scopeOfWork ? study.scopeOfWork.join(", ") : "");
    setFormTechStack(study.techStack ? study.techStack.join(", ") : "");
    setFormDeliverables(study.deliverables ? study.deliverables.join(", ") : "");
    setFormIsActive(study.isActive !== false);
    setFormShowOnHome(study.showOnHome !== false);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || readingLogo) return;
    setSaving(true);
    setMutationError("");
    try {
      const parseList = (str: string) =>
        str
          .split(/,|\n/)
          .map((s) => s.trim())
          .filter(Boolean);

      const studyPayload: Omit<CaseStudyItem, "id"> = {
        title: formTitle,
        client: formClient,
        clientShort: formClientShort || formClient,
        clientLogo: formClientLogo,
        sector: formSector,
        categoryTag: formCategoryTag || formSector,
        period: formPeriod,
        servicePillar: formServicePillar,
        isFlagship: formIsFlagship,
        tagline: formTagline,
        challenge: formChallenge,
        solution: formSolution,
        measurableImpact: {
          highlightValue: formKpiValue,
          highlightLabel: formKpiLabel,
          detail: formKpiDetail,
        },
        scopeOfWork: parseList(formScopeOfWork),
        techStack: parseList(formTechStack),
        deliverables: parseList(formDeliverables),
        isActive: formIsActive,
        showOnHome: formShowOnHome,
      };

      if (editingStudy) {
        await actions.updateCaseStudy(editingStudy.id, studyPayload);
      } else {
        await actions.addCaseStudy(studyPayload);
      }

      setSavedSuccess(true);
      setModalOpen(false);
      setTimeout(() => setSavedSuccess(false), 3000);
      void dialog.alert({
        title: editingStudy ? "Studi kasus diperbarui" : "Studi kasus ditambahkan",
        description: editingStudy
          ? `Perubahan studi kasus "${formTitle}" berhasil disimpan.`
          : `Studi kasus "${formTitle}" berhasil ditambahkan ke portofolio.`,
        variant: "success",
      });
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Perubahan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await dialog.confirm({
      title: "Hapus studi kasus?",
      description: `Studi kasus "${title}" akan dihapus permanen dari portofolio dan tampilan front office.`,
      confirmLabel: "Hapus Studi Kasus",
      variant: "danger",
    });
    if (confirmed) {
      const removed = await actions
        .deleteCaseStudy(id)
        .then(() => true)
        .catch((error) => {
          setMutationError(error instanceof Error ? error.message : "Studi kasus gagal dihapus.");
          return false;
        });
      if (!removed) return;
      await dialog.alert({
        title: "Studi kasus dihapus",
        description: `"${title}" berhasil dihapus dari portofolio.`,
        variant: "success",
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await actions.toggleCaseStudyStatus(id);
    } catch (error) {
      void dialog.alert({
        title: "Status gagal disimpan",
        description: error instanceof Error ? error.message : "Silakan coba lagi.",
        variant: "danger",
      });
    }
  };
  return { handleLogoUpload, openAddModal, openEditModal, handleSave, handleDelete, handleToggleStatus };
}
