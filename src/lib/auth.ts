"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/siteConfig";

export interface AdminSession {
  isLoggedIn: boolean;
  user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  loginTime: string;
}

const defaultUser = {
  name: "Administrator CITS",
  email: siteConfig.admin.defaultEmail,
  role: "Super Admin",
  avatar: "/logo.webp",
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

  login(email: string, pass: string): { success: boolean; message?: string } {
    if (typeof window === "undefined") return { success: false, message: "Window not available" };

    const validEmail = email.trim().toLowerCase() === siteConfig.admin.defaultEmail.toLowerCase() || email.trim().toLowerCase() === "admin";
    const validPass = pass.trim() === siteConfig.admin.defaultPassword || pass.trim() === "admin123";

    if (validEmail && validPass) {
      const session: AdminSession = {
        isLoggedIn: true,
        user: defaultUser,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem(siteConfig.admin.sessionKey, JSON.stringify(session));
      window.dispatchEvent(new Event("cits-auth-changed"));
      return { success: true };
    }

    return {
      success: false,
      message: "Email atau password admin salah. Gunakan admin@cits.id / admin",
    };
  },

  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(siteConfig.admin.sessionKey);
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
  };
}
