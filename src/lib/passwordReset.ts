import { siteConfig } from "@/config/siteConfig";
import { findInternalAccountByEmail } from "./internalAccountsServer";
import { getAdminProfile } from "./profileServer";
import { createPasswordResetToken } from "./passwordServer";
import { sendPasswordResetEmail } from "./email";

export const RESET_EXPIRES_MINUTES = 60;

export function normalizeResetEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;

  const configured = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/+$/, "");
  if (configured) return configured;

  return new URL(request.url).origin;
}

export function buildResetUrl(origin: string, token: string): string {
  return `${origin.replace(/\/+$/, "")}/admin/reset-password?token=${encodeURIComponent(token)}`;
}

export interface ResetRequestResult {
  found: boolean;
  sent: boolean;
  reason?: string;
}

export async function requestPasswordResetForEmail(email: string, origin: string): Promise<ResetRequestResult> {
  const normalized = normalizeResetEmail(email);
  if (!normalized) return { found: false, sent: false, reason: "Email tidak valid." };

  let target: { userId: string; email: string; role: "internal" | "superadmin"; name: string } | null = null;

  const internalAccount = await findInternalAccountByEmail(normalized);
  if (internalAccount && internalAccount.isActive) {
    target = {
      userId: internalAccount.id,
      email: internalAccount.email,
      role: "internal",
      name: internalAccount.name,
    };
  } else {
    const isSuperadminEmail =
      normalized === siteConfig.admin.defaultEmail.toLowerCase() || normalized === "admin@cits.id";
    if (isSuperadminEmail) {
      const profile = await getAdminProfile("admin-1", { displayName: "maswahyuganteng" });
      target = {
        userId: "admin-1",
        email: siteConfig.admin.defaultEmail,
        role: "superadmin",
        name: profile.displayName || "Superadmin",
      };
    }
  }

  if (!target) return { found: false, sent: false, reason: "not-found" };

  const reset = await createPasswordResetToken({
    userId: target.userId,
    email: target.email,
    role: target.role,
    expiresInMinutes: RESET_EXPIRES_MINUTES,
  });

  const resetUrl = buildResetUrl(origin, reset.token);
  const delivery = await sendPasswordResetEmail({
    to: target.email,
    name: target.name,
    resetUrl,
    expiresMinutes: RESET_EXPIRES_MINUTES,
  });

  if (!delivery.sent) {
    console.warn(`Reset link untuk ${target.email} dibuat tetapi email gagal dikirim: ${delivery.reason}`);
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV ONLY] Reset password URL: ${resetUrl}`);
    }
  }

  return { found: true, sent: delivery.sent, reason: delivery.reason };
}
