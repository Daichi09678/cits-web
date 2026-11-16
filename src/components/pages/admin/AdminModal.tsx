"use client";

import { useId } from "react";
import { createPortal } from "react-dom";
import { X, type LucideIcon } from "lucide-react";
import AdminDialogSurface from "./AdminDialogSurface";

type ModalSize = "md" | "lg" | "xl" | "2xl" | "3xl";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  size?: ModalSize;
  busy?: boolean;
  children: React.ReactNode;
}

const SIZE_CLASS: Record<ModalSize, string> = {
  md: "w-[min(448px,calc(100vw-32px))]",
  lg: "w-[min(512px,calc(100vw-32px))]",
  xl: "w-[min(576px,calc(100vw-32px))]",
  "2xl": "w-[min(672px,calc(100vw-32px))]",
  "3xl": "w-[min(768px,calc(100vw-32px))]",
};

export default function AdminModal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  size = "xl",
  busy = false,
  children,
}: AdminModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <AdminDialogSurface
      labelledBy={titleId}
      describedBy={description ? descriptionId : undefined}
      onClose={onClose}
      busy={busy}
      widthClassName={SIZE_CLASS[size]}
    >
      <header className="flex shrink-0 items-start gap-3 border-b border-slate-100 p-5 dark:border-white/5">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white">
            <Icon aria-hidden="true" className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-sm font-extrabold text-slate-900 dark:text-white">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label={`Tutup ${title.toLocaleLowerCase("id")}`}
          className="flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
    </AdminDialogSurface>,
    document.body
  );
}
