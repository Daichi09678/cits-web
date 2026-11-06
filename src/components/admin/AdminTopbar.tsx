"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  UserRound,
  X,
  Package,
  Cpu,
  Briefcase,
  Building2,
  Mail,
  Compass,
  ChevronRight,
} from "lucide-react";
import { useCitsStore } from "@/stores/citsStore";
import { useAdminShell } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/lib/auth";
import { canAccessPage, type PageKey } from "@/lib/internalAccess";
import UserAvatar from "@/components/admin/UserAvatar";

interface AdminTopbarProps {
  title: string;
  description?: string;
}

interface AdminSearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: "Produk" | "Layanan" | "Portofolio" | "Klien" | "Pesan" | "Halaman";
  href: string;
  icon: typeof Package;
  badgeClass: string;
}

const ADMIN_PAGES: Array<{
  title: string;
  href: string;
  pageKey?: PageKey;
}> = [
  { title: "Dashboard", href: "/admin" },
  { title: "Produk Kami", href: "/admin/products", pageKey: "products" },
  { title: "Layanan CITS", href: "/admin/services", pageKey: "services" },
  { title: "Portofolio & Studi Kasus", href: "/admin/portfolio", pageKey: "portfolio" },
  { title: "Klien & Partner", href: "/admin/clients", pageKey: "clients" },
  { title: "Pesan Masuk (Inbox)", href: "/admin/contact", pageKey: "contact" },
  { title: "Tim CITS", href: "/admin/team", pageKey: "team" },
  { title: "Konten Beranda", href: "/admin/landing", pageKey: "landing" },
  { title: "Tentang Kami", href: "/admin/about", pageKey: "about" },
  { title: "Profil Akun", href: "/admin/profile" },
  { title: "Manajemen Akun Internal", href: "/admin/settings" },
  { title: "Keamanan Akun", href: "/admin/settings/security" },
];

export default function AdminTopbar({ title, description }: AdminTopbarProps) {
  const router = useRouter();
  const { messages, products, services, caseStudies, clients } = useCitsStore();
  const { mobileOpen, openMobile } = useAdminShell();
  const { session } = useAdminAuth();
  const canSeeInbox = canAccessPage(session?.user, "contact");

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const unreadMessages = messages.filter((m) => m.status === "unread");

  // Close menus on outside click
  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  // Shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (window.innerWidth < 768) {
          setShowMobileSearch(true);
        } else {
          searchInputRef.current?.focus();
          setShowSearchDropdown(true);
        }
      }
      if (e.key === "Escape") {
        setShowSearchDropdown(false);
        setShowMobileSearch(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Focus input when mobile search opens
  useEffect(() => {
    if (showMobileSearch) {
      setTimeout(() => mobileInputRef.current?.focus(), 50);
    }
  }, [showMobileSearch]);

  // Search Results computation
  const searchResults = useMemo<AdminSearchResult[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: AdminSearchResult[] = [];

    // Pages
    for (const page of ADMIN_PAGES) {
      if (!page.pageKey || canAccessPage(session?.user, page.pageKey)) {
        if (page.title.toLowerCase().includes(q)) {
          results.push({
            id: `page-${page.href}`,
            title: page.title,
            subtitle: "Halaman Admin",
            category: "Halaman",
            href: page.href,
            icon: Compass,
            badgeClass: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",
          });
        }
      }
    }

    // Products
    if (canAccessPage(session?.user, "products")) {
      for (const prod of products) {
        if (
          prod.name.toLowerCase().includes(q) ||
          prod.category.toLowerCase().includes(q) ||
          prod.description.toLowerCase().includes(q)
        ) {
          results.push({
            id: `product-${prod.id}`,
            title: prod.name,
            subtitle: prod.category,
            category: "Produk",
            href: "/admin/products",
            icon: Package,
            badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
          });
        }
      }
    }

    // Services
    if (canAccessPage(session?.user, "services")) {
      for (const srv of services) {
        if (
          srv.title.toLowerCase().includes(q) ||
          (srv.category && srv.category.toLowerCase().includes(q)) ||
          (srv.desc && srv.desc.toLowerCase().includes(q)) ||
          (srv.details && srv.details.toLowerCase().includes(q))
        ) {
          results.push({
            id: `service-${srv.id}`,
            title: srv.title,
            subtitle: srv.category || "Layanan",
            category: "Layanan",
            href: "/admin/services",
            icon: Cpu,
            badgeClass: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
          });
        }
      }
    }

    // Portfolio
    if (canAccessPage(session?.user, "portfolio")) {
      for (const study of caseStudies) {
        if (
          study.title.toLowerCase().includes(q) ||
          study.client.toLowerCase().includes(q) ||
          (study.clientShort && study.clientShort.toLowerCase().includes(q)) ||
          study.sector.toLowerCase().includes(q)
        ) {
          results.push({
            id: `study-${study.id}`,
            title: study.title,
            subtitle: `${study.client} (${study.sector})`,
            category: "Portofolio",
            href: "/admin/portfolio",
            icon: Briefcase,
            badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
          });
        }
      }
    }

    // Clients
    if (canAccessPage(session?.user, "clients")) {
      for (const client of clients) {
        if (client.name.toLowerCase().includes(q) || (client.category && client.category.toLowerCase().includes(q))) {
          results.push({
            id: `client-${client.id}`,
            title: client.name,
            subtitle: client.category || "Klien Partner",
            category: "Klien",
            href: "/admin/clients",
            icon: Building2,
            badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
          });
        }
      }
    }

    // Messages
    if (canAccessPage(session?.user, "contact")) {
      for (const msg of messages) {
        if (
          msg.name.toLowerCase().includes(q) ||
          msg.email.toLowerCase().includes(q) ||
          msg.message.toLowerCase().includes(q) ||
          (msg.serviceRequested && msg.serviceRequested.toLowerCase().includes(q)) ||
          (msg.company && msg.company.toLowerCase().includes(q))
        ) {
          results.push({
            id: `msg-${msg.id}`,
            title: msg.name,
            subtitle: `${msg.company ? `${msg.company} • ` : ""}${msg.email}`,
            category: "Pesan",
            href: "/admin/contact",
            icon: Mail,
            badgeClass: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
          });
        }
      }
    }

    return results.slice(0, 15);
  }, [searchQuery, session, products, services, caseStudies, clients, messages]);

  const handleNavigate = (href: string) => {
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
    setSearchQuery("");
    router.push(href);
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    if (typeof document !== "undefined") {
      const isDark = document.documentElement.classList.toggle("dark");
      try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch {}
    }
  };

  return (
    <header className="h-16 w-full shrink-0 px-4 sm:px-6 lg:px-8 gap-3 bg-white/90 dark:bg-[#151528]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Mobile Hamburger + Title */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Buka drawer navigasi di mobile/tablet */}
        <button
          type="button"
          onClick={openMobile}
          title="Buka menu"
          aria-label="Buka menu navigasi"
          aria-controls="admin-sidebar"
          aria-expanded={mobileOpen}
          className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight truncate">
            {title}
          </h1>
          {description && (
            <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 truncate">{description}</p>
          )}
        </div>
      </div>

      {/* Right Controls (Search, Dark mode, Notifications, Profile) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Search Button (< 768px) */}
        <button
          type="button"
          onClick={() => setShowMobileSearch(true)}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0"
          title="Cari data"
          aria-label="Cari data admin"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Desktop Search Bar (>= 768px) */}
        <div className="relative hidden md:block w-48 sm:w-56 md:w-60 lg:w-72 xl:w-80" ref={searchContainerRef}>
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Cari data, produk, pesan..."
            className="w-full pl-9 pr-12 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-white/15 pointer-events-none">
              ⌘K
            </kbd>
          )}

          {/* Desktop Search Results Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-2 z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500">
                <span>Hasil untuk &ldquo;{searchQuery}&rdquo;</span>
                <span className="font-semibold">{searchResults.length} ditemukan</span>
              </div>
              {searchResults.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">Tidak ditemukan data yang sesuai.</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-white/5 pt-1">
                  {searchResults.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigate(item.href)}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.badgeClass}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {item.title}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${item.badgeClass}`}>
                              {item.category}
                            </span>
                          </div>
                          {item.subtitle && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          title="Toggle Mode Gelap/Terang"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
          <Moon className="w-4 h-4 block dark:hidden text-slate-600" />
        </button>

        {/* Notifications Bell */}
        {canSeeInbox && (
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications((value) => !value);
                setShowProfile(false);
              }}
              title="Notifikasi Pesan"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadMessages.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-orange-600 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-[#151528]"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Pesan Masuk ({unreadMessages.length})
                  </span>
                  <Link
                    href="/admin/contact"
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] font-semibold text-orange-600 hover:underline"
                  >
                    Buka Inbox
                  </Link>
                </div>

                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                  {unreadMessages.length === 0 ? (
                    <p className="text-xs text-slate-700 dark:text-slate-300 text-center py-4">
                      Semua pesan sudah dibaca.
                    </p>
                  ) : (
                    unreadMessages.slice(0, 3).map((msg) => (
                      <Link
                        key={msg.id}
                        href="/admin/contact"
                        onClick={() => setShowNotifications(false)}
                        className="block p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all border border-slate-100 dark:border-white/5"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{msg.name}</span>
                          <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">Baru</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">{msg.message}</p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profil Saya di Header */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfile((value) => !value);
              setShowNotifications(false);
            }}
            title="Buka profil saya"
            aria-label="Buka profil saya"
            aria-haspopup="menu"
            aria-expanded={showProfile}
            className="flex items-center justify-center rounded-full border border-slate-200 bg-white p-1 transition-colors hover:border-orange-300 hover:bg-orange-50/60 dark:border-white/10 dark:bg-white/5 dark:hover:border-orange-500/40 dark:hover:bg-orange-500/10 cursor-pointer"
          >
            <UserAvatar
              src={session?.user.avatar}
              name={session?.user.name || "Administrator"}
              size={32}
              textClassName="text-[10px]"
            />
          </button>

          {showProfile && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 animate-in fade-in zoom-in-95 duration-150 dark:border-white/10 dark:bg-[#1A1A2E] dark:shadow-black/40"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 p-4 dark:border-white/10">
                <UserAvatar
                  src={session?.user.avatar}
                  name={session?.user.name || "Administrator"}
                  size={44}
                  className="ring-2 ring-orange-100 dark:ring-orange-500/20"
                  textClassName="text-sm"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-slate-900 dark:text-white">
                    {session?.user.name || "Administrator"}
                  </p>
                  <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                    {session?.user.email || "admin@cits.id"}
                  </p>
                  <span className="mt-1 inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                    {session?.user.jobTitle || session?.user.role || "Admin"}
                  </span>
                </div>
              </div>

              <div className="p-1.5">
                <Link
                  href="/admin/profile"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <UserRound className="h-4 w-4 text-orange-500" />
                  Profil Saya
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Modal Dialog */}
      {showMobileSearch && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pencarian Admin"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col p-4 md:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMobileSearch(false);
          }}
        >
          <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-white/10">
              <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                ref={mobileInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari data, produk, pesan..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {!searchQuery.trim() ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Ketik kata kunci untuk mencari data produk, layanan, portofolio, klien, atau pesan.
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Tidak ditemukan hasil untuk &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400">
                    {searchResults.length} hasil ditemukan
                  </div>
                  {searchResults.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigate(item.href)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-3 cursor-pointer"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.badgeClass}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {item.title}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${item.badgeClass}`}>
                              {item.category}
                            </span>
                          </div>
                          {item.subtitle && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
