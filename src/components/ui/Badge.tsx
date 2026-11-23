import type { HTMLAttributes, ReactNode } from "react";
import { adminAccent, adminActiveBadge } from "@/components/pages/admin/accentStyles";
import { cn } from "@/lib/cn";

/**
 * Badge standar untuk seluruh permukaan aplikasi (front office maupun back office).
 *
 * Aturan pakai:
 * - `tone` menentukan makna (accent = CTA/status baru, success = aktif, info = netral-informatif).
 * - `variant="soft"` untuk latar terang (default), `solid` untuk penekanan kuat,
 *   `inverse` untuk badge yang duduk di atas permukaan berwarna (mis. menu aktif).
 * - `shape` disediakan karena beberapa tempat (mis. label role di sidebar) memakai
 *   sudut kotak; jangan menimpa bentuk lewat `className` karena utility konflik.
 */
export type BadgeTone = "accent" | "neutral" | "success" | "info" | "warning" | "danger";
export type BadgeVariant = "soft" | "solid" | "inverse";
export type BadgeShape = "pill" | "rounded" | "square";
export type BadgeSize = "sm" | "md";

const SOFT: Record<BadgeTone, string> = {
  accent:
    "border border-orange-200 bg-orange-50 text-accent dark:border-orange-500/25 dark:bg-orange-500/10 dark:text-orange-300",
  neutral:
    "border border-slate-200 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200",
  success:
    "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300",
  info: "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300",
  warning:
    "border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/25 dark:bg-amber-400/10 dark:text-amber-200",
  danger:
    "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-300",
};

const SOLID: Record<BadgeTone, string> = {
  accent: "bg-action text-on-action",
  neutral: "bg-slate-700 text-white",
  success: "bg-emerald-700 text-white",
  info: "bg-blue-600 text-white",
  warning: "bg-amber-100 text-amber-950",
  danger: "bg-rose-600 text-white",
};

const SIZES: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-[11px]",
};

const SHAPES: Record<BadgeShape, string> = {
  pill: "rounded-full",
  rounded: "rounded-md",
  square: "rounded",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  shape?: BadgeShape;
  size?: BadgeSize;
  children?: ReactNode;
}

function renderBadge(
  { tone = "neutral", variant = "soft", shape = "pill", size = "sm", className, children, ...rest }: BadgeProps,
  backOffice: boolean
) {
  const inverse = backOffice ? adminActiveBadge : "bg-white text-slate-950";
  const solid = backOffice && tone === "accent" ? adminAccent : SOLID[tone];
  const toneClass = variant === "inverse" ? inverse : variant === "solid" ? solid : SOFT[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap font-bold leading-tight",
        SIZES[size],
        SHAPES[shape],
        toneClass,
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export default function Badge(props: BadgeProps) {
  return renderBadge(props, false);
}

export function BackOfficeBadge(props: BadgeProps) {
  return renderBadge(props, true);
}
