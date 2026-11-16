"use client";

import { useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import AdminDialogSurface from "@/components/pages/admin/AdminDialogSurface";
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
  if (typeof document === "undefined") return null;
  return createPortal(
    <AdminDialogSurface
      labelledBy={titleId}
      describedBy={descriptionId}
      busy={busy}
      onClose={close}
      widthClassName={compact ? "w-[min(512px,calc(100vw-32px))]" : "w-[min(920px,calc(100vw-32px))]"}
      className={settingsFont.className}
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
    </AdminDialogSurface>,
    document.body
  );
}
