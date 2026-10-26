"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/auth";
import { canAccessPage, getPageKeyFromPathname } from "@/lib/internalAccess";

export default function PageAccessGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading } = useAdminAuth();
  const allowed = canAccessPage(session?.user, getPageKeyFromPathname(pathname));

  useEffect(() => {
    if (!loading && session && !allowed) router.replace("/admin");
  }, [loading, session, allowed, router]);

  // Konten tanpa izin tidak dirender, termasuk selama perpindahan halaman.
  if (loading || (session && !allowed)) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <div role="status" className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          {loading ? "Memeriksa akses halaman..." : "Mengalihkan ke dashboard..."}
        </div>
      </div>
    );
  }

  if (!session) return null;
  return <>{children}</>;
}
