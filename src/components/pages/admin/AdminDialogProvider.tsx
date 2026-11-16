"use client";

import { createContext, useCallback, useContext, useId, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, X, type LucideIcon } from "lucide-react";
import AdminDialogSurface from "./AdminDialogSurface";
import Button from "@/components/ui/Button";

export type AdminDialogVariant = "danger" | "warning" | "success" | "info";

export interface AdminConfirmOptions {
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: AdminDialogVariant;
  /** Detailed catalog confirmations use a quiet, scrollable native dialog. */
  details?: React.ReactNode;
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
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

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

  const value = useMemo<AdminDialogContextValue>(() => ({ confirm, alert }), [confirm, alert]);

  const variant = dialog?.options.variant ?? (dialog?.mode === "confirm" ? "warning" : "info");
  const styles = VARIANTS[variant];
  const Icon = styles.icon;
  const isConfirm = dialog?.mode === "confirm";

  return (
    <AdminDialogContext.Provider value={value}>
      {children}

      {dialog?.mode === "confirm" && dialog.options.details ? (
        <AdminDialogSurface
          labelledBy={titleId}
          describedBy={dialog.options.description ? descriptionId : undefined}
          onClose={() => close(false)}
          widthClassName="w-[min(480px,calc(100vw-32px))]"
          initialFocusRef={cancelButtonRef}
        >
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-white/10">
            <h2 id={titleId} className="text-base font-semibold text-slate-900 dark:text-white">
              {dialog.options.title}
            </h2>
            <Button
              type="button"
              onClick={() => close(false)}
              aria-label="Tutup dialog"
              variant="ghost"
              size="icon"
              className="-mr-2 -mt-1 shrink-0"
            >
              <X className="size-4" />
            </Button>
          </header>
          <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-5 text-sm leading-relaxed [overflow-wrap:anywhere]">
            {dialog.options.description && (
              <div id={descriptionId} className="mb-4 text-slate-600 dark:text-slate-300">
                {dialog.options.description}
              </div>
            )}
            {dialog.options.details}
          </div>
          <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end dark:border-white/10">
            <Button ref={cancelButtonRef} type="button" onClick={() => close(false)} variant="secondary">
              {dialog.options.cancelLabel || "Batal"}
            </Button>
            <Button type="button" onClick={() => close(true)} variant={variant === "danger" ? "danger" : "primary"}>
              {dialog.options.confirmLabel || "Ya, Lanjutkan"}
            </Button>
          </footer>
        </AdminDialogSurface>
      ) : (
        dialog && (
          <AdminDialogSurface
            labelledBy={titleId}
            describedBy={dialog.options.description ? descriptionId : undefined}
            onClose={() => close(false)}
            widthClassName="w-[min(448px,calc(100vw-32px))]"
            initialFocusRef={isConfirm ? cancelButtonRef : confirmButtonRef}
          >
            <div className="relative overflow-y-auto p-6">
              <Button
                type="button"
                onClick={() => close(false)}
                aria-label="Tutup dialog"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3"
              >
                <X className="h-4 w-4" />
              </Button>

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
                <div id={descriptionId} className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {dialog.options.description}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {isConfirm && (
                  <Button ref={cancelButtonRef} type="button" onClick={() => close(false)} variant="secondary">
                    {dialog.options.cancelLabel || "Batal"}
                  </Button>
                )}

                <Button
                  ref={confirmButtonRef}
                  type="button"
                  onClick={() => close(true)}
                  variant={variant === "danger" ? "danger" : "primary"}
                >
                  {isConfirm ? dialog.options.confirmLabel || "Ya, Lanjutkan" : dialog.options.okLabel || "Mengerti"}
                </Button>
              </div>
            </div>
          </AdminDialogSurface>
        )
      )}
    </AdminDialogContext.Provider>
  );
}
