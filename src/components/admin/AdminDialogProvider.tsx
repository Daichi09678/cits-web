"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, X, type LucideIcon } from "lucide-react";

export type AdminDialogVariant = "danger" | "warning" | "success" | "info";

export interface AdminConfirmOptions {
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: AdminDialogVariant;
}

export interface AdminAlertOptions {
  title: string;
  description?: React.ReactNode;
  okLabel?: string;
  variant?: AdminDialogVariant;
}

interface AdminDialogContextValue {
  confirm: (options: AdminConfirmOptions) => Promise<boolean>;
  alert: (options: AdminAlertOptions) => Promise<void>;
}

type DialogState =
  | { mode: "confirm"; options: AdminConfirmOptions; resolve: (value: boolean) => void }
  | { mode: "alert"; options: AdminAlertOptions; resolve: (value: boolean) => void };

const AdminDialogContext = createContext<AdminDialogContextValue | null>(null);

export function useAdminDialog(): AdminDialogContextValue {
  const context = useContext(AdminDialogContext);
  if (!context) {
    throw new Error("useAdminDialog harus dipakai di dalam AdminDialogProvider.");
  }
  return context;
}

const VARIANTS: Record<
  AdminDialogVariant,
  { icon: LucideIcon; iconClass: string; buttonClass: string; ringClass: string }
> = {
  danger: {
    icon: ShieldAlert,
    iconClass: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    buttonClass: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20",
    ringClass: "border-rose-200 dark:border-rose-500/20",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    buttonClass: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20",
    ringClass: "border-amber-200 dark:border-amber-500/20",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20",
    ringClass: "border-emerald-200 dark:border-emerald-500/20",
  },
  info: {
    icon: Info,
    iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    buttonClass: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20",
    ringClass: "border-blue-200 dark:border-blue-500/20",
  },
};

export default function AdminDialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const confirm = useCallback((options: AdminConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({ mode: "confirm", options, resolve });
    });
  }, []);

  const alert = useCallback((options: AdminAlertOptions) => {
    return new Promise<void>((resolve) => {
      setDialog({ mode: "alert", options, resolve: () => resolve() });
    });
  }, []);

  const close = useCallback((result: boolean) => {
    setDialog((current) => {
      current?.resolve(result);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKeyDown);
    confirmButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dialog, close]);

  const value = useMemo<AdminDialogContextValue>(() => ({ confirm, alert }), [confirm, alert]);

  const variant = dialog?.options.variant ?? (dialog?.mode === "confirm" ? "warning" : "info");
  const styles = VARIANTS[variant];
  const Icon = styles.icon;
  const isConfirm = dialog?.mode === "confirm";

  return (
    <AdminDialogContext.Provider value={value}>
      {children}

      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 animate-admin-backdrop bg-slate-950/60 backdrop-blur-sm"
            onClick={() => close(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`relative w-full max-w-md animate-admin-dialog rounded-3xl border bg-white p-6 shadow-2xl dark:bg-[#151528] ${styles.ringClass}`}
          >
            <button
              type="button"
              onClick={() => close(false)}
              aria-label="Tutup dialog"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.iconClass}`}
              aria-hidden="true"
            >
              <Icon className="h-6 w-6" />
            </div>

            <h2 id={titleId} className="mt-4 pr-6 text-base font-extrabold text-slate-900 dark:text-white">
              {dialog.options.title}
            </h2>

            {dialog.options.description && (
              <div className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {dialog.options.description}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {isConfirm && (
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  {dialog.options.cancelLabel || "Batal"}
                </button>
              )}

              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => close(true)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-[11px] font-bold text-white shadow-md transition-colors ${styles.buttonClass}`}
              >
                {isConfirm ? dialog.options.confirmLabel || "Ya, Lanjutkan" : dialog.options.okLabel || "Mengerti"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDialogContext.Provider>
  );
}
