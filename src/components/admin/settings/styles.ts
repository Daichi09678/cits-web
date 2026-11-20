import { adminAction } from "@/components/pages/admin/accentStyles";
export const fieldClass =
  "min-h-10 w-full rounded-lg border border-control-border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-600 focus:border-orange-800 disabled:cursor-not-allowed disabled:bg-slate-50 dark:bg-[#151528] dark:text-slate-100 dark:placeholder:text-slate-300 dark:focus:border-orange-400";

export const primaryButton =
  `inline-flex min-h-10 items-center justify-center gap-2 rounded-lg ${adminAction} px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60`;

export const secondaryButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-control-border bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10";

export const cardClass = "rounded-xl border border-[#E2E8F0] bg-white dark:border-white/10 dark:bg-[#151528]";
