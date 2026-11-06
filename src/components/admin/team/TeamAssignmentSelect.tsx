"use client";

import { useState } from "react";
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
  const [creating, setCreating] = useState(false);
  const choices = [
    ...new Set([...options, ...(!creating && value ? [value] : [])].map((item) => item.trim()).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "id"));

  return (
    <div className="min-w-0 sm:col-span-2">
      <label htmlFor={id} className="block text-xs font-medium">
        {label} {required && <span className="text-red-700 dark:text-red-300">*</span>}
      </label>
      <select
        id={id}
        value={creating ? "new" : value ? `saved:${value}` : ""}
        required={required}
        onChange={(event) => {
          const next = event.target.value;
          setCreating(next === "new");
          onChange(next.startsWith("saved:") ? next.slice(6) : "");
        }}
        className={teamField}
        aria-describedby={`${id}-help`}
      >
        <option value="">{required ? `Pilih ${label.toLocaleLowerCase("id")}` : "Belum ditentukan"}</option>
        {choices.map((choice) => (
          <option key={choice} value={`saved:${choice}`}>
            {choice}
          </option>
        ))}
        <option value="new">+ {newLabel}</option>
      </select>
      {creating && (
        <div className="mt-3">
          <label htmlFor={`${id}-new`} className="block text-xs font-medium">
            {newFieldLabel}
          </label>
          <input
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
          : `Pilih ${label.toLocaleLowerCase("id")} yang sudah ada, atau tambahkan pilihan baru.`}
      </p>
    </div>
  );
}
