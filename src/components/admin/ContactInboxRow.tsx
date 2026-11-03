"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Eye, MoreVertical, Reply, Trash2 } from "lucide-react";
import { consultationSummary } from "@/lib/consultation";
import { formatMessageDate, formatMessageRelative } from "@/lib/date";
import type { ContactMessage, DealStage } from "@/types/schema";

interface InboxStage {
  key: DealStage;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

interface ContactInboxRowProps {
  message: ContactMessage;
  stages: InboxStage[];
  selected: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onReply: () => void;
  onDelete: () => void;
  onStageChange: (stage: DealStage) => void;
}

export default function ContactInboxRow({
  message,
  stages,
  selected,
  canEdit,
  canDelete,
  onSelect,
  onOpen,
  onReply,
  onDelete,
  onStageChange,
}: ContactInboxRowProps) {
  const [menu, setMenu] = useState<"stage" | "actions" | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const stage = stages.find((item) => item.key === (message.dealStage || "baru")) || stages[0];
  const unread = message.status === "unread";

  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) setMenu(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menu]);

  return (
    <article
      aria-label={`Pesan dari ${message.name}${unread ? ", belum dibaca" : ""}`}
      className={`rounded-xl border bg-white p-4 sm:p-5 dark:bg-[#151528] ${
        selected ? "border-slate-400 dark:border-slate-500" : "border-gray-200 dark:border-white/10"
      }`}
    >
      <div className="grid min-w-0 gap-x-5 gap-y-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            aria-label={`Pilih pesan dari ${message.name}`}
            className="h-4 w-4 shrink-0 cursor-pointer accent-[#F45100]"
          />
          <div
            aria-hidden="true"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
              unread
                ? "bg-orange-50 text-amber-800 dark:bg-orange-500/10 dark:text-orange-300"
                : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
            }`}
          >
            {message.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="max-w-full break-words text-[15px] font-semibold leading-5 text-gray-900 dark:text-white">
                {message.name}
              </h2>
              {message.company && (
                <span className="max-w-full rounded-md bg-[#FFF1E8] px-2.5 py-0.5 text-[11px] font-medium leading-4 break-words text-orange-800 dark:bg-orange-500/10 dark:text-orange-300">
                  {message.company}
                </span>
              )}
            </div>
            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5 text-xs leading-5 text-slate-600 dark:text-slate-400">
              <span className="min-w-0 break-all">{message.email}</span>
              {message.phone && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="break-all">{message.phone}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          ref={actionsRef}
          className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 sm:flex sm:flex-wrap sm:gap-4 xl:justify-end"
        >
          <div className="relative min-w-0">
            <button
              type="button"
              disabled={!canEdit}
              aria-label={`Ubah tahapan pesan dari ${message.name}: ${stage.label}`}
              aria-expanded={menu === "stage"}
              onClick={() => setMenu(menu === "stage" ? null : "stage")}
              className={`inline-flex h-8 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg border px-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-28 sm:gap-3 sm:px-3 ${stage.badgeBg} ${stage.badgeText} ${stage.badgeBorder}`}
            >
              <span className="truncate">{stage.label}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            </button>
            {menu === "stage" && (
              <div className="absolute left-0 top-full z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-sm dark:border-white/10 dark:bg-[#1A1A2E]">
                {stages.map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => {
                      onStageChange(item.key);
                      setMenu(null);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    {item.label}
                    {item.key === stage.key && <Check className="h-3.5 w-3.5 text-[#F45100]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onReply}
            aria-label="Balas Email"
            title="Balas pesan ini via email"
            className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#F45100] px-2 text-xs font-medium text-white hover:bg-[#d94700] sm:gap-2 sm:px-3"
          >
            <Reply className="h-3.5 w-3.5" />
            <span>
              Balas<span className="hidden sm:inline"> Email</span>
            </span>
          </button>
          <button
            type="button"
            onClick={onOpen}
            title="Buka detail pesan & catatan"
            className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-2 text-xs font-medium text-gray-900 hover:bg-slate-50 sm:gap-2 sm:px-3 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <Eye className="h-4 w-4" />
            Buka
          </button>
          <div className="relative ml-auto sm:ml-0">
            <button
              type="button"
              aria-label={`Aksi lainnya untuk pesan dari ${message.name}`}
              aria-expanded={menu === "actions"}
              onClick={() => setMenu(menu === "actions" ? null : "actions")}
              className="flex h-8 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            {menu === "actions" && (
              <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-[#1A1A2E]">
                <button
                  type="button"
                  disabled={!canDelete}
                  onClick={() => {
                    setMenu(null);
                    onDelete();
                  }}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus pesan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 grid min-w-0 gap-x-5 gap-y-2 sm:pl-9 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <button type="button" onClick={onOpen} className="min-w-0 text-left">
          <p className="text-[13px] font-semibold leading-5 text-gray-900 dark:text-slate-100">
            Kebutuhan Konsultasi: {consultationSummary(message)}
          </p>
          <p className="mt-0.5 line-clamp-2 break-words text-[13px] leading-5 text-slate-600 dark:text-slate-300">
            {message.message}
          </p>
          {message.dealNotes && (
            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">Catatan: {message.dealNotes}</p>
          )}
        </button>
        <time
          dateTime={message.createdAt}
          title={formatMessageDate(message.createdAt)}
          className="shrink-0 text-right text-xs leading-5 text-slate-600 dark:text-slate-400"
        >
          {formatMessageRelative(message.createdAt)}
        </time>
      </div>
    </article>
  );
}
