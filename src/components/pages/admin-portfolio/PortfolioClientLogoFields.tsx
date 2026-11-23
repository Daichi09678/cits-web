"use client";
import { BackOfficeInput as Input } from "@/components/ui/Input";
import FieldLabel from "@/components/ui/FieldLabel";

import Image from "next/image";
import { Upload, Building2 } from "lucide-react";
import { PRESET_LOGOS } from "./constants";
import type { PortfolioEditorState } from "./usePortfolioEditor";

export default function PortfolioClientLogoFields({ editor }: { editor: PortfolioEditorState }) {
  const { formClientLogo, fileInputRef, handleLogoUpload, setFormClientLogo, formClientShort, setFormClientShort } =
    editor;
  return (
    <div>
      <FieldLabel htmlFor="portfolio-client-logo-fields-form-client-logo" fieldSize="sm">
        Logo Instansi Klien
      </FieldLabel>
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1A1A2E] border border-slate-200 dark:border-white/10 p-1.5 flex items-center justify-center shrink-0">
          {formClientLogo ? (
            <Image
              src={formClientLogo}
              alt="Logo Preview"
              width={40}
              height={40}
              unoptimized
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <Building2 className="w-6 h-6 text-slate-400" />
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handleLogoUpload} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-accent dark:text-orange-300 font-bold text-[11px] cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Logo dari Komputer</span>
          </button>
          <Input
            type="text"
            value={formClientLogo}
            onChange={(e) => setFormClientLogo(e.target.value)}
            placeholder="/clients/kemendagri.svg atau URL"
            fieldSize="sm"
            className="w-full"
            id="portfolio-client-logo-fields-form-client-logo"
          />
        </div>
      </div>

      {/* Preset quick picker */}
      <div className="mt-1.5 flex flex-wrap gap-1">
        {PRESET_LOGOS.slice(0, 8).map((p) => (
          <button
            key={p.logo}
            type="button"
            onClick={() => {
              setFormClientLogo(p.logo);
              if (!formClientShort) setFormClientShort(p.name);
            }}
            className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-orange-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {p.name.replace("Kementerian ", "Kemen. ")}
          </button>
        ))}
      </div>
    </div>
  );
}
