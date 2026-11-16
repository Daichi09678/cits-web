"use client";

import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Select standar (native `<select>` supaya tetap nyaman di mobile).
 * `className` berlaku untuk elemen select, `containerClassName` untuk wrapper.
 */
export type SelectSize = "sm" | "md";

const SIZES: Record<SelectSize, string> = {
  sm: "min-h-10 py-2.5 pl-3.5 pr-10 text-xs",
  md: "min-h-[46px] py-3 pl-4 pr-10 text-sm",
};

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  selectSize?: SelectSize;
  containerClassName?: string;
  invalid?: boolean;
}

export default function Select({
  selectSize = "md",
  containerClassName,
  className,
  children,
  invalid = false,
  ...rest
}: SelectProps) {
  return (
    <div className={cn("relative min-w-0", containerClassName)}>
      <select
        className={cn(
          "w-full min-w-0 cursor-pointer appearance-none truncate rounded-xl border bg-white text-left font-normal text-slate-900 outline-none transition-colors [font-family:inherit] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#121222] dark:text-white",
          invalid
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500/40"
            : "border-slate-300 hover:border-slate-400 focus:border-orange-500 focus:ring-orange-500/20 dark:border-white/15 dark:hover:border-white/25",
          SIZES[selectSize],
          className
        )}
        {...rest}
        aria-invalid={invalid || rest["aria-invalid"] || undefined}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-white/60"
      />
    </div>
  );
}
