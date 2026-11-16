"use client";

import { ContactMessage, DealStage } from "@/types/schema";
import { DEAL_STAGES } from "./constants";
import type { ContactEditorContext } from "./useContactEditorState";

export default function createContactMessageActions(state: ContactEditorContext) {
  const {
    selectedIds,
    filteredMessages,
    setSelectedIds,
    canDelete,
    dialog,
    setIsBulkDeleting,
    actions,
    selectedMessage,
    setSelectedMessage,
    setReplyFeedback,
    setBulkDeletingOpen,
    canEdit,
    deletingMessage,
    setIsDeleting,
    setDeletingMessage,
  } = state;
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length && filteredMessages.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map((m) => m.id));
    }
  };

  const handleToggleSelectOne = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleConfirmBulkDelete = async () => {
    if (!canDelete) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      await actions.deleteMessages(selectedIds);
      if (selectedMessage && selectedIds.includes(selectedMessage.id)) {
        setSelectedMessage(null);
      }
      setReplyFeedback(`${selectedIds.length} pesan konsultasi terpilih berhasil dihapus.`);
      setSelectedIds([]);
      setBulkDeletingOpen(false);
    } catch (err) {
      console.error("Gagal menghapus pesan masal:", err);
    } finally {
      setIsBulkDeleting(false);
      setTimeout(() => setReplyFeedback(""), 3500);
    }
  };

  const handleBulkMarkAsRead = () => {
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      actions.updateMessageStatus(id, "read");
    }
    setReplyFeedback(`${selectedIds.length} pesan ditandai sebagai sudah dibaca.`);
    setSelectedIds([]);
    setTimeout(() => setReplyFeedback(""), 3500);
  };

  const handleConfirmDelete = async () => {
    if (!canDelete) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    if (!deletingMessage) return;
    setIsDeleting(true);
    try {
      await actions.deleteMessage(deletingMessage.id);
      setSelectedIds((prev) => prev.filter((id) => id !== deletingMessage.id));
      if (selectedMessage && selectedMessage.id === deletingMessage.id) {
        setSelectedMessage(null);
      }
      setReplyFeedback(`Pesan dari "${deletingMessage.name}" berhasil dihapus.`);
      setDeletingMessage(null);
    } catch (err) {
      console.error("Gagal menghapus pesan:", err);
    } finally {
      setIsDeleting(false);
      setTimeout(() => setReplyFeedback(""), 3500);
    }
  };

  const handleUpdateStage = (msgId: string, stage: DealStage) => {
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    actions.updateMessageStage(msgId, stage);
    if (selectedMessage && selectedMessage.id === msgId) {
      setSelectedMessage({ ...selectedMessage, dealStage: stage });
    }
    const stageInfo = DEAL_STAGES.find((s) => s.key === stage);
    setReplyFeedback(`Tahapan diperbarui ke "${stageInfo?.label || stage}".`);
    setTimeout(() => setReplyFeedback(""), 3000);
  };

  const handleSaveDealNotes = async (notes: string) => {
    if (!canEdit) throw new Error("Anda tidak memiliki izin untuk menyimpan catatan.");
    if (!selectedMessage) throw new Error("Pesan tidak tersedia.");
    const message = selectedMessage;
    await actions.saveMessageNotes(message.id, message.dealStage || "baru", notes);
    setSelectedMessage((current) => (current?.id === message.id ? { ...current, dealNotes: notes } : current));
  };

  const handleOpenDetail = (msg: ContactMessage) => {
    const readMsg: ContactMessage = canEdit && msg.status === "unread" ? { ...msg, status: "read" } : msg;
    setSelectedMessage(readMsg);

    if (canEdit && msg.status === "unread") {
      actions.updateMessageStatus(msg.id, "read");
    }
  };
  return {
    handleToggleSelectAll,
    handleToggleSelectOne,
    handleConfirmBulkDelete,
    handleBulkMarkAsRead,
    handleConfirmDelete,
    handleUpdateStage,
    handleSaveDealNotes,
    handleOpenDetail,
  };
}
