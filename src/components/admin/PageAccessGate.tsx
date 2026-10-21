"use client";

import { usePathname } from "next/navigation";
import { Eye, Lock } from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import { EDITABLE_PAGES, getPageKeyFromPathname, isSuperadminRole, type PageKey } from "@/lib/internalAccess";

export default function PageAccessGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, loading } = useAdminAuth();

  // Jangan pernah merender konten editable sebelum status akses diketahui.
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          Memeriksa akses halaman...
        </div>
      </div>
    );
  }

  if (!session) return null;

  const role = session.user.role;
  const pageAccess = session.user.pageAccess ?? [];

  // Superadmin bebas mengakses seluruh halaman.
  if (isSuperadminRole(role)) return <>{children}</>;

  // Halaman Pengaturan dapat dibuka semua admin, tetapi untuk Admin Internal
  // halaman ini hanya menampilkan tab Keamanan (lihat settings/page.tsx).
  // Pengelolaan akun tetap dijaga oleh API khusus Superadmin.

  const pageKey = getPageKeyFromPathname(pathname);

  // Dashboard dan halaman non-konten tidak memerlukan izin edit.
  if (!pageKey) return <>{children}</>;

  if (pageAccess.includes(pageKey)) return <>{children}</>;

  const allowedPages = EDITABLE_PAGES.filter((page) => pageAccess.includes(page.key as PageKey));

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-col gap-2 border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 sm:flex-row sm:items-center sm:justify-between dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
            <Lock className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-xs font-extrabold">Mode hanya lihat — halaman ini tidak dapat diedit</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200/90">
              Akun internal Anda tidak memiliki izin mengubah halaman ini. Halaman yang diizinkan:{" "}
              {allowedPages.length > 0 ? allowedPages.map((page) => page.label).join(", ") : "belum ada"}. Hubungi
              Superadmin untuk mengubahnya.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:border-amber-500/30 dark:bg-black/10 dark:text-amber-200">
          <Eye className="h-3 w-3" /> Read-only
        </span>
      </div>

      <div
        inert
        aria-disabled="true"
        className="pointer-events-none flex min-w-0 flex-1 select-none flex-col opacity-60"
      >
        {children}
      </div>
    </div>
  );
}
