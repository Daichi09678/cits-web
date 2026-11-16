"use client";

import ContactInboxRow from "@/components/admin/ContactInboxRow";
import { Mail, Trash2, X } from "lucide-react";
import Pagination from "@/components/admin/Pagination";
import { DEAL_STAGES } from "./constants";
import type { ContactEditorState } from "./useContactEditor";

export default function ContactInboxPanel({ editor }: { editor: ContactEditorState }) {
  const {
    activeTab,
    filterStage,
    setFilterStage,
    setMessagePage,
    messages,
    selectedIds,
    filteredMessages,
    handleToggleSelectAll,
    filterStatus,
    setFilterStatus,
    canEdit,
    handleBulkMarkAsRead,
    canDelete,
    setBulkDeletingOpen,
    paginatedMessages,
    handleToggleSelectOne,
    handleOpenDetail,
    openReplyModal,
    setDeletingMessage,
    handleUpdateStage,
    messagePage,
    messagePageSize,
  } = editor;
  return (
    <>
      {activeTab === "inbox" && (
        <div className="min-w-0 space-y-4">
          <nav
            aria-label="Tahapan konsultasi"
            className="flex min-w-0 overflow-x-auto border-b border-gray-200 dark:border-white/10"
          >
            <button
              type="button"
              aria-current={filterStage === "All" ? "page" : undefined}
              onClick={() => {
                setFilterStage("All");
                setMessagePage(1);
              }}
              className={`flex h-[52px] shrink-0 items-center justify-center gap-2 border-b-2 px-6 text-[13px] font-medium ${filterStage === "All" ? "border-[#F45100] text-gray-900 dark:text-white" : "border-transparent text-slate-600 hover:text-gray-900 dark:text-slate-400"}`}
            >
              Semua ({messages.length})
            </button>
            {DEAL_STAGES.map((stage) => (
              <button
                key={stage.key}
                type="button"
                aria-current={filterStage === stage.key ? "page" : undefined}
                onClick={() => {
                  setFilterStage(stage.key);
                  setMessagePage(1);
                }}
                className={`flex h-[52px] flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap border-b-2 px-6 text-[13px] font-medium ${filterStage === stage.key ? "border-[#F45100] text-gray-900 dark:text-white" : "border-transparent text-slate-600 hover:text-gray-900 dark:text-slate-400"}`}
              >
                {stage.label}
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-gray-100 px-1.5 text-[11px] leading-4 text-slate-600 dark:bg-white/10 dark:text-slate-400">
                  {messages.filter((message) => (message.dealStage || "baru") === stage.key).length}
                </span>
              </button>
            ))}
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-100/70 px-4 py-2 dark:bg-white/5">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-4 text-[13px] text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filteredMessages.length}
                  ref={(element) => {
                    if (element)
                      element.indeterminate = selectedIds.length > 0 && selectedIds.length !== filteredMessages.length;
                  }}
                  onChange={handleToggleSelectAll}
                  className="h-4 w-4 accent-[#F45100]"
                />
                Pilih semua ({filteredMessages.length})
              </label>
              {selectedIds.length > 0 && <span className="text-xs text-slate-500">{selectedIds.length} dipilih</span>}
              {filterStatus !== "All" && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterStatus("All");
                    setMessagePage(1);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300"
                >
                  {filterStatus === "unread" ? "Belum Dibaca" : filterStatus === "read" ? "Sudah Dibaca" : "Dibalas"}
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="ml-auto flex items-center gap-3">
              {canEdit && (
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={handleBulkMarkAsRead}
                  className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-transparent dark:text-slate-300"
                >
                  Tandai Dibaca
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={() => setBulkDeletingOpen(true)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:bg-transparent dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-white/10 dark:bg-[#151528]">
                <Mail className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                <p className="text-sm text-slate-500">Tidak ada pesan konsultasi yang sesuai dengan filter.</p>
              </div>
            ) : (
              paginatedMessages.map((message) => (
                <ContactInboxRow
                  key={message.id}
                  message={message}
                  stages={DEAL_STAGES}
                  selected={selectedIds.includes(message.id)}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onSelect={() => handleToggleSelectOne(message.id)}
                  onOpen={() => handleOpenDetail(message)}
                  onReply={() => openReplyModal(message)}
                  onDelete={() => setDeletingMessage(message)}
                  onStageChange={(stage) => handleUpdateStage(message.id, stage)}
                />
              ))
            )}
          </div>
          <Pagination
            page={messagePage}
            pageSize={messagePageSize}
            total={filteredMessages.length}
            onPageChange={setMessagePage}
          />
        </div>
      )}
    </>
  );
}
