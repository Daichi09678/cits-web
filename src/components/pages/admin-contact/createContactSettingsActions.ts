"use client";

import type { ContactFaqItem, ContactInfo } from "@/types/schema";
import type { ContactEditorContext } from "./useContactEditorState";

export default function createContactSettingsActions(state: ContactEditorContext) {
  const {
    canEdit,
    canCreate,
    canDelete,
    dialog,
    actions,
    contactInfo,
    clearInfoDraft,
    clearFaqDraft,
    address,
    phone,
    email,
    workingHours,
    emergencyPhone,
    setSavedSuccess,
    faqsList,
    servicesList,
    announcementActive,
    announcementText,
    announcementLinkText,
    announcementLinkUrl,
    setFaqSuccessMsg,
    setEditingFaq,
    setFaqQuestion,
    setFaqAnswer,
    setFaqIsActive,
    setFaqModalOpen,
    faqQuestion,
    faqAnswer,
    editingFaq,
    faqIsActive,
    setFaqsList,
    newServiceText,
    setServicesList,
    setNewServiceText,
    settingsPending,
    setSettingsSaving,
    setSettingsError,
  } = state;
  const persistSettings = async (data: ContactInfo, faq = false) => {
    if (!canEdit && (!faq || (!canCreate && !canDelete))) {
      setSettingsError("Anda tidak memiliki izin untuk menyimpan pengaturan kontak.");
      return;
    }
    if (settingsPending.current) return;
    settingsPending.current = true;
    setSettingsSaving(true);
    setSettingsError("");
    setSavedSuccess(false);
    setFaqSuccessMsg("");
    try {
      await actions.saveContactInfo(data);
      if (faq) {
        clearFaqDraft();
        setFaqSuccessMsg("Pengaturan FAQ dan layanan berhasil disimpan.");
      } else {
        clearInfoDraft();
        setSavedSuccess(true);
      }
    } catch (error) {
      setSettingsError(error instanceof Error ? error.message : "Pengaturan kontak gagal disimpan. Silakan coba lagi.");
    } finally {
      settingsPending.current = false;
      setSettingsSaving(false);
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistSettings({
      ...contactInfo,
      address,
      phone,
      email,
      workingHours,
      emergencyPhone,
    });
  };

  const handleSaveFaqSettings = async () => {
    await persistSettings(
      {
        ...contactInfo,
        faqs: faqsList,
        customServices: servicesList,
        ...(canEdit && {
          announcement: {
            ...contactInfo.announcement,
            isActive: announcementActive,
            text: announcementText,
            linkText: announcementLinkText,
            linkUrl: announcementLinkUrl,
          },
        }),
      },
      true
    );
  };

  const openAddFaqModal = () => {
    if (!canCreate) return;
    setEditingFaq(null);
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqIsActive(true);
    setFaqModalOpen(true);
  };

  const openEditFaqModal = (faq: ContactFaqItem) => {
    if (!canEdit) return;
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqIsActive(faq.isActive);
    setFaqModalOpen(true);
  };

  const handleSaveFaqItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq ? !canEdit : !canCreate) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    if (editingFaq) {
      const updated = faqsList.map((f) =>
        f.id === editingFaq.id ? { ...f, question: faqQuestion, answer: faqAnswer, isActive: faqIsActive } : f
      );
      setFaqsList(updated);
    } else {
      const newFaq: ContactFaqItem = {
        id: "faq-" + Date.now(),
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        isActive: faqIsActive,
      };
      setFaqsList([...faqsList, newFaq]);
    }
    setFaqModalOpen(false);
    void dialog.alert({
      title: editingFaq ? "Draf FAQ diperbarui" : "Draf FAQ ditambahkan",
      description: "Pilih Simpan Pengaturan untuk menerapkan perubahan ke halaman publik.",
      variant: "info",
    });
  };

  const handleDeleteFaqItem = (id: string) => {
    if (!canDelete) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    setFaqsList(faqsList.filter((f) => f.id !== id));
  };

  const handleToggleFaqActive = (id: string) => {
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    setFaqsList(faqsList.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)));
  };

  const handleAddServiceOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    if (!newServiceText.trim()) return;
    if (servicesList.includes(newServiceText.trim())) return;
    setServicesList([...servicesList, newServiceText.trim()]);
    setNewServiceText("");
  };

  const handleDeleteServiceOption = (index: number) => {
    if (!canDelete) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    setServicesList(servicesList.filter((_, i) => i !== index));
  };
  return {
    handleSaveInfo,
    handleSaveFaqSettings,
    openAddFaqModal,
    openEditFaqModal,
    handleSaveFaqItem,
    handleDeleteFaqItem,
    handleToggleFaqActive,
    handleAddServiceOption,
    handleDeleteServiceOption,
  };
}
