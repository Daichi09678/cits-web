"use client";

import { useId, useRef, type ReactNode } from "react";
import Image from "next/image";
import { ImageOff, Trash2, Upload } from "lucide-react";
import { EMPTY_ABOUT_LOGO } from "@/lib/aboutEditor";
import { validContentAddress } from "@/lib/publicPageContent";

export const aboutInputClass =
  "w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:cursor-not-allowed dark:border-white/15 dark:bg-[#151528] dark:text-slate-100";
export const aboutSecondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5";

export function AboutField({
  label,
  hint,
  value,
  onChange,
  multiline = false,
  maxLength = 8000,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <div className={`min-w-0 ${multiline ? "sm:col-span-2" : ""}`}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-slate-900 dark:text-slate-100">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mb-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
      {multiline ? (
        <>
          <textarea
            id={id}
            aria-describedby={hint ? `${id}-hint` : undefined}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={3}
            maxLength={maxLength}
            className={`${aboutInputClass} resize-y`}
          />
          <span className="mt-1 block text-right text-xs tabular-nums text-slate-500">
            {value.length.toLocaleString("id-ID")} / {maxLength.toLocaleString("id-ID")}
          </span>
        </>
      ) : (
        <input
          id={id}
          type="text"
          aria-describedby={hint ? `${id}-hint` : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={maxLength}
          className={aboutInputClass}
        />
      )}
    </div>
  );
}

export function AboutFieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      <div className="grid min-w-0 gap-x-6 gap-y-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function AboutLogoField({
  dark,
  value,
  alt,
  onChange,
  onReading,
  onError,
}: {
  dark?: boolean;
  value: string;
  alt: string;
  onChange: (value: string, alt: string) => void;
  onReading: (reading: boolean) => void;
  onError: (error: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();
  const label = dark ? "Logo alternatif (tampilan gelap)" : "Logo utama (tampilan terang)";
  const visible = value !== EMPTY_ABOUT_LOGO && validContentAddress(value, true);
  return (
    <div className="relative min-w-0">
      <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{label}</p>
      <p className="mt-1 text-xs text-slate-500">Logo yang ditampilkan di tema {dark ? "gelap" : "terang"}.</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <div
          className={`flex h-16 min-w-32 flex-1 items-center justify-center overflow-hidden rounded-lg border px-4 ${dark ? "border-slate-800 bg-[#0F172A]" : "border-slate-200 bg-white"}`}
        >
          {visible ? (
            <Image
              src={value}
              alt={alt || label}
              width={180}
              height={52}
              unoptimized
              className="max-h-12 w-auto max-w-full object-contain"
            />
          ) : (
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <ImageOff className="size-4" />
              Belum ada logo
            </span>
          )}
        </div>
        <input
          id={id}
          ref={ref}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          aria-label={`Unggah ${label}`}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
              onError("Gunakan logo PNG, JPG, atau WebP dengan ukuran maksimal 2 MB.");
              event.target.value = "";
              return;
            }
            onReading(true);
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                onChange(reader.result, alt || "Logo CITS Indonesia");
                onError("");
              }
              onReading(false);
            };
            reader.onerror = () => {
              onReading(false);
              onError("Logo gagal dibaca. Silakan pilih kembali.");
            };
            reader.readAsDataURL(file);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={aboutSecondaryButton}
          aria-label={`Ganti ${label}`}
        >
          <Upload className="size-4" />
          Ganti Logo
        </button>
        <button
          type="button"
          disabled={!visible}
          onClick={() => onChange(EMPTY_ABOUT_LOGO, "")}
          aria-label={`Hapus ${label}`}
          className={`${aboutSecondaryButton} !px-3 text-slate-500 hover:text-red-600`}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
        PNG, JPG, atau WebP, maksimal 2 MB. Disarankan 300 × 100 px.
      </p>
      <details className="mt-3 text-xs text-slate-500">
        <summary className="w-fit cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-orange-500">
          Alamat dan keterangan logo
        </summary>
        <div className="mt-3 space-y-3">
          <AboutField
            label={`Alamat ${dark ? "logo gelap" : "logo terang"}`}
            hint="Gunakan alamat gambar yang sudah tersedia, atau unggah melalui Ganti Logo."
            value={value.startsWith("data:") ? "" : value}
            onChange={(address) => onChange(address, alt)}
          />
          <AboutField
            label={`Teks alternatif ${dark ? "logo gelap" : "logo terang"}`}
            hint="Keterangan logo untuk pengguna pembaca layar."
            value={alt}
            onChange={(next) => onChange(value, next)}
          />
        </div>
      </details>
    </div>
  );
}
