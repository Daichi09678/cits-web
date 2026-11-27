"use client";

import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { BACK_OFFICE_BORDER, FIELD_BORDER, FIELD_INVALID_BORDER } from "./Input";

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

function renderSelect(
  { selectSize = "md", containerClassName, className, children, invalid = false, ...rest }: SelectProps,
  border: string
) {
  return (
    <div className={cn("relative min-w-0", containerClassName)} data-select-control>
      <select
        className={cn(
          "w-full min-w-0 cursor-pointer appearance-none truncate rounded-xl border bg-white text-left font-normal text-slate-900 outline-none transition-colors [font-family:inherit] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#121222] dark:text-white",
          invalid ? FIELD_INVALID_BORDER : border,
          SIZES[selectSize],
          className
        )}
        {...rest}
        data-local-select
        aria-invalid={invalid || rest["aria-invalid"] || undefined}
      >
        {children}
      </select>
      <span
        aria-hidden="true"
        data-select-chevron
        className="pointer-events-none absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md"
      >
        <ChevronDown className="size-4" />
      </span>
    </div>
  );
}

export default function Select(props: SelectProps) {
  return renderSelect(props, FIELD_BORDER);
}

export function BackOfficeSelect(props: SelectProps) {
  return renderSelect(props, BACK_OFFICE_BORDER);
}
