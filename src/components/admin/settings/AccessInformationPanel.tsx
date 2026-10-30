"use client";

import { CircleAlert, Info } from "lucide-react";
import PermissionSummary from "./PermissionSummary";
import type { PagePermissions } from "@/lib/internalAccess";

const points = [
  "Akun hanya dapat mengakses halaman internal.",
  "Pilih role sesuai tanggung jawab pengguna.",
  "Hak akses dapat diatur per halaman dan tindakan.",
  "Semua aktivitas tercatat di log aktivitas.",
];

export default function AccessInformationPanel({
  permissions,
  active,
  onShowDetail,
}: {
  permissions: PagePermissions;
  active: boolean;
  onShowDetail?: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] p-3.5 text-xs leading-relaxed text-[#9A3412] dark:border-orange-500/20 dark:bg-orange-500/5 dark:text-orange-200">
        <CircleAlert className="mt-0.5 size-4 shrink-0 text-[#EA580C]" aria-hidden="true" />
        <p>
          Akun admin hanya dapat mengakses halaman internal dan tidak dapat mengakses halaman yang bersifat publik
          (website).
        </p>
      </div>

      <PermissionSummary permissions={permissions} active={active} onShowDetail={onShowDetail} />

      <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B] text-white">
            <Info className="size-4" aria-hidden="true" />
          </span>
          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">Informasi Penting</h3>
        </div>
        <ol className="mt-3 space-y-2.5 text-xs leading-relaxed text-[#64748B] dark:text-slate-300">
          {points.map((point, index) => (
            <li key={point} className="flex items-start gap-2.5">
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#FF4D00] text-[9px] font-bold text-white">
                {index + 1}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
