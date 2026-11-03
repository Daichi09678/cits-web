"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export const teamButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F45100] disabled:cursor-not-allowed disabled:opacity-50";
export const teamPrimary = teamButton + " bg-[#F45100] text-white hover:bg-[#D94800]";
export const teamSecondary = teamButton + " border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F8F9FB]";
export const teamField =
  "mt-2 min-h-11 w-full min-w-0 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-slate-400 focus:border-[#F45100] focus:outline-2 focus:outline-[#F45100]/20 disabled:bg-[#F8F9FB]";

export default function TeamDialog({
  title,
  titleId,
  busy = false,
  onClose,
  children,
}: {
  title: string;
  titleId: string;
  busy?: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      data-admin-dialog="true"
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (busy || event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-32px)] w-[min(520px,calc(100vw-32px))] max-w-none flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-0 text-[#111827] shadow-lg backdrop:bg-slate-950/35 open:flex [color-scheme:light]"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#E5E7EB] px-6 py-4">
        <h2 id={titleId} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label={`Tutup ${title.toLocaleLowerCase("id")}`}
          className={teamButton + " -mr-2 w-11 px-0 text-[#64748B] hover:bg-[#F8F9FB]"}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>
      {children}
    </dialog>
  );
}
