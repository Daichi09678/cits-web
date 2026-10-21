"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Building2,
  Mail,
  Cpu,
  Handshake,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  LayoutTemplate,
  Briefcase,
  PanelLeftClose,
  Lock,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import { useCitsStore } from "@/stores/citsStore";
import { useAdminShell } from "@/components/admin/AdminShell";
import { EDITABLE_PAGES, isSuperadminRole, type PageKey } from "@/lib/internalAccess";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  pageKey?: PageKey;
  badge?: string;
  badgeColor?: string;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useAdminAuth();
  const { products, messages, caseStudies } = useCitsStore();
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useAdminShell();

  // Drawer mobile selalu tertutup saat berpindah halaman.
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  // Tutup drawer dengan tombol Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobile]);

  const unreadMessagesCount = messages.filter((m) => m.status === "unread").length;
  const activeProductsCount = products.filter((p) => p.isActive).length;
  const activeCaseStudiesCount = caseStudies.filter((c) => c.isActive !== false).length;

  const roleLabel = (session?.user.role || "").toLowerCase().includes("super") ? "Superadmin" : "Admin Internal";
  const isSuperadmin = isSuperadminRole(session?.user.role);
  const allowedPages = new Set<PageKey>(session?.user.pageAccess || []);
  const lockedPageKeys = new Set<PageKey>(
    isSuperadmin ? [] : EDITABLE_PAGES.filter((page) => !allowedPages.has(page.key)).map((page) => page.key)
  );

  const allNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Beranda",
      href: "/admin/landing",
      icon: LayoutTemplate,
      pageKey: "landing",
    },
    {
      title: "Produk Kami",
      href: "/admin/products",
      icon: Package,
      pageKey: "products",
      badge: `${activeProductsCount} Aktif`,
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    {
      title: "Portofolio Kami",
      href: "/admin/portfolio",
      icon: Briefcase,
      pageKey: "portfolio",
      badge: `${activeCaseStudiesCount} Kasus`,
      badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 font-semibold",
    },
    {
      title: "Tentang Kami",
      href: "/admin/about",
      icon: Building2,
      pageKey: "about",
    },
    {
      title: "Hubungi Kami",
      href: "/admin/contact",
      icon: Mail,
      pageKey: "contact",
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} Baru` : undefined,
      badgeColor: "bg-orange-500 text-white font-bold animate-pulse",
    },
    {
      title: "Layanan CITS",
      href: "/admin/services",
      icon: Cpu,
      pageKey: "services",
    },
    {
      title: "Mitra Klien",
      href: "/admin/clients",
      icon: Handshake,
      pageKey: "clients",
    },
    {
      title: "Pengaturan",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const navItems = allNavItems;

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Overlay gelap saat drawer terbuka (hanya mobile/tablet) */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      <aside
        id="admin-sidebar"
        aria-label="Navigasi Back Office"
        aria-hidden={!mobileOpen && collapsed ? true : undefined}
        className={`fixed top-0 left-0 z-40 flex h-screen w-64 flex-col justify-between overflow-y-auto bg-white dark:bg-[#151528] border-r border-slate-200/90 dark:border-white/10 select-none transition-transform duration-300 ease-in-out will-change-transform ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } ${collapsed ? "lg:-translate-x-full" : "lg:translate-x-0"}`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="relative p-4 border-b border-slate-100 dark:border-white/5">
            <Link href="/admin" className="block pr-9">
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1.5">
                <Image
                  src="/logo.webp"
                  alt="CITS Indonesia"
                  width={130}
                  height={38}
                  unoptimized
                  className="h-8 w-auto block dark:hidden"
                  priority
                />
                <Image
                  src="/logo-dark.webp"
                  alt="CITS Indonesia"
                  width={130}
                  height={38}
                  unoptimized
                  className="h-8 w-auto hidden dark:block"
                  priority
                />
                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {roleLabel}
                </span>
              </div>
              <span className="block text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                Sistem Manajemen Konten
              </span>
            </Link>

            {/* Tutup drawer di mobile */}
            <button
              type="button"
              onClick={closeMobile}
              title="Tutup menu"
              aria-label="Tutup menu navigasi"
              className="lg:hidden absolute right-3 top-3.5 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Collapse sidebar di desktop */}
            <button
              type="button"
              onClick={toggleCollapsed}
              title="Sembunyikan sidebar"
              aria-label="Sembunyikan sidebar"
              aria-controls="admin-sidebar"
              aria-expanded={!collapsed}
              className="hidden lg:inline-flex absolute right-3 top-3.5 p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:text-slate-300 dark:hover:text-orange-400 dark:hover:bg-orange-500/10 transition-colors"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Link to Front Office */}
          <div className="px-4 pt-4 pb-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 border border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all font-medium group"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                <span>Buka Front Office</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-2">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-200 block mb-1">
              Menu Utama
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                const isLocked = item.pageKey ? lockedPageKeys.has(item.pageKey) : false;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isLocked ? "Hanya dapat dilihat — tidak ada izin edit" : undefined}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-orange-600 text-white shadow-sm shadow-orange-600/25 font-bold"
                        : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive
                            ? "text-white"
                            : isLocked
                              ? "text-slate-400 dark:text-slate-500"
                              : "text-slate-600 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400"
                        }`}
                      />
                      <span className={`truncate ${isLocked && !isActive ? "text-slate-500 dark:text-slate-400" : ""}`}>
                        {item.title}
                      </span>
                    </div>

                    {isLocked ? (
                      <span
                        className={`flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400"
                        }`}
                      >
                        <Lock className="h-2.5 w-2.5" />
                        Lihat
                      </span>
                    ) : item.badge ? (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badgeColor || "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom User Profile & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-white/5 space-y-3">
          {/* Shopeers-style banner card */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200/60 dark:border-orange-500/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Live Content Sync</span>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-200 leading-snug">
              Perubahan data di Back Office otomatis terhubung langsung ke Front Office.
            </p>
          </div>

          {/* Logout tanpa keterangan profil — profil dipindah ke header */}
          <button
            onClick={handleLogout}
            title="Keluar dari Admin"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-rose-900/40 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
            Keluar dari Akun
          </button>
        </div>
      </aside>
    </>
  );
}
