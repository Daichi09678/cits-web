"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/siteConfig";
import { citsApi } from "./api";

export interface AdminSession {
  isLoggedIn: boolean;
  user: {
    id?: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  loginTime: string;
}

const defaultUser = {
  id: "admin-1",
  name: "maswahyuganteng",
  email: siteConfig.admin.defaultEmail,
  role: "Super Admin",
  avatar: "/avatars/admin.webp",
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

    // Verifikasi ketat: Username/Email HARUS akun resmi admin yang sah
    const isOfficialEmail =
      cleanInput === "maswahyuganteng@cits.id" ||
      cleanInput === "maswahyuganteng" ||
      cleanInput === siteConfig.admin.defaultEmail.toLowerCase();
    const isOfficialPass = cleanPass === "admin" || cleanPass === "admin123";

    // Jika username / email berbeda dari kredensial resmi, LOGIN PASTI GAGAL
    if (!isOfficialEmail) {
      return {
        success: false,
        message: "Email atau username tidak terdaftar sebagai administrator resmi CITS.",
      };
    }

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
        return { success: true };
      } else if (res && !res.success) {
        return {
          success: false,
          message: res.message || "Kata sandi yang Anda masukkan salah.",
        };
      }
    } catch (e) {
      console.warn("Backend auth request error, checking local fallback:", e);
    }

    // Fallback lokal hanya jika backend offline dan kata sandi benar
    if (isOfficialEmail && isOfficialPass) {
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
      message: "Kata sandi salah. Silakan periksa kembali kredensial Anda.",
    };
  },

  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(siteConfig.admin.sessionKey);
    localStorage.removeItem("cits_jwt_token");
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
