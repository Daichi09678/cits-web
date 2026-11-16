"use client";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FieldLabel from "@/components/ui/FieldLabel";

import { SECTOR_OPTIONS } from "./constants";
import type { PortfolioEditorState } from "./usePortfolioEditor";

export default function PortfolioAssignmentFields({ editor }: { editor: PortfolioEditorState }) {
  const { formSector, setFormSector, formCategoryTag, setFormCategoryTag, formPeriod, setFormPeriod } = editor;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <FieldLabel htmlFor="portfolio-assignment-fields-form-sector" fieldSize="sm">
          Sektor Penugasan
        </FieldLabel>
        <Select
          value={formSector}
          onChange={(e) => setFormSector(e.target.value)}
          selectSize="sm"
          className="w-full"
          id="portfolio-assignment-fields-form-sector"
        >
          {SECTOR_OPTIONS.map((sec) => (
            <option key={sec} value={sec} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              {sec}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <FieldLabel htmlFor="portfolio-assignment-fields-form-category-tag" fieldSize="sm">
          Kategori Spesifik
        </FieldLabel>
        <Input
          type="text"
          value={formCategoryTag}
          onChange={(e) => setFormCategoryTag(e.target.value)}
          placeholder="cth. Kependudukan & Identitas Digital"
          fieldSize="sm"
          className="w-full"
          id="portfolio-assignment-fields-form-category-tag"
        />
      </div>

      <div>
        <FieldLabel htmlFor="portfolio-assignment-fields-form-period" fieldSize="sm">
          Periode Penugasan
        </FieldLabel>
        <Input
          type="text"
          value={formPeriod}
          onChange={(e) => setFormPeriod(e.target.value)}
          placeholder="cth. Multi-Tahun (Operasional Aktif)"
          fieldSize="sm"
          className="w-full"
          id="portfolio-assignment-fields-form-period"
        />
      </div>
    </div>
  );
}
