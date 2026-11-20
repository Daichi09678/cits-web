"use client";
import { adminAction } from "@/components/pages/admin/accentStyles";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PanelLeftOpen } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import PageAccessGate from "./PageAccessGate";
import AdminDialogProvider from "./AdminDialogProvider";
import AdminSessionSync from "./AdminSessionSync";

/**
 * Shell back office.
 *
 * Menyimpan dua state navigasi:
 * - `collapsed`  : sidebar desktop disembunyikan (konten melebar 100%).
 * - `mobileOpen` : drawer sidebar di mobile/tablet.
 *
 * State desktop dipersist ke localStorage supaya preferensi tim internal tetap
 * sama saat berpindah halaman maupun setelah reload.
 */
const SIDEBAR_COLLAPSED_KEY = "cits_admin_sidebar_collapsed";

interface AdminShellContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
}

const noop = () => {};

const AdminShellContext = createContext<AdminShellContextValue>({
  collapsed: false,
  toggleCollapsed: noop,
  mobileOpen: false,
  openMobile: noop,
  closeMobile: noop,
});

export function useAdminShell(): AdminShellContextValue {
  return useContext(AdminShellContext);
}

function readCollapsedPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  // AdminShell hanya dirender setelah sesi selesai dimuat (client-side), jadi
  // membaca localStorage pada initializer tidak menimbulkan hydration mismatch.
  const [collapsed, setCollapsed] = useState<boolean>(readCollapsedPreference);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
      // localStorage bisa diblokir (mode privat) — state tetap jalan di memori.
    }
    document.documentElement.classList.toggle("admin-sidebar-collapsed", collapsed);
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => setCollapsed((value) => !value), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const value = useMemo<AdminShellContextValue>(
    () => ({ collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile }),
    [collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile]
  );

  return (
    <AdminDialogProvider>
      <AdminShellContext.Provider value={value}>
        <AdminSessionSync />
        <a href="#admin-content" className="skip-link" inert={mobileOpen}>
          Lewati ke konten utama
        </a>
        <AdminSidebar />

        {/* Handle kecil di tepi kiri saat sidebar ditutup — bukan tombol di header
          setiap halaman, sehingga header tetap bersih. */}
        {collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            title="Tampilkan sidebar"
            aria-label="Tampilkan sidebar"
            aria-controls="admin-sidebar"
            aria-expanded={false}
            className={`fixed left-0 top-[2.875rem] z-50 hidden h-8 w-8 items-center justify-center rounded-r-lg border border-l-0 border-orange-700/20 ${adminAction} shadow-md shadow-orange-600/25 transition-all hover:w-9 lg:flex`}
          >
            <PanelLeftOpen className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Area kerja: margin kiri 16rem saat sidebar terbuka, 0 saat ditutup.
          Transisi margin membuat konten melebar mulus ke 100% lebar layar. */}
        <div
          className={`flex-1 flex flex-col min-w-0 w-full transition-[margin-left] duration-300 ease-in-out motion-reduce:transition-none ${
            collapsed ? "lg:ml-0" : "lg:ml-64"
          }`}
        >
          <main id="admin-content" tabIndex={-1} inert={mobileOpen} className="flex-1 flex flex-col min-w-0 w-full">
            <PageAccessGate>{children}</PageAccessGate>
          </main>
        </div>
      </AdminShellContext.Provider>
    </AdminDialogProvider>
  );
}
