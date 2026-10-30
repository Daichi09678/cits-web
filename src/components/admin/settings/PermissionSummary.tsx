import { Eye, Layers, Lock, ShieldCheck } from "lucide-react";
import { EDITABLE_PAGES, type PagePermissions } from "@/lib/internalAccess";

export default function PermissionSummary({
  permissions,
  active,
  onShowDetail,
}: {
  permissions: PagePermissions;
  active: boolean;
  onShowDetail?: () => void;
}) {
  const modules = Object.keys(permissions).length;
  return (
    <section
      aria-label="Ringkasan hak akses"
      className="rounded-xl border border-[#E2E8F0] bg-white p-4 dark:border-white/10 dark:bg-[#151528]"
    >
      <div className="flex items-start gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-white">
          <Eye className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">Ringkasan Akses</h3>
          <p className="mt-0.5 text-[11px] leading-relaxed text-[#64748B]">Preview hak akses yang akan diberikan.</p>
        </div>
      </div>

      <dl
        aria-live="polite"
        className="mt-4 divide-y divide-[#E2E8F0] border-t border-[#E2E8F0] pt-1 text-xs dark:divide-white/5 dark:border-white/5"
      >
        <div className="flex items-center justify-between gap-3 py-2.5">
          <dt className="flex items-center gap-2 text-[#64748B]">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Role
          </dt>
          <dd>
            <span className="rounded-md bg-[#FFF1E9] px-2 py-0.5 text-[11px] font-semibold text-[#C2410C] dark:bg-orange-500/10 dark:text-orange-300">
              Admin Internal
            </span>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 py-2.5">
          <dt className="flex items-center gap-2 text-[#64748B]">
            <Layers className="size-3.5" aria-hidden="true" />
            Total Modul Dipilih
          </dt>
          <dd className="flex items-center gap-2">
            <span className="font-semibold text-[#0F172A] dark:text-slate-100">
              {modules} dari {EDITABLE_PAGES.length} modul
            </span>
            {onShowDetail && (
              <button
                type="button"
                onClick={onShowDetail}
                className="text-[11px] font-semibold text-[#2563EB] hover:underline"
              >
                Lihat Detail →
              </button>
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 py-2.5">
          <dt className="flex items-center gap-2 text-[#64748B]">
            <Lock className="size-3.5" aria-hidden="true" />
            Akses Website
          </dt>
          <dd>
            <span className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">
              Tidak Dapat Diakses
            </span>
          </dd>
        </div>
      </dl>

      <p className="mt-1 border-t border-[#E2E8F0] pt-2.5 text-[11px] text-[#64748B] dark:border-white/5">
        Status akun:{" "}
        <span
          className={active ? "font-semibold text-emerald-700 dark:text-emerald-400" : "font-semibold text-[#64748B]"}
        >
          {active ? "Aktif" : "Nonaktif"}
        </span>
      </p>
    </section>
  );
}
