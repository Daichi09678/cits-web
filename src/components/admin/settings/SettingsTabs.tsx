"use client";

import { KeyRound, Users, Wrench } from "lucide-react";

export type SettingsTab = "accounts" | "security" | "maintenance";

const tabs = [
  { key: "accounts", label: "Akun & Hak Akses", icon: Users },
  { key: "security", label: "Keamanan", icon: KeyRound },
  { key: "maintenance", label: "Pemeliharaan", icon: Wrench },
] as const;

export default function SettingsTabs({
  value,
  onChange,
}: {
  value: SettingsTab;
  onChange: (tab: SettingsTab) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Pengaturan Back Office"
      className="flex w-full gap-1 rounded-lg border border-[#E2E8F0] bg-white p-1 dark:border-white/10 dark:bg-[#151528] sm:w-fit"
    >
      {tabs.map(({ key, label, icon: Icon }, index) => (
        <button
          key={key}
          id={`tab-${key}`}
          role="tab"
          aria-selected={value === key}
          aria-controls="settings-panel"
          tabIndex={value === key ? 0 : -1}
          type="button"
          onClick={() => onChange(key)}
          onKeyDown={(event) => {
            const next =
              event.key === "ArrowRight"
                ? (index + 1) % tabs.length
                : event.key === "ArrowLeft"
                  ? (index + tabs.length - 1) % tabs.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? tabs.length - 1
                      : null;
            if (next === null) return;
            event.preventDefault();
            onChange(tabs[next].key);
            document.getElementById(`tab-${tabs[next].key}`)?.focus();
          }}
          className={`flex min-h-9 flex-1 items-center justify-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4D00] sm:flex-none sm:px-4 sm:text-[13px] ${
            value === key
              ? "bg-[#FF4D00] text-white"
              : "text-[#0F172A] hover:bg-[#F8FAFC] dark:text-slate-300 dark:hover:bg-white/5"
          }`}
        >
          <Icon className="size-3.5 shrink-0" aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}
