"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/siteConfig";
import { citsApi } from "./api";

import { clearLegacyAccounts, migrateLegacyAccounts, readLegacyAccounts } from "./internalAccountsApi";
import type { PageKey } from "./internalAccess";

export interface AdminSession {
  isLoggedIn: boolean;
  user: {
    id?: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    jobTitle?: string;
    /** Halaman yang boleh diedit; kosong/undefined = Superadmin (semua). */
    pageAccess?: PageKey[];
    isInternal?: boolean;
  };
  loginTime: string;
}

const defaultUser = {
  id: "admin-1",
  name: "maswahyuganteng",
  email: siteConfig.admin.defaultEmail,
  role: "Super Admin",
  avatar: "/avatars/admin.webp",
  jobTitle: "Superadmin",
};

export const AdminAuth = {
  getSession(): AdminSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(siteConfig.admin.sessionKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async login(email: string, pass: string): Promise<{ success: boolean; message?: string }> {
    if (typeof window === "undefined") return { success: false, message: "Window not available" };

    const cleanInput = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Akun lama (localStorage) dimigrasikan ke database setelah login
    // Superadmin berhasil, karena endpoint migrasi butuh token Superadmin.
    try {
      const res = await citsApi.login(cleanInput, cleanPass);
      if (res && res.success && res.token) {
        localStorage.setItem("cits_jwt_token", res.token);
        const session: AdminSession = {
          isLoggedIn: true,
          user: res.user || defaultUser,
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem(siteConfig.admin.sessionKey, JSON.stringify(session));
        window.dispatchEvent(new Event("cits-auth-changed"));

        const role = String(res.user?.role || "").toLowerCase();
        if (role.includes("super")) {
          const legacyAccounts = readLegacyAccounts();
          if (legacyAccounts.length > 0) {
            const migrated = await migrateLegacyAccounts(legacyAccounts);
            if (migrated !== null) clearLegacyAccounts();
          }
        }

        return { success: true };
      } else if (res && !res.success) {
        return {
          success: false,
          message: res.message || "Kata sandi yang Anda masukkan salah.",
        };
      }
    } catch (e) {
      console.warn("Backend auth request error:", e);
    }

    return {
      success: false,
      message: "Email atau kata sandi tidak terdaftar. Periksa kembali akun internal Anda.",
    };
  },

  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(siteConfig.admin.sessionKey);
    localStorage.removeItem("cits_jwt_token");
    window.dispatchEvent(new Event("cits-auth-changed"));
  },

  updateUser(user: Partial<AdminSession["user"]>): void {
    if (typeof window === "undefined") return;
    const session = AdminAuth.getSession();
    if (!session) return;

    const updated: AdminSession = {
      ...session,
      user: { ...session.user, ...user },
    };
    localStorage.setItem(siteConfig.admin.sessionKey, JSON.stringify(updated));
    window.dispatchEvent(new Event("cits-auth-changed"));
  },

  isAuthenticated(): boolean {
    const s = this.getSession();
    return !!s?.isLoggedIn;
  },
};

export function useAdminAuth() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function check() {
      setSession(AdminAuth.getSession());
      setLoading(false);
    }
    check();
    window.addEventListener("cits-auth-changed", check);
    return () => window.removeEventListener("cits-auth-changed", check);
  }, []);

  return {
    session,
    isAuthenticated: !!session?.isLoggedIn,
    loading,
    login: AdminAuth.login,
    logout: AdminAuth.logout,
    updateUser: AdminAuth.updateUser,
  };
}
