"use client";

import { useEffect, useRef } from "react";
import { Check, Minus } from "lucide-react";

interface MatrixCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

/** Checkbox native yang dirender langsung di dalam sel tabel. */
export default function MatrixCheckbox({
  checked,
  indeterminate = false,
  disabled = false,
  label,
  onChange,
}: MatrixCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate && !checked;
    }
  }, [indeterminate, checked]);

  const stateClass = disabled
    ? "border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
    : checked
      ? "border-orange-600 bg-orange-600 text-white shadow-sm shadow-orange-600/25 group-hover:border-orange-700 group-hover:bg-orange-700"
      : indeterminate
        ? "border-orange-400 bg-orange-50 text-orange-600 dark:border-orange-500/60 dark:bg-orange-500/10 dark:text-orange-400"
        : "border-slate-300 bg-white text-transparent group-hover:border-orange-500 dark:border-white/20 dark:bg-transparent";

  return (
    <label
      className={`group inline-flex items-center justify-center align-middle ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      title={label}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={label}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 items-center justify-center rounded-[6px] border-2 transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500/60 peer-focus-visible:ring-offset-1 dark:peer-focus-visible:ring-offset-[#151528] ${stateClass}`}
      >
        {checked ? (
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        ) : indeterminate ? (
          <Minus className="h-3.5 w-3.5" strokeWidth={3} />
        ) : null}
      </span>
    </label>
  );
}
