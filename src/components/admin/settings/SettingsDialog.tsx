"use client";

import { useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useModalFocus } from "@/components/ui/useModalFocus";
import { settingsFont } from "./typography";

export default function SettingsDialog({
  title,
  description,
  onClose,
  busy,
  children,
  compact = false,
}: {
  title: string;
  description: string;
  onClose: () => void;
  busy: boolean;
  children: ReactNode;
  compact?: boolean;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const close = () => {
    if (!busy) onClose();
  };
  const ref = useModalFocus(true, close);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-2 backdrop-blur-sm sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={busy}
        className={`${settingsFont.className} relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#151528] dark:text-white ${compact ? "max-w-lg" : "max-w-[920px]"}`}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-5 py-5 dark:border-white/10 sm:px-7">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            <p id={descriptionId} className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            disabled={busy}
            aria-label="Tutup dialog"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-orange-500 disabled:opacity-40 dark:hover:bg-white/10"
          >
            <X className="size-5" />
          </button>
        </header>
        {children}
      </div>
    </div>,
    document.body
  );
}
