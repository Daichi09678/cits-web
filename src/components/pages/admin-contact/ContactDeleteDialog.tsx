"use client";
import { BackOfficeButton as Button } from "@/components/ui/Button";

import AdminDialogSurface from "@/components/pages/admin/AdminDialogSurface";
import { Trash2, AlertTriangle } from "lucide-react";
import type { ContactEditorState } from "./useContactEditor";

export default function ContactDeleteDialog({ editor }: { editor: ContactEditorState }) {
  const { deletingMessage, isDeleting, setDeletingMessage, handleConfirmDelete } = editor;
  return (
    <>
      {deletingMessage && (
        <AdminDialogSurface
          labelledBy="delete-message-title"
          busy={isDeleting}
          onClose={() => {
            if (!isDeleting) setDeletingMessage(null);
          }}
          widthClassName="w-[min(448px,calc(100vw-48px))]"
        >
          <div className="w-full max-w-md bg-white dark:bg-[#16162a] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="delete-message-title" className="text-base font-bold text-slate-900 dark:text-white">
                    Hapus Pesan Konsultasi?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Pesan ini akan dihapus secara permanen dari basis data dan tidak dapat dikembalikan.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Pengirim:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                    {deletingMessage.name}
                  </span>
                </div>

                {deletingMessage.company && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Instansi:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                      {deletingMessage.company}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Email:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300 truncate max-w-[220px]">
                    {deletingMessage.email}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-white/5">
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 italic bg-white dark:bg-black/20 p-2.5 rounded-lg border border-slate-200/50 dark:border-white/5">
                    &quot;{deletingMessage.message}&quot;
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/80 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingMessage(null)}
                variant="secondary"
                size="md"
              >
                Batal
              </Button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? "Menghapus..." : "Hapus Pesan"}</span>
              </button>
            </div>
          </div>
        </AdminDialogSurface>
      )}
    </>
  );
}
