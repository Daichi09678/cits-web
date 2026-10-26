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
  user: { role: string; pageAccess?: PageKey[] } | null | undefined,
  page?: PageKey | null
): boolean {
  if (!user) return false;
  return isSuperadminRole(user.role) || !page || user.pageAccess?.includes(page) === true;
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
