"use client";
import { adminAccent } from "@/components/pages/admin/accentStyles";
import { BackOfficeInput as Input, BackOfficeTextarea as Textarea } from "@/components/ui/Input";
import { BackOfficeButton as Button } from "@/components/ui/Button";
import FieldLabel from "@/components/ui/FieldLabel";

import AdminDialogSurface from "@/components/pages/admin/AdminDialogSurface";
import {
  Mail,
  Send,
  ExternalLink,
  CheckCheck,
  X,
  Sparkles,
  Calendar,
  Copy,
  Reply,
  Check,
  FileText,
} from "lucide-react";
import type { ContactEditorState } from "./useContactEditor";

export default function ContactReplyDialog({ editor }: { editor: ContactEditorState }) {
  const {
    replyModalOpen,
    replyingMessage,
    setReplyModalOpen,
    replyTo,
    setReplyTo,
    replySubject,
    setReplySubject,
    applyTemplate,
    activeTemplate,
    handleCopyReplyDraft,
    copiedText,
    replyBody,
    setReplyBody,
    canEdit,
    handleMarkAsRepliedOnly,
    handleLaunchEmail,
  } = editor;
  return (
    <>
      {replyModalOpen && replyingMessage && (
        <AdminDialogSurface
          labelledBy="reply-dialog-title"
          onClose={() => setReplyModalOpen(false)}
          widthClassName="w-[min(672px,calc(100vw-48px))]"
        >
          <div className="w-full max-w-2xl bg-white dark:bg-[#16162D] min-h-0 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${adminAccent} flex items-center justify-center shadow-md shadow-orange-600/20 shrink-0`}>
                  <Reply className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="reply-dialog-title"
                    className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white"
                  >
                    Kirim Balasan Email
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Untuk <strong className="text-slate-700 dark:text-slate-200">{replyingMessage.name}</strong> (
                    {replyingMessage.company || "Umum"})
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setReplyModalOpen(false)}
                aria-label="Tutup balasan email"
                variant="ghost"
                size="icon"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="contact-reply-dialog-reply-to" fieldSize="sm">
                    Kirim Ke
                  </FieldLabel>
                  <Input
                    type="email"
                    value={replyTo}
                    onChange={(e) => setReplyTo(e.target.value)}
                    fieldSize="sm"
                    className="w-full"
                    id="contact-reply-dialog-reply-to"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="contact-reply-dialog-reply-subject" fieldSize="sm">
                    Subjek Email
                  </FieldLabel>
                  <Input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    fieldSize="sm"
                    className="w-full"
                    id="contact-reply-dialog-reply-subject"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Pilihan Draf Templat
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      id: "diskusi",
                      title: "Undangan Diskusi",
                      icon: Calendar,
                      desc: "Ajak pertemuan daring via GMeet/Zoom",
                    },
                    {
                      id: "penawaran",
                      title: "Penawaran Portofolio",
                      icon: FileText,
                      desc: "Kirim proposal & estimasi tahapan",
                    },
                    {
                      id: "spesifikasi",
                      title: "Klarifikasi KAK",
                      icon: Sparkles,
                      desc: "Minta rincian spesifikasi teknis",
                    },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => applyTemplate(t.id as Parameters<typeof applyTemplate>[0])}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        activeTemplate === t.id
                          ? "bg-orange-50 dark:bg-orange-950/40 border-orange-500 shadow-xs ring-1 ring-orange-500/20"
                          : "bg-slate-50/70 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-orange-400"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <t.icon
                          className={`w-3.5 h-3.5 ${activeTemplate === t.id ? "text-orange-600" : "text-slate-400"}`}
                        />
                        <span
                          className={`text-[11px] font-bold ${activeTemplate === t.id ? "text-orange-700 dark:text-orange-300" : "text-slate-700 dark:text-slate-300"}`}
                        >
                          {t.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Isi Pesan Balasan Email
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyReplyDraft}
                    className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Draf Berhasil Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Draf</span>
                      </>
                    )}
                  </button>
                </div>
                <Textarea
                  rows={11}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  fieldSize="sm"
                  className="w-full"
                />
              </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={!canEdit}
                onClick={handleMarkAsRepliedOnly}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>Tandai Sebagai Dibalas</span>
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleLaunchEmail("default")}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#1A1A2E] text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Bawaan</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchEmail("outlook")}
                  className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Outlook Web</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchEmail("gmail")}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim via Gmail</span>
                </button>
              </div>
            </div>
          </div>
        </AdminDialogSurface>
      )}
    </>
  );
}
