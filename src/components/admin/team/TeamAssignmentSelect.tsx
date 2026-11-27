"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { BackOfficeButton as Button } from "@/components/ui/Button";
import { BackOfficeSelect as Select } from "@/components/ui/Select";
import { teamField } from "./TeamDialog";

interface TeamAssignmentSelectProps {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  required?: boolean;
  maxLength: number;
  newLabel: string;
  newFieldLabel: string;
  placeholder: string;
}

export default function TeamAssignmentSelect({
  id,
  label,
  value,
  options,
  onChange,
  required = false,
  maxLength,
  newLabel,
  newFieldLabel,
  placeholder,
}: TeamAssignmentSelectProps) {
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const newInput = useRef<HTMLInputElement>(null);
  const creating = previousValue !== null;
  const fieldName = label.toLocaleLowerCase("id");
  const choices = [...new Set([...options, previousValue ?? value].map((item) => item.trim()).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "id")
  );

  useEffect(() => {
    if (creating) newInput.current?.focus();
  }, [creating]);

  return (
    <div className="min-w-0 sm:col-span-2">
      <label htmlFor={id} className="block text-xs font-medium">
        {label} {required && <span className="text-red-700 dark:text-red-300">*</span>}
      </label>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <Select
          id={id}
          value={creating ? "" : value.trim()}
          required={required && !creating}
          onChange={(event) => {
            setPreviousValue(null);
            onChange(event.currentTarget.value);
          }}
          selectSize="sm"
          className="min-h-11 text-sm"
          aria-describedby={`${id}-help`}
        >
          <option value="" hidden={required || creating} disabled={required || creating}>
            {creating ? newLabel : required ? `Pilih ${fieldName}` : "Belum ditentukan"}
          </option>
          {choices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </Select>
        <Button
          variant="secondary"
          size="icon"
          className="size-11 shrink-0"
          aria-label={creating ? `Batal tambah ${fieldName}` : newLabel}
          title={creating ? `Batal tambah ${fieldName}` : newLabel}
          aria-expanded={creating}
          aria-controls={creating ? `${id}-new` : undefined}
          onClick={() => {
            setPreviousValue(creating ? null : value);
            onChange(previousValue ?? "");
          }}
        >
          {creating ? <X aria-hidden="true" size={18} /> : <Plus aria-hidden="true" size={18} />}
        </Button>
      </div>
      {creating && (
        <div className="mt-3">
          <label htmlFor={`${id}-new`} className="block text-xs font-medium">
            {newFieldLabel}
          </label>
          <input
            ref={newInput}
            id={`${id}-new`}
            required
            maxLength={maxLength}
            pattern=".*\S.*"
            title="Isi nama pilihan, bukan hanya spasi."
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={teamField}
            aria-describedby={`${id}-help`}
          />
        </div>
      )}
      <p id={`${id}-help`} className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
        {creating
          ? "Pilihan baru tersedia untuk anggota lain setelah data ini disimpan."
          : `Pilih ${fieldName} yang sudah ada atau tekan tombol + untuk menambahkan pilihan baru.`}
      </p>
    </div>
  );
}
