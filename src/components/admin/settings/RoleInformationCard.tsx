import { Check, ShieldCheck, UserRound } from "lucide-react";
import { cardClass } from "./styles";

export default function RoleInformationCard({ superadmin = false }: { superadmin?: boolean }) {
  const Icon = superadmin ? ShieldCheck : UserRound;
  const lines = superadmin
    ? [
        "Memiliki akses ke seluruh halaman Back Office.",
        "Dapat membuat dan mengelola akun administrator.",
        "Dapat menentukan hak akses per halaman.",
        "Dapat mengelola keamanan dan pemeliharaan.",
      ]
    : [
        "Hanya mengakses halaman yang diberikan Superadmin.",
        "Halaman tanpa izin tidak muncul dalam navigasi.",
        "Hak akses dapat dibatasi berdasarkan tindakan.",
        "Tidak dapat mengakses pengaturan khusus Superadmin.",
      ];

  return (
    <article className={`${cardClass} flex flex-col p-5`}>
      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
            superadmin
              ? "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
              : "bg-[#FFF1E9] text-[#FF4D00] dark:bg-orange-500/10 dark:text-orange-300"
          }`}
        >
          <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-[#0F172A] dark:text-white">
            {superadmin ? "Superadmin" : "Admin Internal"}
          </h2>
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
              superadmin
                ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                : "bg-[#FFF1E9] text-[#C2410C] dark:bg-orange-500/10 dark:text-orange-300"
            }`}
          >
            {superadmin ? "Full Access" : "Custom Access"}
          </span>
        </div>
      </div>

      <ul className="mt-4 space-y-2.5 border-t border-[#E2E8F0] pt-4 text-xs leading-relaxed text-[#64748B] dark:border-white/5 dark:text-slate-400">
        {lines.map((line) => (
          <li key={line} className="flex items-start gap-2">
            <Check className="mt-0.5 size-3.5 shrink-0 text-[#94A3B8]" strokeWidth={2.2} aria-hidden="true" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
