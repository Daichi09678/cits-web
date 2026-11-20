"use client";
import { adminAccent } from "@/components/pages/admin/accentStyles";
import { BackOfficeSelect as Select } from "@/components/ui/Select";
import FieldLabel from "@/components/ui/FieldLabel";
import FormFeedback from "@/components/ui/FormFeedback";

import { Mail, Info, MoreVertical, CheckCircle2, Volume2, HelpCircle } from "lucide-react";
import AdminTopbar from "@/components/pages/admin/AdminTopbar";
import { playNewMessageSound } from "@/lib/audio";
import type { ContactEditorState } from "./useContactEditor";
import ContactFaqDialog from "./ContactFaqDialog";
import ContactReplyDialog from "./ContactReplyDialog";
import ContactBulkDeleteDialog from "./ContactBulkDeleteDialog";
import ContactDeleteDialog from "./ContactDeleteDialog";
import ContactMessageDialog from "./ContactMessageDialog";
import ContactInboxToolbar from "./ContactInboxToolbar";
import ContactInboxPanel from "./ContactInboxPanel";
import ContactInfoPanel from "./ContactInfoPanel";
import ContactFaqPanel from "./ContactFaqPanel";

export default function ContactEditor({ editor }: { editor: ContactEditorState }) {
  const {
    replyFeedback,
    activeTab,
    setActiveTab,
    filterStatus,
    setFilterStatus,
    setMessagePage,
    retentionDays,
    isLiveConnected,
    settingsError,
  } = editor;
  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F8F9FB] dark:bg-[#0F0F1A]">
      <AdminTopbar
        title="Kotak Masuk Pesan & Konsultasi"
        description="Kelola pesan masuk dari formulir website, pantau tahapan calon klien, dan kelola FAQ"
      />
      <div className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
        {settingsError && <FormFeedback className="mb-4">{settingsError}</FormFeedback>}
        {/* Action Feedback Alert */}
        {replyFeedback && (
          <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{replyFeedback}</span>
          </div>
        )}

        {/* Main navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-6 dark:border-white/10">
          <nav aria-label="Menu kontak" className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
            {[
              { key: "inbox", label: "Inbox Konsultasi", icon: Mail },
              { key: "info", label: "Info Kontak", icon: Info },
              { key: "faqs", label: "Kelola FAQ & Layanan", icon: HelpCircle },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                aria-current={activeTab === key ? "page" : undefined}
                onClick={() => setActiveTab(key as "inbox" | "info" | "faqs")}
                className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border px-4 text-[13px] font-medium ${
                  activeTab === key
                    ? `border-[#F45100] ${adminAccent}`
                    : "border-gray-200 bg-white text-gray-900 hover:bg-slate-50 dark:border-white/10 dark:bg-[#151528] dark:text-slate-200"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </button>
            ))}
          </nav>
          <ContactInboxToolbar editor={editor} />
          <details className="group relative ml-auto">
            <summary
              aria-label="Opsi inbox"
              title="Opsi inbox"
              className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 [&::-webkit-details-marker]:hidden dark:hover:bg-white/5"
            >
              <MoreVertical className="h-4 w-4" />
            </summary>
            <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-lg border border-gray-200 bg-white p-3 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-[#151528] dark:text-slate-300">
              <FieldLabel htmlFor="inbox-read-filter" fieldSize="sm">
                Status bacaan
              </FieldLabel>
              <Select
                id="inbox-read-filter"
                value={filterStatus}
                onChange={(event) => {
                  setFilterStatus(event.target.value);
                  setMessagePage(1);
                }}
                selectSize="sm"
                className="mt-2 w-full"
              >
                <option value="All">Semua pesan</option>
                <option value="unread">Belum Dibaca</option>
                <option value="read">Sudah Dibaca</option>
                <option value="replied">Dibalas</option>
              </Select>
              <button
                type="button"
                onClick={() => playNewMessageSound()}
                className="mt-3 flex items-center gap-2 py-2 text-left hover:text-[#F45100]"
              >
                <Volume2 className="h-4 w-4" />
                Tes Nada Notifikasi
              </button>
              <p className="mt-2 border-t border-gray-100 pt-3 leading-5 dark:border-white/10">
                Auto-hapus pesan setelah {retentionDays} hari.
              </p>
              <p className="mt-1">{isLiveConnected ? "Live Realtime terhubung" : "Menunggu koneksi realtime"}</p>
            </div>
          </details>
        </div>

        {/* TAB 1: INBOX PESAN MASUK */}
        <ContactInboxPanel editor={editor} />

        {/* TAB 2: INFORMASI KONTAK RESMI FRONT OFFICE */}
        <ContactInfoPanel editor={editor} />

        {/* TAB 3: KELOLA FAQ & LAYANAN PUBLIK */}
        <ContactFaqPanel editor={editor} />

        {/* MODAL TAMBAH / EDIT FAQ */}
        <ContactFaqDialog editor={editor} />

        <ContactMessageDialog editor={editor} />

        {/* MODAL BALAS EMAIL OTOMATIS */}
        <ContactReplyDialog editor={editor} />

        {/* MODAL KONFIRMASI HAPUS MASAL */}
        <ContactBulkDeleteDialog editor={editor} />

        {/* MODAL KONFIRMASI HAPUS PESAN (SINGLE) */}
        <ContactDeleteDialog editor={editor} />
      </div>
    </div>
  );
}
