import type { ButtonHTMLAttributes, Ref } from "react";
import { adminAction } from "@/components/pages/admin/accentStyles";
import accentStyles from "@/components/pages/public/PublicAccent.module.css";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  "primary" | "public-primary" | "unstyled" | "secondary" | "ghost" | "danger-soft" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon" | "none";

const BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition-colors active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60";

const PRIMARY = "bg-action text-on-action shadow-sm hover:bg-action-hover";
const VARIANTS: Record<ButtonVariant, string> = {
  primary: PRIMARY,
  "public-primary": `${accentStyles.action} shadow-sm`,
  unstyled: "",
  link: "text-accent underline decoration-1 underline-offset-4 hover:text-[#E84700] dark:text-orange-300 dark:hover:text-orange-200",
  danger: "bg-rose-700 text-white shadow-sm hover:bg-rose-800",
  secondary:
    "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
  "danger-soft":
    "border border-slate-200/80 bg-slate-50 text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-rose-900/40 dark:hover:bg-rose-950/30 dark:hover:text-rose-300",
};

export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
  backOffice = false
) {
  if (backOffice) {
    return cn(
      variant !== "unstyled" &&
        `${BASE} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600`,
      variant === "primary" || variant === "public-primary" ? `${adminAction} shadow-sm` : VARIANTS[variant],
      SIZES[size],
      className
    );
  }

  return cn(
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 dark:focus-visible:outline-orange-400",
    size === "none" && "min-h-6 min-w-6",
    variant !== "unstyled" ? BASE : "cursor-pointer disabled:cursor-not-allowed",
    VARIANTS[variant],
    SIZES[size],
    className
  );
}

const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3 py-2 text-xs",
  md: "min-h-11 px-3.5 py-2.5 text-xs",
  lg: "min-h-12 px-5 py-3 text-sm",
  icon: "min-h-11 min-w-11 p-2.5 text-sm",
  none: "",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  busy?: boolean;
  busyLabel?: string;
  ref?: Ref<HTMLButtonElement>;
}

function renderButton(
  {
    variant = "primary",
    size = "md",
    className,
    type = "button",
    busy = false,
    busyLabel = "Memproses...",
    disabled,
    children,
    ...rest
  }: ButtonProps,
  backOffice: boolean
) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || busy}
      aria-busy={busy || rest["aria-busy"] || undefined}
      className={buttonStyles(variant, size, className, backOffice)}
    >
      {busy ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
          />
          {busyLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default function Button(props: ButtonProps) {
  return renderButton(props, false);
}

export function BackOfficeButton(props: ButtonProps) {
  return renderButton(props, true);
}
