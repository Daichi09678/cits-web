"use client";
import { BackOfficeInput as Input, BackOfficeTextarea as Textarea } from "@/components/ui/Input";
import { BackOfficeButton as Button } from "@/components/ui/Button";
import FieldLabel from "@/components/ui/FieldLabel";

import AdminDialogSurface from "@/components/pages/admin/AdminDialogSurface";
import { X } from "lucide-react";
import type { ContactEditorState } from "./useContactEditor";

export default function ContactFaqDialog({ editor }: { editor: ContactEditorState }) {
  const {
    faqModalOpen,
    setFaqModalOpen,
    editingFaq,
    handleSaveFaqItem,
    faqQuestion,
    setFaqQuestion,
    faqAnswer,
    setFaqAnswer,
    faqIsActive,
    setFaqIsActive,
  } = editor;
  return (
    <>
      {faqModalOpen && (
        <AdminDialogSurface
          labelledBy="faq-editor-title"
          onClose={() => setFaqModalOpen(false)}
          widthClassName="w-[min(512px,calc(100vw-32px))]"
        >
          <div className="min-h-0 overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
              <h3 id="faq-editor-title" className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                {editingFaq ? "Edit Pertanyaan FAQ" : "Tambah Pertanyaan FAQ Baru"}
              </h3>
              <Button
                type="button"
                aria-label="Tutup editor pertanyaan"
                onClick={() => setFaqModalOpen(false)}
                variant="ghost"
                size="icon"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSaveFaqItem} className="p-6 space-y-4">
              <div>
                <FieldLabel htmlFor="contact-faq-dialog-faq-question" fieldSize="sm" required>
                  Pertanyaan FAQ
                </FieldLabel>
                <Input
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="Contoh: Berapa lama waktu respon untuk konsultasi?"
                  fieldSize="sm"
                  className="w-full"
                  id="contact-faq-dialog-faq-question"
                />
              </div>

              <div>
                <FieldLabel htmlFor="contact-faq-dialog-faq-answer" fieldSize="sm" required>
                  Jawaban FAQ
                </FieldLabel>
                <Textarea
                  rows={4}
                  required
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Tuliskan jawaban yang jelas dan tepat..."
                  fieldSize="sm"
                  className="w-full"
                  id="contact-faq-dialog-faq-answer"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="faq-status"
                  checked={faqIsActive}
                  onChange={(e) => setFaqIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
                />
                <label
                  htmlFor="faq-status"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Aktifkan pertanyaan ini di halaman Hubungi Kami
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2">
                <Button type="button" onClick={() => setFaqModalOpen(false)} variant="secondary" size="md">
                  Batal
                </Button>
                <Button type="submit" variant="primary" size="md">
                  {editingFaq ? "Perbarui" : "Tambahkan"}
                </Button>
              </div>
            </form>
          </div>
        </AdminDialogSurface>
      )}
    </>
  );
}
