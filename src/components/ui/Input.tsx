import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Standar kontrol form aplikasi.
 *
 * `fieldSize` menyediakan dua tinggi yang sudah dipakai di project:
 * - `sm` = 38px (form admin/back office, `text-xs`)
 * - `md` = 44px (form front office, `text-sm`)
 *
 * Jangan menimpa `px-*`/`py-*` lewat `className`; pilih `fieldSize` atau tambahkan
 * varian baru di sini supaya seluruh halaman tetap memakai ukuran yang sama.
 */
export type FieldSize = "sm" | "md";

const BASE =
  "w-full rounded-xl border bg-white text-slate-900 outline-none transition-colors placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#121222] dark:text-white dark:placeholder:text-white/40";

const BORDER_OK = "border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-white/15";
const BORDER_INVALID =
  "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-rose-500/40";

const SIZES: Record<FieldSize, string> = {
  sm: "px-3.5 py-2.5 text-xs",
  md: "px-4 py-3 text-sm",
};

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fieldSize?: FieldSize;
  /** Beri ruang untuk ikon di sisi kiri (ikon tetap dirender pemanggil). */
  withIcon?: boolean;
  invalid?: boolean;
}

export default function Input({ fieldSize = "md", withIcon = false, invalid = false, className, ...rest }: InputProps) {
  return (
    <input
      className={cn(BASE, invalid ? BORDER_INVALID : BORDER_OK, SIZES[fieldSize], withIcon && "pl-10", className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  fieldSize?: FieldSize;
  invalid?: boolean;
}

export function Textarea({ fieldSize = "md", invalid = false, className, ...rest }: TextareaProps) {
  return (
    <textarea
      className={cn(
        BASE,
        invalid ? BORDER_INVALID : BORDER_OK,
        SIZES[fieldSize],
        "min-h-[7.5rem] resize-y leading-relaxed",
        className
      )}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}
