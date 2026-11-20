"use client";
import { adminAction } from "@/components/pages/admin/accentStyles";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import AdminDialogSurface from "@/components/pages/admin/AdminDialogSurface";

export const teamButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F45100] disabled:cursor-not-allowed disabled:opacity-50";
export const teamPrimary = teamButton + ` ${adminAction}`;
export const teamSecondary =
  teamButton +
  " border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151528] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10";
export const teamField =
  "mt-2 min-h-11 w-full min-w-0 rounded-lg border border-control-border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-600 focus:border-orange-800 disabled:bg-slate-100 dark:bg-[#151528] dark:text-white dark:placeholder:text-slate-300 dark:focus:border-orange-400 dark:disabled:bg-white/5";

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
  return (
    <AdminDialogSurface
      labelledBy={titleId}
      onClose={onClose}
      busy={busy}
      widthClassName="w-[min(520px,calc(100vw-32px))]"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 px-6 py-4">
        <h2 id={titleId} className="text-lg font-bold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label={`Tutup ${title.toLocaleLowerCase("id")}`}
          className={
            teamButton + " -mr-2 w-11 px-0 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
          }
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>
      {children}
    </AdminDialogSurface>
  );
}
