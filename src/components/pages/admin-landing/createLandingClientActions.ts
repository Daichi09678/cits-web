"use client";

import { ClientPartner } from "@/types/schema";
import type { LandingEditorContext } from "./useLandingEditorState";

export default function createLandingClientActions(state: LandingEditorContext) {
  const {
    canCreateClients,
    clientBusy,
    setClientError,
    setClientSuccessMsg,
    setEditingClient,
    setClientFormName,
    setClientFormCategory,
    setClientFormLogo,
    setClientFormIsActive,
    setClientModalOpen,
    canEditClients,
    editingClient,
    clientFormName,
    setClientMutation,
    clientFormCategory,
    clientFormLogo,
    clientFormIsActive,
    actions,
    canDeleteClients,
    dialog,
  } = state;
  const openAddClientModal = () => {
    if (!canCreateClients || clientBusy.current) return;
    setClientError("");
    setClientSuccessMsg("");
    setEditingClient(null);
    setClientFormName("");
    setClientFormCategory("Kementerian");
    setClientFormLogo("/clients/kemenhub.webp");
    setClientFormIsActive(true);
    setClientModalOpen(true);
  };

  const openEditClientModal = (c: ClientPartner) => {
    if (!canEditClients || clientBusy.current) return;
    setClientError("");
    setClientSuccessMsg("");
    setEditingClient(c);
    setClientFormName(c.name);
    setClientFormCategory(c.category);
    setClientFormLogo(c.logo);
    setClientFormIsActive(c.isActive);
    setClientModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (clientBusy.current) return;
    if (editingClient ? !canEditClients : !canCreateClients) {
      setClientError("Anda tidak memiliki izin untuk menyimpan mitra.");
      return;
    }
    if (!clientFormName.trim()) return;
    clientBusy.current = true;
    setClientMutation("save");
    setClientError("");
    setClientSuccessMsg("");
    try {
      const data = {
        name: clientFormName.trim(),
        category: clientFormCategory,
        logo: clientFormLogo.trim(),
        isActive: clientFormIsActive,
      };
      if (editingClient) await actions.updateClient(editingClient.id, data);
      else await actions.addClient(data);
      setClientSuccessMsg(`Mitra "${data.name}" berhasil ${editingClient ? "diperbarui" : "ditambahkan"}.`);
      setClientModalOpen(false);
    } catch (error) {
      setClientError(error instanceof Error ? error.message : "Mitra gagal disimpan. Silakan coba lagi.");
    } finally {
      clientBusy.current = false;
      setClientMutation(null);
    }
  };

  const handleDeleteClient = async (c: ClientPartner) => {
    if (!canDeleteClients || clientBusy.current) return;
    clientBusy.current = true;
    setClientError("");
    setClientSuccessMsg("");
    try {
      const confirmed = await dialog.confirm({
        title: "Hapus mitra?",
        description: `Mitra "${c.name}" akan dihapus dari katalog mitra dan seluruh halaman yang menampilkannya.`,
        confirmLabel: "Hapus Mitra",
        variant: "danger",
      });
      if (!confirmed) return;
      setClientMutation(c.id);
      await actions.deleteClient(c.id);
      setClientSuccessMsg(`Mitra "${c.name}" berhasil dihapus.`);
    } catch (error) {
      setClientError(error instanceof Error ? error.message : "Mitra gagal dihapus. Silakan coba lagi.");
    } finally {
      clientBusy.current = false;
      setClientMutation(null);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setClientFormLogo(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  return { openAddClientModal, openEditClientModal, handleSaveClient, handleDeleteClient, handleLogoUpload };
}
