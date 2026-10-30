import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { getSql } from "./db";
import {
  isPageKey,
  normalizePermissions,
  validateAccountPassword,
  type PagePermissions,
  normalizeEmail,
  sortPageKeys,
  type AccountMutationResult,
  type InternalAccountInput,
  type PageKey,
  type PublicInternalAccount,
} from "./internalAccess";

/**
 * Penyimpanan akun internal di PostgreSQL.
 *
 * Akun dan izin membutuhkan database persisten. Kegagalan database tidak dianggap sukses.
 */

interface InternalAccountRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  passwordAlgo: "scrypt" | "sha256";
  pageAccess: PageKey[];
  permissions?: PagePermissions;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AccountRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  password_salt: string;
  password_algo: string | null;
  page_access: unknown;
  permissions: unknown;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export type InternalAuthResult =
  | { status: "ok"; account: PublicInternalAccount }
  | { status: "not-found" }
  | { status: "inactive" }
  | { status: "invalid-password" };

let tableReadyPromise: Promise<void> | null = null;

function ensureTable(): Promise<void> {
  const sql = getSql();
  if (!sql) return Promise.resolve();

  if (!tableReadyPromise) {
    tableReadyPromise = (async () => {
      await sql.unsafe(
        `CREATE TABLE IF NOT EXISTS internal_accounts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          password_salt TEXT NOT NULL,
          password_algo VARCHAR(20) NOT NULL DEFAULT 'scrypt',
          page_access JSONB NOT NULL DEFAULT '[]'::jsonb,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`,
        [],
        { prepare: false }
      );
      await sql.unsafe(
        `ALTER TABLE internal_accounts ADD COLUMN IF NOT EXISTS password_algo VARCHAR(20) NOT NULL DEFAULT 'scrypt'`,
        [],
        { prepare: false }
      );
      await sql.unsafe(`ALTER TABLE internal_accounts ADD COLUMN IF NOT EXISTS permissions JSONB`, [], {
        prepare: false,
      });
    })().catch((error) => {
      tableReadyPromise = null;
      throw error;
    });
  }

  return tableReadyPromise;
}

function normalizePageAccess(value: unknown): PageKey[] {
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      parsed = [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return sortPageKeys(parsed.filter((item): item is PageKey => typeof item === "string" && isPageKey(item)));
}

function toIso(value: Date | string | null | undefined): string {
  if (!value) return new Date().toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function rowToRecord(row: AccountRow): InternalAccountRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    passwordAlgo: row.password_algo === "sha256" ? "sha256" : "scrypt",
    pageAccess: Object.keys(normalizePermissions(row.permissions, normalizePageAccess(row.page_access))) as PageKey[],
    permissions: normalizePermissions(row.permissions, normalizePageAccess(row.page_access)),
    isActive: row.is_active !== false,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function toPublic(account: InternalAccountRecord): PublicInternalAccount {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    pageAccess: account.pageAccess,
    permissions: normalizePermissions(account.permissions, account.pageAccess),
    isActive: account.isActive,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

async function listRecords(): Promise<InternalAccountRecord[]> {
  const sql = getSql();
  if (sql) {
    try {
      await ensureTable();
      const rows = (await sql`
        SELECT id, name, email, password_hash, password_salt, password_algo,
               page_access, permissions, is_active, created_at, updated_at
        FROM internal_accounts
        ORDER BY created_at ASC
      `) as unknown as AccountRow[];
      return rows.map(rowToRecord);
    } catch (error) {
      console.error("DB Error listInternalAccounts:", error);
      throw new Error("Database akun tidak tersedia. Coba lagi setelah koneksi pulih.");
    }
  }
  throw new Error("Database akun belum dikonfigurasi. Hubungi pengelola sistem.");
}

export async function listInternalAccounts(): Promise<PublicInternalAccount[]> {
  const records = await listRecords();
  return records.map(toPublic);
}

export async function findInternalAccountById(id: string): Promise<PublicInternalAccount | null> {
  const record = (await listRecords()).find((account) => account.id === id);
  return record ? toPublic(record) : null;
}

function validateInput(input: InternalAccountInput, existing: InternalAccountRecord | null): string | null {
  if (input.name.trim().length < 2) return "Nama akun minimal 2 karakter.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(input.email))) return "Format email tidak valid.";
  if (!input.password && !existing) return "Kata sandi wajib diisi untuk akun baru.";
  if (input.password) {
    const error = validateAccountPassword(input.password);
    if (error) return error;
  }
  const email = normalizeEmail(input.email);
  if (email === "maswahyuganteng@cits.id" || email === "admin@cits.id") {
    return "Email tersebut dipakai akun Superadmin. Gunakan email internal lain.";
  }
  return null;
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(`${salt}:${password}`, "cits-internal-account", 64).toString("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export async function createInternalAccount(input: InternalAccountInput): Promise<AccountMutationResult> {
  const records = await listRecords();
  const email = normalizeEmail(input.email);

  if (records.some((account) => normalizeEmail(account.email) === email)) {
    return { success: false, message: "Email sudah dipakai akun internal lain." };
  }

  const validationError = validateInput(input, null);
  if (validationError) return { success: false, message: validationError };

  const salt = randomBytes(16).toString("hex");
  const now = new Date().toISOString();
  const record: InternalAccountRecord = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash: hashPassword(input.password || "", salt),
    passwordSalt: salt,
    passwordAlgo: "scrypt",
    pageAccess: Object.keys(normalizePermissions(input.permissions, input.pageAccess)) as PageKey[],
    permissions: normalizePermissions(input.permissions, input.pageAccess),
    isActive: input.isActive,
    createdAt: now,
    updatedAt: now,
  };

  const sql = getSql();
  if (sql) {
    try {
      await ensureTable();
      const rows = (await sql`
        INSERT INTO internal_accounts
          (id, name, email, password_hash, password_salt, password_algo, page_access, permissions, is_active, created_at, updated_at)
        VALUES
          (${record.id}, ${record.name}, ${record.email}, ${record.passwordHash}, ${record.passwordSalt},
           ${record.passwordAlgo}, ${sql.json(record.pageAccess as unknown as never)}, ${sql.json(record.permissions as never)}, ${record.isActive},
           ${record.createdAt}, ${record.updatedAt})
        RETURNING id, name, email, password_hash, password_salt, password_algo,
                  page_access, permissions, is_active, created_at, updated_at
      `) as unknown as AccountRow[];
      return { success: true, account: toPublic(rowToRecord(rows[0])) };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menyimpan akun ke database.";
      console.error("DB Error createInternalAccount:", error);
      return { success: false, message: `Gagal menyimpan akun: ${message}` };
    }
  }

  throw new Error("Database akun belum dikonfigurasi.");
}

export async function updateInternalAccount(id: string, input: InternalAccountInput): Promise<AccountMutationResult> {
  if (id === "admin-1") return { success: false, message: "Akun Superadmin utama terkunci." };
  const records = await listRecords();
  const existing = records.find((account) => account.id === id);
  if (!existing) return { success: false, message: "Akun internal tidak ditemukan." };

  const email = normalizeEmail(input.email);
  if (records.some((account) => account.id !== id && normalizeEmail(account.email) === email)) {
    return { success: false, message: "Email sudah dipakai akun internal lain." };
  }

  const validationError = validateInput(input, existing);
  if (validationError) return { success: false, message: validationError };

  let passwordHash = existing.passwordHash;
  let passwordSalt = existing.passwordSalt;
  let passwordAlgo = existing.passwordAlgo;

  if (input.password) {
    passwordSalt = randomBytes(16).toString("hex");
    passwordHash = hashPassword(input.password, passwordSalt);
    passwordAlgo = "scrypt";
  }

  const updated: InternalAccountRecord = {
    ...existing,
    name: input.name.trim(),
    email,
    passwordHash,
    passwordSalt,
    passwordAlgo,
    pageAccess: Object.keys(normalizePermissions(input.permissions, input.pageAccess)) as PageKey[],
    permissions: normalizePermissions(input.permissions, input.pageAccess),
    isActive: input.isActive,
    updatedAt: new Date().toISOString(),
  };

  const sql = getSql();
  if (sql) {
    try {
      await ensureTable();
      const rows = (await sql`
        UPDATE internal_accounts
        SET name = ${updated.name},
            email = ${updated.email},
            password_hash = ${updated.passwordHash},
            password_salt = ${updated.passwordSalt},
            password_algo = ${updated.passwordAlgo},
            page_access = ${sql.json(updated.pageAccess as unknown as never)},
            permissions = ${sql.json(updated.permissions as never)},
            is_active = ${updated.isActive},
            updated_at = ${updated.updatedAt}
        WHERE id = ${id}
        RETURNING id, name, email, password_hash, password_salt, password_algo,
                  page_access, permissions, is_active, created_at, updated_at
      `) as unknown as AccountRow[];
      if (!rows[0]) return { success: false, message: "Akun internal tidak ditemukan." };
      return { success: true, account: toPublic(rowToRecord(rows[0])) };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal memperbarui akun.";
      console.error("DB Error updateInternalAccount:", error);
      return { success: false, message: `Gagal memperbarui akun: ${message}` };
    }
  }

  throw new Error("Database akun belum dikonfigurasi.");
}

export async function findInternalAccountByEmail(email: string): Promise<PublicInternalAccount | null> {
  const normalized = normalizeEmail(email);
  const records = await listRecords();
  const account = records.find((item) => normalizeEmail(item.email) === normalized);
  return account ? toPublic(account) : null;
}

export async function updateInternalAccountPassword(
  id: string,
  newPassword: string
): Promise<{ success: boolean; message?: string }> {
  const records = await listRecords();
  const existing = records.find((account) => account.id === id);
  if (!existing) return { success: false, message: "Akun internal tidak ditemukan." };

  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(newPassword, salt);
  const updatedAt = new Date().toISOString();

  const sql = getSql();
  if (sql) {
    try {
      await ensureTable();
      await sql`
        UPDATE internal_accounts
        SET password_hash = ${passwordHash},
            password_salt = ${salt},
            password_algo = 'scrypt',
            updated_at = ${updatedAt}
        WHERE id = ${id}
      `;
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal memperbarui kata sandi.";
      console.error("DB Error updateInternalAccountPassword:", error);
      return { success: false, message };
    }
  }

  throw new Error("Database akun belum dikonfigurasi.");
}

export async function setInternalAccountName(id: string, name: string): Promise<void> {
  const cleanName = name.trim();
  if (!cleanName) return;

  const sql = getSql();
  if (sql) {
    try {
      await ensureTable();
      await sql`
        UPDATE internal_accounts
        SET name = ${cleanName}, updated_at = NOW()
        WHERE id = ${id}
      `;
      return;
    } catch (error) {
      console.error("DB Error setInternalAccountName:", error);
    }
  }

  throw new Error("Nama akun belum dapat disimpan ke database.");
}

export async function deleteInternalAccount(id: string): Promise<AccountMutationResult> {
  if (id === "admin-1") return { success: false, message: "Akun Superadmin utama tidak dapat dihapus." };
  const existing = (await listRecords()).find((account) => account.id === id);
  if (!existing) return { success: false, message: "Akun internal tidak ditemukan." };
  const sql = getSql();
  if (sql) {
    try {
      await ensureTable();
      await sql`DELETE FROM internal_accounts WHERE id = ${id}`;
      try {
        await sql`DELETE FROM admin_profiles WHERE user_id = ${id}`;
      } catch {
        // Tabel profil mungkin belum pernah dibuat; abaikan.
      }
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menghapus akun.";
      console.error("DB Error deleteInternalAccount:", error);
      return { success: false, message };
    }
  }

  throw new Error("Database akun belum dikonfigurasi.");
}

export async function bulkSetPageAccess(
  updates: { id: string; pageAccess: PageKey[] }[]
): Promise<PublicInternalAccount[]> {
  const safeUpdates = updates.filter((update) => update.id !== "admin-1").slice(0, 200);
  const existingAccounts = await listRecords();
  const sql = getSql();

  if (sql) {
    await ensureTable();
    for (const update of safeUpdates) {
      const pageAccess = sortPageKeys(update.pageAccess.filter((key) => isPageKey(key)));
      const existing = existingAccounts.find((account) => account.id === update.id);
      const current = normalizePermissions(existing?.permissions, existing?.pageAccess);
      const permissions = Object.fromEntries(pageAccess.map((page) => [page, current[page] || ["view"]]));
      await sql`
        UPDATE internal_accounts
        SET permissions = ${sql.json(permissions as never)},
            page_access = ${sql.json(pageAccess as unknown as never)},
            updated_at = ${new Date().toISOString()}
        WHERE id = ${update.id}
      `;
    }
    return listInternalAccounts();
  }

  throw new Error("Database akun belum dikonfigurasi.");
}

export async function authenticateInternalAccount(email: string, password: string): Promise<InternalAuthResult> {
  const normalized = normalizeEmail(email);
  const records = await listRecords();
  const account = records.find((item) => normalizeEmail(item.email) === normalized);
  if (!account) return { status: "not-found" };
  if (!account.isActive) return { status: "inactive" };

  const candidate =
    account.passwordAlgo === "sha256"
      ? createHash("sha256").update(`${account.passwordSalt}:${password}`).digest("hex")
      : hashPassword(password, account.passwordSalt);

  if (!safeEqualHex(candidate, account.passwordHash)) return { status: "invalid-password" };
  return { status: "ok", account: toPublic(account) };
}

interface LegacyAccountInput {
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

export async function migrateLegacyAccounts(rawAccounts: unknown): Promise<{ migrated: number }> {
  if (!Array.isArray(rawAccounts)) return { migrated: 0 };

  const records = await listRecords();
  const existingEmails = new Set(records.map((account) => normalizeEmail(account.email)));
  const legacyRecords: InternalAccountRecord[] = [];

  for (const raw of rawAccounts.slice(0, 100)) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Partial<LegacyAccountInput>;
    const name = typeof item.name === "string" ? item.name.trim() : "";
    const email = typeof item.email === "string" ? normalizeEmail(item.email) : "";
    const passwordHash = typeof item.passwordHash === "string" ? item.passwordHash : "";
    const passwordSalt = typeof item.passwordSalt === "string" ? item.passwordSalt : "";

    if (!name || !email || !/^[0-9a-f]{64}$/i.test(passwordHash) || !/^[0-9a-f]{32}$/i.test(passwordSalt)) continue;
    if (existingEmails.has(email)) continue;
    existingEmails.add(email);

    const now = new Date().toISOString();
    legacyRecords.push({
      id: randomUUID(),
      name,
      email,
      passwordHash,
      passwordSalt,
      passwordAlgo: "sha256",
      pageAccess: normalizePageAccess(item.pageAccess),
      isActive: item.isActive !== false,
      createdAt: typeof item.createdAt === "string" ? item.createdAt : now,
      updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : now,
    });
  }

  if (legacyRecords.length === 0) return { migrated: 0 };

  const sql = getSql();
  if (sql) {
    await ensureTable();
    for (const record of legacyRecords) {
      await sql`
        INSERT INTO internal_accounts
          (id, name, email, password_hash, password_salt, password_algo, page_access, is_active, created_at, updated_at)
        VALUES
          (${record.id}, ${record.name}, ${record.email}, ${record.passwordHash}, ${record.passwordSalt},
           ${record.passwordAlgo}, ${sql.json(record.pageAccess as unknown as never)}, ${record.isActive},
           ${record.createdAt}, ${record.updatedAt})
        ON CONFLICT (email) DO NOTHING
      `;
    }
  } else {
    throw new Error("Database akun belum dikonfigurasi.");
  }

  return { migrated: legacyRecords.length };
}
