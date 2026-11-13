"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X, type LucideIcon } from "lucide-react";

type ModalSize = "md" | "lg" | "xl" | "2xl" | "3xl";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  size?: ModalSize;
  children: React.ReactNode;
}

const SIZE_CLASS: Record<ModalSize, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function AdminModal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  size = "xl",
  children,
}: AdminModalProps) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    // Simpan fokus asal agar bisa dikembalikan saat modal ditutup.
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Fokus awal ke kontrol pertama di dalam dialog. Dijalankan langsung
    // (bukan lewat requestAnimationFrame) karena rAF bisa ditahan browser
    // saat tab tidak aktif sehingga fokus tidak pernah berpindah.
    const node = dialogRef.current;
    if (node) {
      const target = node.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? node;
      target.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const node = dialogRef.current;
      if (!node) return;

      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement
      );

      if (items.length === 0) {
        event.preventDefault();
        node.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!active || active === first || !node.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (!active || active === last || !node.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown, true);
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 animate-admin-backdrop bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex max-h-[92vh] w-full ${SIZE_CLASS[size]} animate-admin-dialog flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl outline-none dark:border-white/10 dark:bg-[#151528]`}
      >
        <div className="flex shrink-0 items-start gap-3 border-b border-slate-100 p-5 dark:border-white/5">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-sm font-extrabold text-slate-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}
