"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Native modal behavior provides focus containment, Escape, and focus restoration. */
export default function AdminDialogSurface({
  children,
  labelledBy,
  onClose,
  widthClassName = "w-[min(900px,calc(100vw-48px))]",
  initialFocusRef,
  describedBy,
  busy = false,
  className = "",
}: {
  children: React.ReactNode;
  labelledBy: string;
  onClose: () => void;
  widthClassName?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  describedBy?: string;
  busy?: boolean;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    dialog.showModal();
    initialFocusRef?.current?.focus();
    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [initialFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      data-admin-dialog="true"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-modal="true"
      aria-busy={busy || undefined}
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
      className={`fixed inset-0 m-auto max-h-[calc(100dvh-48px)] max-w-none flex-col overflow-hidden rounded-[14px] border border-gray-200 bg-white p-0 text-gray-900 shadow-lg backdrop:bg-slate-950/50 open:flex [color-scheme:light] dark:[color-scheme:dark] dark:border-white/10 dark:bg-[#151528] dark:text-white ${widthClassName} ${className}`}
    >
      {children}
    </dialog>
  );
}
