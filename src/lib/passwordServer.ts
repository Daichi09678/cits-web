import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getSql } from "./db";

/**
 * Kredensial Superadmin dan token reset kata sandi.
 *
 * Kata sandi selalu disimpan sebagai hash scrypt + salt. Token reset hanya
 * disimpan dalam bentuk SHA-256, sehingga nilai asli tidak bisa dibaca dari DB.
 */

export type ResetRole = "superadmin" | "internal";

interface CredentialRow {
  password_hash: string;
  password_salt: string;
  password_algo: string | null;
}

interface ResetRow {
  user_id: string;
  email: string;
  role: string;
}

let credentialTablePromise: Promise<void> | null = null;
let resetTablePromise: Promise<void> | null = null;

function ensureCredentialTable(): Promise<void> {
  const sql = getSql();
  if (!sql) return Promise.resolve();

  if (!credentialTablePromise) {
    credentialTablePromise = (async () => {
      await sql.unsafe(
        `CREATE TABLE IF NOT EXISTS admin_credentials (
          user_id TEXT PRIMARY KEY,
          password_hash TEXT NOT NULL,
          password_salt TEXT NOT NULL,
          password_algo VARCHAR(20) NOT NULL DEFAULT 'scrypt',
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`,
        [],
        { prepare: false }
      );
    })().catch((error) => {
      credentialTablePromise = null;
      throw error;
    });
  }

  return credentialTablePromise;
}

function ensureResetTable(): Promise<void> {
  const sql = getSql();
  if (!sql) return Promise.resolve();

  if (!resetTablePromise) {
    resetTablePromise = (async () => {
      await sql.unsafe(
        `CREATE TABLE IF NOT EXISTS admin_password_resets (
          token_hash TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          email TEXT NOT NULL,
          role VARCHAR(20) NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          used_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`,
        [],
        { prepare: false }
      );
      await sql.unsafe(
        `CREATE INDEX IF NOT EXISTS admin_password_resets_user_idx ON admin_password_resets (user_id)`,
        [],
        { prepare: false }
      );
    })().catch((error) => {
      resetTablePromise = null;
      throw error;
    });
  }

  return resetTablePromise;
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(`${salt}:${password}`, "cits-admin-credential", 64).toString("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * null  = belum ada kredensial tersimpan (pakai kata sandi bawaan)
 * true  = kata sandi cocok
 * false = kredensial ada tetapi kata sandi salah
 */
export async function verifyAdminCredential(userId: string, password: string): Promise<boolean | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureCredentialTable();
    const rows = (await sql`
      SELECT password_hash, password_salt, password_algo
      FROM admin_credentials
      WHERE user_id = ${userId}
      LIMIT 1
    `) as unknown as CredentialRow[];

    const row = rows[0];
    if (!row) return null;

    const candidate = hashPassword(password, row.password_salt);
    return safeEqualHex(candidate, row.password_hash);
  } catch (error) {
    console.error("DB Error verifyAdminCredential:", error);
    throw new Error("Verifikasi kata sandi belum tersedia. Silakan coba lagi.");
  }
}

export async function hasAdminCredential(userId: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  try {
    await ensureCredentialTable();
    const rows = (await sql`
      SELECT 1 FROM admin_credentials WHERE user_id = ${userId} LIMIT 1
    `) as unknown as unknown[];
    return rows.length > 0;
  } catch (error) {
    console.error("DB Error hasAdminCredential:", error);
    return false;
  }
}

export async function setAdminCredential(userId: string, password: string): Promise<void> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Database belum tersedia. Kata sandi tidak dapat disimpan.");
  }

  await ensureCredentialTable();
  const salt = randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);

  await sql`
    INSERT INTO admin_credentials (user_id, password_hash, password_salt, password_algo, updated_at)
    VALUES (${userId}, ${hash}, ${salt}, 'scrypt', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      password_salt = EXCLUDED.password_salt,
      password_algo = EXCLUDED.password_algo,
      updated_at = NOW()
  `;
}

export async function createPasswordResetToken(params: {
  userId: string;
  email: string;
  role: ResetRole;
  expiresInMinutes?: number;
}): Promise<{ token: string; expiresAt: Date }> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Database belum tersedia. Link reset tidak dapat dibuat.");
  }

  await ensureResetTable();
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashResetToken(token);
  const expiresAt = new Date(Date.now() + (params.expiresInMinutes ?? 60) * 60 * 1000);

  // Hanya satu link aktif per akun.
  await sql`
    DELETE FROM admin_password_resets
    WHERE user_id = ${params.userId} AND used_at IS NULL
  `;

  await sql`
    INSERT INTO admin_password_resets (token_hash, user_id, email, role, expires_at)
    VALUES (${tokenHash}, ${params.userId}, ${params.email}, ${params.role}, ${expiresAt.toISOString()})
  `;

  return { token, expiresAt };
}

export async function consumePasswordResetToken(
  token: string
): Promise<{ userId: string; email: string; role: ResetRole } | null> {
  const sql = getSql();
  if (!sql || !token) return null;

  await ensureResetTable();
  const tokenHash = hashResetToken(token);

  const rows = (await sql`
    UPDATE admin_password_resets
    SET used_at = NOW()
    WHERE token_hash = ${tokenHash}
      AND used_at IS NULL
      AND expires_at > NOW()
    RETURNING user_id, email, role
  `) as unknown as ResetRow[];

  const row = rows[0];
  if (!row) return null;

  return {
    userId: row.user_id,
    email: row.email,
    role: row.role === "superadmin" ? "superadmin" : "internal",
  };
}
