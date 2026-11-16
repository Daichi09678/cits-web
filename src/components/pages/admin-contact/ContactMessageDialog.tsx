"use client";

import ConsultationDetailModal from "@/components/admin/ConsultationDetailModal";
import { DEAL_STAGES } from "./constants";
import type { ContactEditorState } from "./useContactEditor";

export default function ContactMessageDialog({ editor }: { editor: ContactEditorState }) {
  const {
    selectedMessage,
    canEdit,
    canDelete,
    setSelectedMessage,
    handleUpdateStage,
    actions,
    handleSaveDealNotes,
    openReplyModal,
    setDeletingMessage,
  } = editor;
  return (
    <>
      {selectedMessage && (
        <ConsultationDetailModal
          key={selectedMessage.id}
          message={selectedMessage}
          stages={DEAL_STAGES}
          canEdit={canEdit}
          canDelete={canDelete}
          onClose={() => setSelectedMessage(null)}
          onStageChange={(stage) => handleUpdateStage(selectedMessage.id, stage)}
          onReadStatusChange={(status) => {
            if (!canEdit) return;
            actions.updateMessageStatus(selectedMessage.id, status);
            setSelectedMessage((current) => (current ? { ...current, status } : current));
          }}
          onSaveNotes={handleSaveDealNotes}
          onReply={() => openReplyModal(selectedMessage)}
          onDelete={() => setDeletingMessage(selectedMessage)}
        />
      )}
    </>
  );
}
