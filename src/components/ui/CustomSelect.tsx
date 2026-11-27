"use client";

import Select from "./Select";

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
    <Select
      value={value}
      defaultValue={value === undefined ? "" : undefined}
      onChange={(event) => onChange?.(event.target.value)}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : placeholder}
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
    </Select>
  );
}
