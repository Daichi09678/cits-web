"use client";

import { useEffect, useId, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Clock,
  History,
  Layers,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Reply,
  Trash2,
  X,
} from "lucide-react";
import AdminDialogSurface from "./AdminDialogSurface";
import MessageConsultationDetails from "./MessageConsultationDetails";
import { formatMessageDate, formatMessageRelative, formatMessageTime } from "@/lib/date";
import type { ContactMessage, DealStage } from "@/types/schema";

interface ConsultationDetailModalProps {
  message: ContactMessage;
  stages: {
    key: DealStage;
    label: string;
    badgeBg?: string;
    badgeText?: string;
    badgeBorder?: string;
    dotBg?: string;
  }[];
  canEdit: boolean;
  canDelete: boolean;
  onClose: () => void;
  onStageChange: (stage: DealStage) => void;
  onReadStatusChange: (status: ContactMessage["status"]) => void;
  onSaveNotes: (notes: string) => Promise<void>;
  onReply: () => void;
  onDelete: () => void;
}

export default function ConsultationDetailModal({
  message,
  stages,
  canEdit,
  canDelete,
  onClose,
  onStageChange,
  onReadStatusChange,
  onSaveNotes,
  onReply,
  onDelete,
}: ConsultationDetailModalProps) {
  const titleId = useId();
  const stageId = useId();
  const readStatusId = useId();
  const notesId = useId();
  const [notes, setNotes] = useState(message.dealNotes || "");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ error: boolean; text: string } | null>(null);
  const [clock, setClock] = useState(() => Date.now());
  const stage = message.dealStage || "baru";
  const currentStage = stages.find((item) => item.key === stage);
  const progressStages = stages.filter((item) => item.key !== "batal");
  const currentIndex = progressStages.findIndex((item) => item.key === stage);
  const cleanPhone = message.phone.replace(/[^0-9]/g, "").replace(/^0/, "62");

  useEffect(() => {
    const interval = window.setInterval(() => setClock(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, []);

  const saveNotes = async () => {
    if (saving || !canEdit) return;
    setSaving(true);
    setFeedback(null);
    try {
      await onSaveNotes(notes);
      setFeedback({ error: false, text: "Catatan berhasil disimpan." });
    } catch (error) {
      setFeedback({
        error: true,
        text: error instanceof Error ? error.message : "Catatan gagal disimpan. Silakan coba lagi.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminDialogSurface labelledBy={titleId} onClose={onClose}>
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-white/10">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F45100] text-sm font-semibold text-white"
          >
            {message.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <h2 id={titleId} className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
              {message.name}
            </h2>
            {message.company && (
              <p className="mt-0.5 text-[13px] text-[#F45100] dark:text-orange-400">{message.company}</p>
            )}
          </div>
        </div>
        <div className="relative order-3 w-full sm:order-none sm:w-auto">
          <label htmlFor={stageId} className="sr-only">
            Tahapan konsultasi
          </label>
          <select
            id={stageId}
            value={stage}
            disabled={!canEdit || saving}
            onChange={(event) => onStageChange(event.target.value as DealStage)}
            className={`h-9 w-full appearance-none rounded-lg border pl-7 pr-9 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:cursor-not-allowed sm:min-w-36 ${currentStage?.badgeBg || "bg-slate-50 dark:bg-white/5"} ${currentStage?.badgeText || "text-slate-700 dark:text-slate-200"} ${currentStage?.badgeBorder || "border-gray-200 dark:border-white/10"}`}
          >
            {stages.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${currentStage?.dotBg || "bg-slate-400"}`}
          />
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          />
        </div>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Tutup detail konsultasi"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#F45100] dark:hover:bg-white/5"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:space-y-6 sm:p-6 [overflow-wrap:anywhere]">
        <section
          aria-label="Informasi kontak dan pengiriman"
          className="grid gap-5 border-b border-gray-200 pb-5 sm:grid-cols-2 sm:gap-6 dark:border-white/10"
        >
          <div>
            <h3 className="mb-3 text-[15px] font-semibold">Informasi Kontak</h3>
            <dl className="space-y-2 text-[13px]">
              <div className="flex items-start gap-3">
                <dt className="shrink-0 text-slate-500">
                  <span className="sr-only">Email</span>
                  <Mail className="h-[18px] w-[18px]" />
                </dt>
                <dd className="min-w-0">
                  {message.email ? (
                    <a
                      href={`mailto:${message.email}`}
                      className="break-all text-[#F45100] hover:underline dark:text-orange-400"
                    >
                      {message.email}
                    </a>
                  ) : (
                    <span className="text-slate-500">Belum disampaikan oleh pengunjung</span>
                  )}
                </dd>
              </div>
              <div className="flex items-start gap-3">
                <dt className="shrink-0 text-slate-500">
                  <span className="sr-only">WhatsApp</span>
                  <Phone className="h-[18px] w-[18px]" />
                </dt>
                <dd>
                  {cleanPhone ? (
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      {message.phone}
                    </a>
                  ) : (
                    <span className="text-slate-500">Belum disampaikan oleh pengunjung</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
          <div className="sm:border-l sm:border-gray-200 sm:pl-6 dark:sm:border-white/10">
            <h3 className="mb-3 text-[15px] font-semibold">Informasi Pengiriman</h3>
            <div className="flex items-start gap-3 text-[13px]">
              <Calendar aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-slate-500" />
              <time dateTime={message.createdAt}>{formatMessageDate(message.createdAt)}</time>
              <span className="ml-auto shrink-0 text-[11px] text-slate-500">
                {formatMessageRelative(message.createdAt, new Date(clock))}
              </span>
            </div>
            <p className="mt-2 flex items-center gap-3 text-[13px] text-slate-500">
              <Clock aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
              Pukul {formatMessageTime(message.createdAt)}
            </p>
          </div>
        </section>

        <MessageConsultationDetails message={message} />

        <section aria-label="Tahapan calon klien" className="border-y border-gray-200 py-5 dark:border-white/10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-[15px] font-semibold">
              <Layers className="h-[18px] w-[18px] text-slate-500" />
              Tahapan Calon Klien
            </h3>
            {stage === "batal" && <span className="text-xs text-slate-500">Konsultasi dibatalkan</span>}
          </div>
          <div className="overflow-x-auto pb-1" tabIndex={0} aria-label="Progres tahapan konsultasi">
            <div className="relative min-w-[440px]">
              <div
                aria-hidden="true"
                className="absolute left-[10%] right-[10%] top-2 h-0.5 bg-gray-200 dark:bg-slate-700"
              >
                <span
                  className="block h-full bg-[#F45100]"
                  style={{ width: `${(Math.max(0, currentIndex) / (progressStages.length - 1)) * 100}%` }}
                />
              </div>
              <ol className="relative grid grid-cols-5">
                {progressStages.map((item, index) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      disabled={!canEdit || saving}
                      aria-current={item.key === stage ? "step" : undefined}
                      onClick={() => onStageChange(item.key)}
                      className={`flex w-full flex-col items-center gap-2 rounded text-xs focus-visible:outline-2 focus-visible:outline-[#F45100] disabled:cursor-default ${index <= currentIndex ? "text-[#F45100] dark:text-orange-400" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-[18px] w-[18px] rounded-full ${item.key === stage ? "border-[5px] border-[#F45100] bg-white dark:bg-[#151528]" : index < currentIndex ? "border-2 border-[#F45100] bg-[#F45100]" : "border-2 border-gray-300 bg-white dark:border-slate-600 dark:bg-[#151528]"}`}
                      />
                      <span className={item.key === stage ? "font-medium" : ""}>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <div className="grid gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-6">
          <section
            aria-label="Riwayat aktivitas"
            className="sm:border-r sm:border-gray-200 sm:pr-5 dark:sm:border-white/10"
          >
            <h3 className="mb-4 flex items-center gap-2 text-[15px] font-semibold">
              <History className="h-[18px] w-[18px] text-slate-500" />
              Riwayat Aktivitas
            </h3>
            <ol className="ml-2 border-l border-gray-200 dark:border-white/10">
              <li className="relative pl-5 text-[13px]">
                <span aria-hidden="true" className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-[#F45100]" />
                <p className="font-medium">Pesan konsultasi diterima</p>
                <time dateTime={message.createdAt} className="mt-1 block text-xs leading-5 text-slate-500">
                  {formatMessageDate(message.createdAt)} · {formatMessageTime(message.createdAt)}
                </time>
              </li>
            </ol>
          </section>
          <section aria-label="Catatan perkembangan" className="min-w-0 rounded-lg bg-[#F8F9FB] p-4 dark:bg-white/5">
            <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold">
              <Pencil className="h-[18px] w-[18px] text-slate-500" />
              <label htmlFor={notesId}>Catatan Perkembangan</label>
            </h3>
            <textarea
              id={notesId}
              value={notes}
              disabled={!canEdit}
              onChange={(event) => {
                setNotes(event.target.value);
                setFeedback(null);
              }}
              rows={3}
              placeholder="Tuliskan catatan internal terkait klien atau jadwal pertemuan..."
              className="block min-h-20 w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-[13px] leading-5 text-gray-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:cursor-not-allowed dark:border-white/15 dark:bg-[#151528] dark:text-white"
            />
            <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
              {feedback && (
                <p
                  role={feedback.error ? "alert" : "status"}
                  className={`mr-auto text-xs ${feedback.error ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}
                >
                  {feedback.text}
                </p>
              )}
              <button
                type="button"
                disabled={saving || !canEdit}
                onClick={() => void saveNotes()}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#F45100] px-3 text-[13px] font-medium text-white hover:bg-[#d94700] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Menyimpan..." : "Simpan Catatan"}
              </button>
            </div>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-white/10">
          <label htmlFor={readStatusId} className="text-xs text-slate-500">
            Status Keterbacaan
          </label>
          <select
            id={readStatusId}
            value={message.status}
            disabled={!canEdit}
            onChange={(event) => onReadStatusChange(event.target.value as ContactMessage["status"])}
            className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs disabled:cursor-not-allowed dark:border-white/10 dark:bg-[#151528]"
          >
            <option value="unread">Belum Dibaca</option>
            <option value="read">Dibaca</option>
            <option value="replied">Dibalas</option>
          </select>
        </div>
      </div>

      <footer className="grid shrink-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2 border-t border-gray-200 bg-white px-4 py-3 sm:flex sm:gap-3 sm:px-6 sm:py-4 dark:border-white/10 dark:bg-[#151528]">
        <button
          type="button"
          disabled={!canDelete || saving}
          onClick={onDelete}
          className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-[13px] font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:mr-auto dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Hapus Pesan
        </button>
        {cleanPhone && (
          <a
            href={`https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(message.name)},%20terima%20kasih%20telah%20menghubungi%20CITS%20Indonesia.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 text-[13px] font-medium text-white hover:bg-emerald-700"
          >
            <Phone className="h-4 w-4 shrink-0" />
            Balas via WhatsApp
          </a>
        )}
        <button
          type="button"
          disabled={!canEdit}
          onClick={onReply}
          className="col-span-2 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#F45100] px-3 text-[13px] font-medium text-white hover:bg-[#d94700] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Reply className="h-4 w-4" />
          Kirim Balasan Email
        </button>
      </footer>
    </AdminDialogSurface>
  );
}
