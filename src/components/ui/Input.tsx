import type { InputHTMLAttributes, Ref, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Standar kontrol form aplikasi.
 *
 * `fieldSize` menyediakan dua tinggi yang sudah dipakai di project:
 * - `sm` = minimum 40px (form admin/back office, `text-xs`)
 * - `md` = minimum 46px (form front office, `text-sm`)
 *
 * Jangan menimpa `px-*`/`py-*` lewat `className`; pilih `fieldSize` atau tambahkan
 * varian baru di sini supaya seluruh halaman tetap memakai ukuran yang sama.
 */
export type FieldSize = "sm" | "md";

const BASE =
  "w-full min-w-0 rounded-xl border bg-white font-normal text-slate-900 outline-none transition-colors [font-family:inherit] placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#121222] dark:text-white dark:placeholder:text-slate-400";

export const FIELD_BORDER_COLOR = "border-[#8f8f8f]";

export const FIELD_BORDER = `${FIELD_BORDER_COLOR} focus:border-orange-700 focus:ring-2 focus:ring-orange-700 dark:focus:border-orange-400 dark:focus:ring-orange-400`;
export const FIELD_INVALID_BORDER =
  "border-rose-700 focus:border-rose-700 focus:ring-2 focus:ring-rose-700 dark:border-rose-400 dark:focus:border-rose-400 dark:focus:ring-rose-400";

export const BACK_OFFICE_BORDER =
  "border-control-border focus:border-orange-800 focus:ring-2 focus:ring-orange-800 dark:focus:border-orange-400 dark:focus:ring-orange-400";

const SIZES: Record<FieldSize, string> = {
  sm: "min-h-10 px-3.5 py-2.5 text-xs",
  md: "min-h-[46px] px-4 py-3 text-sm",
};

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
  fieldSize?: FieldSize;
  /** Beri ruang untuk ikon di sisi kiri (ikon tetap dirender pemanggil). */
  withIcon?: boolean;
  invalid?: boolean;
}

function renderInput(
  { fieldSize = "md", withIcon = false, invalid = false, className, ...rest }: InputProps,
  border: string,
  invalidBorder: string
) {
  return (
    <input
      {...rest}
      className={cn(BASE, invalid ? invalidBorder : border, SIZES[fieldSize], withIcon && "pl-10", className)}
      aria-invalid={invalid || rest["aria-invalid"] || undefined}
    />
  );
}

export default function Input(props: InputProps) {
  return renderInput(props, FIELD_BORDER, FIELD_INVALID_BORDER);
}

export function BackOfficeInput(props: InputProps) {
  return renderInput(props, BACK_OFFICE_BORDER, FIELD_INVALID_BORDER);
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  fieldSize?: FieldSize;
  invalid?: boolean;
  withIcon?: boolean;
}

function renderTextarea(
  { fieldSize = "md", invalid = false, withIcon = false, className, rows, ...rest }: TextareaProps,
  border: string,
  invalidBorder: string
) {
  return (
    <textarea
      {...rest}
      className={cn(
        BASE,
        invalid ? invalidBorder : border,
        SIZES[fieldSize],
        withIcon && "pl-10",
        "resize-y leading-relaxed",
        rows === undefined && "min-h-[7.5rem]",
        className
      )}
      aria-invalid={invalid || rest["aria-invalid"] || undefined}
      rows={rows}
    />
  );
}

export function Textarea(props: TextareaProps) {
  return renderTextarea(props, FIELD_BORDER, FIELD_INVALID_BORDER);
}

export function BackOfficeTextarea(props: TextareaProps) {
  return renderTextarea(props, BACK_OFFICE_BORDER, FIELD_INVALID_BORDER);
}
