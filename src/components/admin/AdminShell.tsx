"use client";

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
            className="fixed left-0 top-4 z-40 hidden h-9 w-9 items-center justify-center rounded-r-xl border border-l-0 border-orange-700/20 bg-orange-600 text-white shadow-lg shadow-orange-600/25 transition-all hover:w-10 hover:bg-orange-700 lg:flex"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}

        {/* Area kerja: margin kiri 16rem saat sidebar terbuka, 0 saat ditutup.
          Transisi margin membuat konten melebar mulus ke 100% lebar layar. */}
        <div
          className={`flex-1 flex flex-col min-w-0 w-full transition-[margin-left] duration-300 ease-in-out ${
            collapsed ? "lg:ml-0" : "lg:ml-64"
          }`}
        >
          <main className="flex-1 flex flex-col min-w-0 w-full">
            <PageAccessGate>{children}</PageAccessGate>
          </main>
        </div>
      </AdminShellContext.Provider>
    </AdminDialogProvider>
  );
}
