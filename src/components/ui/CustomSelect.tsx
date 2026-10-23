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
        className="w-full min-w-0 appearance-none truncate pl-4 pr-10 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white text-left outline-none transition-colors hover:border-gray-300 dark:hover:border-white/20 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none w-4 h-4 text-gray-700 dark:text-white/70 absolute right-4 top-1/2 -translate-y-1/2" />
    </div>
  );
}
