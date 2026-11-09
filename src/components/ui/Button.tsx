import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger-soft";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-orange-600 text-white shadow-sm shadow-orange-600/25 hover:bg-orange-700",
  secondary:
    "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
  "danger-soft":
    "border border-slate-200/80 bg-slate-50 text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-rose-900/40 dark:hover:bg-rose-950/30 dark:hover:text-rose-300",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-[11px]",
  md: "px-3.5 py-2.5 text-xs",
  lg: "px-5 py-3 text-sm",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function Button({ variant = "primary", size = "md", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...rest} />;
}
