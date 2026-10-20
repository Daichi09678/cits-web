"use client";

import { useEffect, useState } from "react";
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
  ShieldCheck,
  LayoutTemplate,
  Briefcase,
} from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import { useCitsStore } from "@/stores/citsStore";
import { subscribeAdminSidebar } from "@/lib/adminSidebar";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useAdminAuth();
  const { products, messages, caseStudies } = useCitsStore();

  // Sidebar off-canvas di mobile/tablet, tetap statis di desktop.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    return subscribeAdminSidebar((open) => setSidebarOpen((prev) => (typeof open === "boolean" ? open : !prev)));
  }, []);
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const unreadMessagesCount = messages.filter((m) => m.status === "unread").length;
  const activeProductsCount = products.filter((p) => p.isActive).length;
  const activeCaseStudiesCount = caseStudies.filter((c) => c.isActive !== false).length;

  const navItems = [
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
    },
    {
      title: "Produk Kami",
      href: "/admin/products",
      icon: Package,
      badge: `${activeProductsCount} Aktif`,
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    {
      title: "Portofolio Kami",
      href: "/admin/portfolio",
      icon: Briefcase,
      badge: `${activeCaseStudiesCount} Kasus`,
      badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 font-semibold",
    },
    {
      title: "Tentang Kami",
      href: "/admin/about",
      icon: Building2,
    },
    {
      title: "Hubungi Kami",
      href: "/admin/contact",
      icon: Mail,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} Baru` : undefined,
      badgeColor: "bg-orange-500 text-white font-bold animate-pulse",
    },
    {
      title: "Layanan CITS",
      href: "/admin/services",
      icon: Cpu,
    },
    {
      title: "Mitra Klien",
      href: "/admin/clients",
      icon: Handshake,
    },
    {
      title: "Pengaturan",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Overlay gelap saat drawer terbuka (hanya mobile/tablet) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${sidebarOpen ? "flex" : "hidden"} lg:flex fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto bg-white dark:bg-[#151528] border-r border-slate-200/90 dark:border-white/10 flex-col justify-between select-none ${
          sidebarOpen ? "shadow-2xl" : ""
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="p-4 border-b border-slate-100 dark:border-white/5">
            <Link href="/admin" className="block">
              <div className="flex items-center justify-between mb-1.5">
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
                  Admin
                </span>
              </div>
              <span className="block text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                Sistem Manajemen Konten
              </span>
            </Link>
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

                return (
                  <Link
                    key={item.href}
                    href={item.href}
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
                            : "text-slate-600 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400"
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badgeColor || "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
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

          {/* User Info Bar */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                AD
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {session?.user.name || "Administrator"}
                </span>
                <span className="block text-[10px] text-slate-600 dark:text-slate-200 truncate">
                  {session?.user.email || "admin@cits.id"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Keluar dari Admin"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
