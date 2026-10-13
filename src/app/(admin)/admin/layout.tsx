"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAdminAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !isLoginPage) {
        router.replace("/admin/login");
      } else if (isAuthenticated && isLoginPage) {
        router.replace("/admin");
      }
    }
  }, [isAuthenticated, loading, isLoginPage, router]);

  // If on login page, render plain without sidebar
  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-100 dark:bg-[#0F0F1A] text-slate-900 dark:text-white">{children}</div>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0F0F1A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Memuat CITS Back Office...
          </span>
        </div>
      </div>
    );
  }

  // Not authenticated yet
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#0F0F1A] text-slate-900 dark:text-white flex">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
