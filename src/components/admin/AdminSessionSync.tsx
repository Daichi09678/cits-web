"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminAuth } from "@/lib/auth";
import { citsApi } from "@/lib/api";

/** Refresh sidebar/action permissions after changes made by another administrator. */
export default function AdminSessionSync() {
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    let pending = false;
    const refresh = async () => {
      const current = AdminAuth.getSession();
      if (pending || !current?.user.isInternal) return;
      pending = true;
      const token = localStorage.getItem("cits_jwt_token");
      try {
        const result = await citsApi.getMe();
        if (cancelled || token !== localStorage.getItem("cits_jwt_token")) return;
        if (result.success && result.user) {
          const updated = {
            pageAccess: result.user.pageAccess,
            permissions: result.user.permissions,
            name: result.user.name,
            email: result.user.email,
          };
          if (
            Object.entries(updated).some(
              ([key, value]) => JSON.stringify(current.user[key as keyof typeof current.user]) !== JSON.stringify(value)
            )
          )
            AdminAuth.updateUser(updated);
        } else if (result.status === 401 || result.status === 403) AdminAuth.logout();
      } catch {
        /* Server mutation guards fail closed during connection loss. */
      } finally {
        pending = false;
      }
    };
    void refresh();
    const onFocus = () => void refresh();
    const interval = window.setInterval(onFocus, 30000);
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [pathname]);
  return null;
}
