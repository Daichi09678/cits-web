"use client";
import Button from "@/components/ui/Button";

import AdminDialogSurface from "@/components/pages/admin/AdminDialogSurface";
import { Trash2, AlertTriangle } from "lucide-react";
import type { ContactEditorState } from "./useContactEditor";

export default function ContactBulkDeleteDialog({ editor }: { editor: ContactEditorState }) {
  const { bulkDeletingOpen, setBulkDeletingOpen, isBulkDeleting, selectedIds, messages, handleConfirmBulkDelete } =
    editor;
  return (
    <>
      {bulkDeletingOpen && (
        <AdminDialogSurface
          labelledBy="bulk-delete-title"
          onClose={() => setBulkDeletingOpen(false)}
          busy={isBulkDeleting}
          widthClassName="w-[min(448px,calc(100vw-32px))]"
        >
          <div className="min-h-0 overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="bulk-delete-title" className="text-base font-bold text-slate-900 dark:text-white">
                    Hapus {selectedIds.length} Pesan Sekaligus?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Pesan-pesan terpilih akan dihapus secara permanen dari basis data dan tidak dapat dikembalikan.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs space-y-2 max-h-48 overflow-y-auto">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Daftar Pengirim ({selectedIds.length}):
                </span>
                {selectedIds.map((id) => {
                  const msg = messages.find((m) => m.id === id);
                  if (!msg) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 dark:border-white/5 last:border-none"
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                        {msg.company || msg.email}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/80 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                disabled={isBulkDeleting}
                onClick={() => setBulkDeletingOpen(false)}
                variant="secondary"
                size="md"
              >
                Batal
              </Button>
              <button
                type="button"
                disabled={isBulkDeleting}
                onClick={handleConfirmBulkDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isBulkDeleting ? "Menghapus..." : `Hapus ${selectedIds.length} Pesan`}</span>
              </button>
            </div>
          </div>
        </AdminDialogSurface>
      )}
    </>
  );
}
