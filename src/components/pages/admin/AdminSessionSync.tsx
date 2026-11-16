"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminAuth } from "@/lib/auth";
import { citsApi } from "@/lib/api";
import { siteConfig } from "@/config/siteConfig";

const SESSION_REFRESH_INTERVAL_MS = 30_000;

/** Validate sessions on return and refresh permissions for every admin role. */
export default function AdminSessionSync() {
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    let pending = false;
    let refreshQueued = false;
    const refresh = async (urgent = false): Promise<void> => {
      if (cancelled || document.visibilityState !== "visible") return;
      const current = AdminAuth.getSession();
      if (!current) {
        AdminAuth.logout();
        return;
      }
      if (pending) {
        if (urgent) refreshQueued = true;
        return;
      }
      pending = true;
      const token = localStorage.getItem("cits_jwt_token");
      try {
        const result = await citsApi.getMe(token || undefined);
        if (cancelled || token !== localStorage.getItem("cits_jwt_token")) return;
        if (result.success && result.user) {
          if (refreshQueued) return;
          const updated = {
            pageAccess: result.user.pageAccess,
            permissions: result.user.permissions,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            isInternal: result.user.isInternal,
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
        // Permission or token changes during a request need a fresh server snapshot.
        if (refreshQueued && !cancelled) {
          refreshQueued = false;
          void refresh();
        }
      }
    };
    void refresh();
    const onFocus = () => void refresh();
    const onPermissionsChanged = () => void refresh(true);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const onStorage = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === siteConfig.admin.sessionKey ||
        event.key === "cits_jwt_token" ||
        event.key === "cits_permissions_updated_at"
      )
        onPermissionsChanged();
    };
    const interval = window.setInterval(onVisible, SESSION_REFRESH_INTERVAL_MS);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onFocus);
    window.addEventListener("cits-permissions-changed", onPermissionsChanged);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onFocus);
      window.removeEventListener("cits-permissions-changed", onPermissionsChanged);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [pathname]);
  return null;
}
