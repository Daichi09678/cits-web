import { getSql } from "./db";
import { DEFAULT_AVATAR, type AdminProfileInput } from "./profile";

export interface StoredAdminProfile {
  userId: string;
  displayName: string;
  jobTitle: string;
  phone: string;
  birthDate: string;
  location: string;
  bio: string;
  website: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileRow {
  user_id: string;
  display_name: string;
  job_title: string;
  phone: string;
  birth_date: string;
  location: string;
  bio: string;
  website: string;
  avatar_url: string;
  created_at: Date | string;
  updated_at: Date | string;
}

let profileTableReadyPromise: Promise<void> | null = null;

function ensureProfileTable(): Promise<void> {
  const sql = getSql();
  if (!sql) return Promise.resolve();

  if (!profileTableReadyPromise) {
    profileTableReadyPromise = (async () => {
      await sql.unsafe(
        `CREATE TABLE IF NOT EXISTS admin_profiles (
          user_id TEXT PRIMARY KEY,
          display_name TEXT NOT NULL,
          job_title TEXT NOT NULL DEFAULT '',
          phone TEXT NOT NULL DEFAULT '',
          birth_date TEXT NOT NULL DEFAULT '',
          location TEXT NOT NULL DEFAULT '',
          bio TEXT NOT NULL DEFAULT '',
          website TEXT NOT NULL DEFAULT '',
          avatar_url TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`,
        [],
        { prepare: false }
      );
    })().catch((error) => {
      profileTableReadyPromise = null;
      throw error;
    });
  }

  return profileTableReadyPromise;
}

function toIso(value: Date | string | null | undefined): string {
  if (!value) return new Date().toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function rowToProfile(row: ProfileRow): StoredAdminProfile {
  return {
    userId: row.user_id,
    displayName: row.display_name,
    jobTitle: row.job_title || "",
    phone: row.phone || "",
    birthDate: row.birth_date || "",
    location: row.location || "",
    bio: row.bio || "",
    website: row.website || "",
    avatarUrl: row.avatar_url || "",
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function fallbackProfile(userId: string, fallback: { displayName: string; avatarUrl?: string }): StoredAdminProfile {
  const now = new Date().toISOString();
  return {
    userId,
    displayName: fallback.displayName,
    jobTitle: "",
    phone: "",
    birthDate: "",
    location: "",
    bio: "",
    website: "",
    avatarUrl: fallback.avatarUrl || DEFAULT_AVATAR,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getAdminProfile(
  userId: string,
  fallback: { displayName: string; avatarUrl?: string }
): Promise<StoredAdminProfile> {
  const sql = getSql();
  if (!sql) return fallbackProfile(userId, fallback);

  try {
    await ensureProfileTable();
    const rows = (await sql`
      SELECT user_id, display_name, job_title, phone, birth_date, location,
             bio, website, avatar_url, created_at, updated_at
      FROM admin_profiles
      WHERE user_id = ${userId}
      LIMIT 1
    `) as unknown as ProfileRow[];

    if (rows[0]) return rowToProfile(rows[0]);
  } catch (error) {
    console.error("DB Error getAdminProfile:", error);
  }

  return fallbackProfile(userId, fallback);
}

export async function saveAdminProfile(userId: string, input: AdminProfileInput): Promise<StoredAdminProfile> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Database belum tersedia. Profil tidak dapat disimpan.");
  }

  await ensureProfileTable();

  const rows = (await sql`
    INSERT INTO admin_profiles
      (user_id, display_name, job_title, phone, birth_date, location, bio, website, avatar_url, updated_at)
    VALUES
      (${userId}, ${input.displayName}, ${input.jobTitle}, ${input.phone}, ${input.birthDate},
       ${input.location}, ${input.bio}, ${input.website}, ${input.avatarUrl}, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      job_title = EXCLUDED.job_title,
      phone = EXCLUDED.phone,
      birth_date = EXCLUDED.birth_date,
      location = EXCLUDED.location,
      bio = EXCLUDED.bio,
      website = EXCLUDED.website,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = NOW()
    RETURNING user_id, display_name, job_title, phone, birth_date, location,
              bio, website, avatar_url, created_at, updated_at
  `) as unknown as ProfileRow[];

  return rowToProfile(rows[0]);
}
