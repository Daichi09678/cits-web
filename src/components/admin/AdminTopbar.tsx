"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Bell, Sun, Moon, Menu, UserRound } from "lucide-react";
import { useCitsStore } from "@/stores/citsStore";
import { useAdminShell } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/lib/auth";
import UserAvatar from "@/components/admin/UserAvatar";

interface AdminTopbarProps {
  title: string;
  description?: string;
}

export default function AdminTopbar({ title, description }: AdminTopbarProps) {
  const { messages } = useCitsStore();
  const { mobileOpen, openMobile } = useAdminShell();
  const { session } = useAdminAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadMessages = messages.filter((m) => m.status === "unread");

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

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
        {/* Search Bar - Shopeers Style */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari data, produk, pesan..."
            className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-white/15">
            ⌘K
          </kbd>
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
            className="flex items-center justify-center rounded-full border border-slate-200 bg-white p-1 transition-colors hover:border-orange-300 hover:bg-orange-50/60 dark:border-white/10 dark:bg-white/5 dark:hover:border-orange-500/40 dark:hover:bg-orange-500/10"
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
    </header>
  );
}
