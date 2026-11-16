"use client";

import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  options: (string | { value: string; label: string })[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  labelledBy?: string;
}

export default function CustomSelect({
  options,
  placeholder = "Pilih opsi",
  value,
  onChange,
  labelledBy,
}: CustomSelectProps) {
  return (
    <div className="relative min-w-0">
      <select
        value={value}
        defaultValue={value === undefined ? "" : undefined}
        onChange={(event) => onChange?.(event.target.value)}
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : placeholder}
        className="w-full min-w-0 appearance-none truncate rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-10 text-left text-sm text-slate-900 outline-none transition-colors hover:border-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-white/15 dark:bg-[#1A1A2E] dark:text-white dark:hover:border-white/25"
      >
        <option className="bg-white text-slate-900 dark:bg-[#1A1A2E] dark:text-white" value="">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            className="bg-orange-50 text-slate-900 dark:bg-[#1A1A2E] dark:text-white"
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-white/60" />
    </div>
  );
}
