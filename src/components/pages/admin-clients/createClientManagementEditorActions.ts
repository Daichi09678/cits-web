"use client";

import { ClientPartner } from "@/types/schema";
import type { ClientManagementEditorContext } from "./useClientManagementEditorState";

export default function createClientManagementEditorActions(state: ClientManagementEditorContext) {
  const {
    setMutationError,
    setReadingLogo,
    setFormLogo,
    setEditingClient,
    setFormName,
    setFormCategory,
    setFormIsActive,
    setFormShowOnHome,
    setModalOpen,
    saving,
    readingLogo,
    setSaving,
    editingClient,
    actions,
    formName,
    formLogo,
    formCategory,
    formIsActive,
    formShowOnHome,
    setSavedSuccess,
    dialog,
  } = state;
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 3 * 1024 * 1024) {
      setMutationError("Gunakan logo PNG, JPG, atau WebP maksimal 3 MB.");
      return;
    }
    setReadingLogo(true);
    setMutationError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormLogo(event.target.result as string);
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
    setEditingClient(null);
    setFormName("");
    setFormLogo("/clients/kemendagri.svg");
    setFormCategory("Kementerian");
    setFormIsActive(true);
    setFormShowOnHome(true);
    setModalOpen(true);
  };

  const openEditModal = (client: ClientPartner) => {
    setMutationError("");
    setEditingClient(client);
    setFormName(client.name);
    setFormLogo(client.logo);
    setFormCategory(client.category);
    setFormIsActive(client.isActive);
    setFormShowOnHome(client.showOnHome !== false);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || readingLogo) return;
    setSaving(true);
    setMutationError("");
    try {
      if (editingClient) {
        await actions.updateClient(editingClient.id, {
          name: formName,
          logo: formLogo,
          category: formCategory,
          isActive: formIsActive,
          showOnHome: formShowOnHome,
        });
      } else {
        await actions.addClient({
          name: formName,
          logo: formLogo,
          category: formCategory,
          isActive: formIsActive,
          showOnHome: formShowOnHome,
        });
      }

      setSavedSuccess(true);
      setModalOpen(false);
      setTimeout(() => setSavedSuccess(false), 3000);
      void dialog.alert({
        title: editingClient ? "Mitra diperbarui" : "Mitra ditambahkan",
        description: editingClient
          ? `Perubahan mitra "${formName}" berhasil disimpan.`
          : `Mitra "${formName}" berhasil ditambahkan.`,
        variant: "success",
      });
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Perubahan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  };
  return { handleLogoUpload, openAddModal, openEditModal, handleSave };
}
