/**
 * Model akses internal back office berbasis halaman.
 *
 * Superadmin membuat akun staf internal dan memilih halaman mana saja yang
 * boleh diakses dan diubah. Halaman lain disembunyikan dari akun internal.
 * Dashboard, profil, dan pengaturan tetap tersedia bagi semua admin.
 *
 * Data akun disimpan di database melalui API (`/api/admin/internal-accounts`),
 * bukan di localStorage, agar akun bisa dipakai lintas browser/perangkat.
 */

export type PageKey = "landing" | "products" | "portfolio" | "about" | "contact" | "services" | "clients";

export interface EditablePage {
  key: PageKey;
  label: string;
  shortLabel: string;
  href: string;
  description: string;
}

export const EDITABLE_PAGES: EditablePage[] = [
  {
    key: "products",
    label: "Produk Kami",
    shortLabel: "Produk",
    href: "/admin/products",
    description: "Katalog produk, status aktif, dan detail produk",
  },
  {
    key: "portfolio",
    label: "Portofolio Kami",
    shortLabel: "Portofolio",
    href: "/admin/portfolio",
    description: "Studi kasus, klien, dan capaian proyek",
  },
  {
    key: "about",
    label: "Tentang Kami",
    shortLabel: "Tentang",
    href: "/admin/about",
    description: "Profil perusahaan, visi, misi, dan statistik",
  },
  {
    key: "contact",
    label: "Hubungi Kami",
    shortLabel: "Kontak",
    href: "/admin/contact",
    description: "Informasi kontak, FAQ, dan pesan masuk",
  },
  {
    key: "services",
    label: "Layanan CITS",
    shortLabel: "Layanan",
    href: "/admin/services",
    description: "Pilar layanan, SLA, dan fitur layanan",
  },
  {
    key: "clients",
    label: "Mitra Klien",
    shortLabel: "Klien",
    href: "/admin/clients",
    description: "Logo mitra, kategori, dan status tampil",
  },
];

/** Kunci lama (localStorage) untuk migrasi akun yang dibuat sebelum pindah ke DB. */
export const LEGACY_INTERNAL_ACCOUNTS_KEY = "cits_internal_accounts_v1";

export interface PublicInternalAccount {
  id: string;
  name: string;
  email: string;
  pageAccess: PageKey[];
  permissions?: PagePermissions;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InternalAccountInput {
  name: string;
  email: string;
  /** Wajib untuk akun baru; opsional saat mengedit (kosong = tidak diubah). */
  password?: string;
  pageAccess: PageKey[];
  permissions?: PagePermissions;
  isActive: boolean;
}

export interface AccountMutationResult {
  success: boolean;
  message?: string;
  account?: PublicInternalAccount;
}

export interface SuperadminInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

const PAGE_KEYS = new Set<string>(EDITABLE_PAGES.map((page) => page.key));

export function isPageKey(value: string): value is PageKey {
  return PAGE_KEYS.has(value);
}

export function isSuperadminRole(role: string | undefined | null): boolean {
  return (role || "").toLowerCase().includes("super");
}

/** Akses menu dan halaman memakai izin yang sama; izin kosong menolak semua halaman konten. */
export function canAccessPage(
  user: { role: string; pageAccess?: PageKey[]; permissions?: PagePermissions } | null | undefined,
  page?: PageKey | null
): boolean {
  if (!user) return false;
  return isSuperadminRole(user.role) || !page || canPerformAction(user, page, "view");
}

export const PERMISSION_ACTIONS = ["view", "create", "edit", "delete"] as const;
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];
export type PagePermissions = Partial<Record<PageKey, PermissionAction[]>>;

/** Only expose actions supported by the existing module APIs. */
export function availableActions(page: PageKey): readonly PermissionAction[] {
  if (page === "products" || page === "clients") return PERMISSION_ACTIONS;
  if (page === "contact") return ["view", "edit", "delete"];
  return ["view", "edit"];
}

/** Legacy page assignments retain their old capabilities; explicit empty maps deny everything. */
export function normalizePermissions(value: unknown, legacyPages: PageKey[] = []): PagePermissions {
  if (value === undefined || value === null) {
    return Object.fromEntries(sortPageKeys(legacyPages).map((page) => [page, [...availableActions(page)]]));
  }
  if (typeof value !== "object" || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  const result: PagePermissions = {};
  for (const { key } of EDITABLE_PAGES) {
    const actions = input[key];
    if (Array.isArray(actions) && actions.includes("view")) {
      result[key] = availableActions(key).filter((action) => actions.includes(action));
    }
  }
  return result;
}

export function canPerformAction(
  user: { role: string; pageAccess?: PageKey[]; permissions?: PagePermissions } | null | undefined,
  page: PageKey,
  action: PermissionAction
): boolean {
  if (!user) return false;
  if (isSuperadminRole(user.role)) return true;
  const permissions = normalizePermissions(user.permissions, user.pageAccess);
  return permissions[page]?.includes("view") === true && permissions[page]?.includes(action) === true;
}

export function validateAccountPassword(password: string): string | null {
  if (password.length < 8 || password.length > 128) return "Password harus terdiri dari 8–128 karakter.";
  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9\s]/.test(password)
  ) {
    return "Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol.";
  }
  return null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Cocokkan pathname dengan halaman yang bisa diedit; null untuk dashboard. */
export function getPageKeyFromPathname(pathname: string): PageKey | null {
  if (pathname === "/admin/landing" || pathname.startsWith("/admin/landing/")) return "landing";
  const match = [...EDITABLE_PAGES]
    .sort((a, b) => b.href.length - a.href.length)
    .find((page) => pathname === page.href || pathname.startsWith(`${page.href}/`));
  return match?.key ?? null;
}

export function getPageLabel(key: PageKey): string {
  return EDITABLE_PAGES.find((page) => page.key === key)?.label ?? key;
}

export function getPageLabels(keys: PageKey[]): string[] {
  return EDITABLE_PAGES.filter((page) => keys.includes(page.key)).map((page) => page.label);
}

export function sortPageKeys(keys: PageKey[]): PageKey[] {
  return EDITABLE_PAGES.filter((page) => keys.includes(page.key)).map((page) => page.key);
}

export function buildPageMatrix(accounts: PublicInternalAccount[]): Record<string, PageKey[]> {
  return accounts.reduce<Record<string, PageKey[]>>((acc, account) => {
    acc[account.id] = sortPageKeys(account.pageAccess);
    return acc;
  }, {});
}
