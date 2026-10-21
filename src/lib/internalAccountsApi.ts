import {
  LEGACY_INTERNAL_ACCOUNTS_KEY,
  isPageKey,
  sortPageKeys,
  type InternalAccountInput,
  type PageKey,
  type PublicInternalAccount,
  type SuperadminInfo,
} from "./internalAccess";

export interface AccountsPayload {
  accounts: PublicInternalAccount[];
  superadmin: SuperadminInfo;
}

export interface LegacyInternalAccount {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  pageAccess: PageKey[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const BASE = "/api/admin/internal-accounts";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("cits_jwt_token");
  } catch {
    return null;
  }
}

function headers(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: headers(), cache: "no-store" });
  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Permintaan ke server gagal.");
  }
  return payload as T;
}

export async function fetchInternalAccounts(): Promise<AccountsPayload> {
  const payload = await request<{
    data: PublicInternalAccount[];
    superadmin: SuperadminInfo;
  }>(BASE);
  return {
    accounts: Array.isArray(payload.data) ? payload.data : [],
    superadmin: payload.superadmin,
  };
}

export async function createInternalAccount(input: InternalAccountInput): Promise<PublicInternalAccount> {
  const payload = await request<{ data: PublicInternalAccount }>(BASE, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return payload.data;
}

export async function updateInternalAccount(id: string, input: InternalAccountInput): Promise<PublicInternalAccount> {
  const payload = await request<{ data: PublicInternalAccount }>(`${BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return payload.data;
}

export async function deleteInternalAccount(id: string): Promise<void> {
  await request<{ success: boolean }>(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function savePageAccess(
  updates: { id: string; pageAccess: PageKey[] }[]
): Promise<PublicInternalAccount[]> {
  const payload = await request<{ data: PublicInternalAccount[] }>(BASE, {
    method: "PATCH",
    body: JSON.stringify({ updates }),
  });
  return Array.isArray(payload.data) ? payload.data : [];
}

export function readLegacyAccounts(): LegacyInternalAccount[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(LEGACY_INTERNAL_ACCOUNTS_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
      .map((item) => {
        const pageAccess = Array.isArray(item.pageAccess)
          ? item.pageAccess.filter((key): key is PageKey => typeof key === "string" && isPageKey(key))
          : [];

        return {
          id: typeof item.id === "string" ? item.id : undefined,
          name: typeof item.name === "string" ? item.name : "",
          email: typeof item.email === "string" ? item.email : "",
          passwordHash: typeof item.passwordHash === "string" ? item.passwordHash : "",
          passwordSalt: typeof item.passwordSalt === "string" ? item.passwordSalt : "",
          pageAccess: sortPageKeys(pageAccess),
          isActive: item.isActive !== false,
          createdAt: typeof item.createdAt === "string" ? item.createdAt : undefined,
          updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : undefined,
        };
      })
      .filter((account) => account.name && account.email && account.passwordHash && account.passwordSalt);
  } catch {
    return [];
  }
}

export function clearLegacyAccounts(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LEGACY_INTERNAL_ACCOUNTS_KEY);
  } catch {
    // abaikan
  }
}

/**
 * Kirim akun lama (localStorage) ke server agar tersimpan permanen di database.
 * Best-effort: kegagalan migrasi tidak boleh menghalangi login.
 */
export async function migrateLegacyAccounts(accounts: LegacyInternalAccount[]): Promise<number | null> {
  if (accounts.length === 0) return 0;

  try {
    const response = await fetch("/api/auth/migrate-legacy", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ accounts }),
    });
    if (!response.ok) return null;
    const payload = (await response.json().catch(() => ({}))) as { migrated?: number };
    return typeof payload.migrated === "number" ? payload.migrated : 0;
  } catch {
    return null;
  }
}
