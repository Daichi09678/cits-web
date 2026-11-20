"use client";
import { adminAccent } from "@/components/pages/admin/accentStyles";
import { BackOfficeInput as Input } from "@/components/ui/Input";

import { X, Search } from "lucide-react";
import { PILLAR_ICON_OPTIONS } from "@/lib/serviceIcons";
import type { ServiceManagementEditorState } from "./useServiceManagementEditor";

export default function ServiceManagementIconPicker({ editor }: { editor: ServiceManagementEditorState }) {
  const {
    isIconPickerOpen,
    iconSearch,
    setIconSearch,
    setIconCategoryFilter,
    iconCategoryFilter,
    formIcon,
    setFormIcon,
    setIsIconPickerOpen,
    setHoveredIconOption,
    hoveredIconOption,
  } = editor;
  return (
    <>
      {isIconPickerOpen && (
        <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-[#121226] border border-orange-200/80 dark:border-orange-500/30 space-y-2.5 animate-in fade-in zoom-in-98 duration-150">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Pilih Ikon Layanan
              </span>
              <span className="text-[10px] text-slate-400">(Klik ikon untuk langsung memilih)</span>
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="Cari ikon..."
                fieldSize="sm"
                className="w-full"
                withIcon
              />
              {iconSearch && (
                <button
                  type="button"
                  onClick={() => setIconSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Kategori Ikon (Rapi tanpa horizontal scrollbar) */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {[
              { id: "Semua", label: "Semua" },
              { id: "Rekayasa & Software", label: "Software" },
              { id: "Infrastruktur & Cloud", label: "Cloud & Server" },
              { id: "Konsultansi & SPBE", label: "Konsultasi" },
              { id: "Keamanan & Dukungan", label: "Keamanan" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setIconCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                  iconCategoryFilter === cat.id
                    ? `${adminAccent} font-semibold shadow-xs`
                    : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid Ikon Lucide - Clean Square Buttons tanpa teks terpotong */}
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 p-2 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 max-h-36 overflow-y-auto">
            {PILLAR_ICON_OPTIONS.filter((opt) => {
              if (iconCategoryFilter !== "Semua" && opt.category !== iconCategoryFilter) return false;
              if (
                iconSearch &&
                !opt.name.toLowerCase().includes(iconSearch.toLowerCase()) &&
                !opt.label.toLowerCase().includes(iconSearch.toLowerCase())
              )
                return false;
              return true;
            }).map((opt) => {
              const IconComp = opt.icon;
              const isSelected = formIcon.toLowerCase() === opt.name.toLowerCase();
              return (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => {
                    setFormIcon(opt.name);
                    setIsIconPickerOpen(false);
                  }}
                  onMouseEnter={() => setHoveredIconOption(opt)}
                  onMouseLeave={() => setHoveredIconOption(null)}
                  className={`h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? `${adminAccent} shadow-md shadow-orange-600/30 scale-105`
                      : "text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-500/15 hover:text-orange-600 dark:hover:text-orange-400 hover:scale-105"
                  }`}
                  title={`${opt.label} (${opt.name})`}
                >
                  <IconComp className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Footer Keterangan & Tombol Tutup */}
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400">
            <div className="truncate pr-2">
              {hoveredIconOption ? (
                <span className="text-slate-900 dark:text-white font-medium">
                  Ikon: <strong className="text-orange-600 dark:text-orange-400">{hoveredIconOption.label}</strong> (
                  {hoveredIconOption.name})
                </span>
              ) : (
                <span>Arahkan kursor ke ikon untuk melihat fungsi & nama</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsIconPickerOpen(false)}
              className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white underline cursor-pointer shrink-0"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
