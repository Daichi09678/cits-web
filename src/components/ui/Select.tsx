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
  sm: "py-2.5 pl-3.5 pr-10 text-xs",
  md: "py-3 pl-4 pr-10 text-sm",
};

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  selectSize?: SelectSize;
  containerClassName?: string;
}

export default function Select({ selectSize = "md", containerClassName, className, children, ...rest }: SelectProps) {
  return (
    <div className={cn("relative min-w-0", containerClassName)}>
      <select
        className={cn(
          "w-full min-w-0 appearance-none truncate rounded-xl border border-slate-300 bg-white text-left text-slate-900 outline-none transition-colors hover:border-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#1A1A2E] dark:text-white dark:hover:border-white/25",
          SIZES[selectSize],
          className
        )}
        {...rest}
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
