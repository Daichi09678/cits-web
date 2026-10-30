import { siteConfig } from "@/config/siteConfig";
import { canPerformAction, type PageKey, type PermissionAction } from "./internalAccess";

/** Stop optimistic changes before they reach local state. The API independently checks current permissions. */
export function assertPageAction(page: PageKey, action: PermissionAction): void {
  let user = null;
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(siteConfig.admin.sessionKey) : null;
    user = raw ? JSON.parse(raw).user : null;
  } catch {
    /* Invalid sessions are denied. */
  }
  if (!canPerformAction(user, page, action)) throw new Error("Anda tidak memiliki izin untuk tindakan ini.");
}
