export const DEFAULT_AVATAR = "/avatars/admin.webp";

export interface AdminProfile {
  userId: string;
  displayName: string;
  email: string;
  role: string;
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

export interface AdminProfileInput {
  displayName: string;
  jobTitle: string;
  phone: string;
  birthDate: string;
  location: string;
  bio: string;
  website: string;
  avatarUrl: string;
}

export const EMPTY_PROFILE_INPUT: AdminProfileInput = {
  displayName: "",
  jobTitle: "",
  phone: "",
  birthDate: "",
  location: "",
  bio: "",
  website: "",
  avatarUrl: "",
};

function asString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function normalizeProfileInput(
  input: unknown
): { ok: true; value: AdminProfileInput } | { ok: false; message: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, message: "Data profil tidak valid." };
  }

  const raw = input as Record<string, unknown>;
  const value: AdminProfileInput = {
    displayName: asString(raw.displayName, 80),
    jobTitle: asString(raw.jobTitle, 80),
    phone: asString(raw.phone, 24),
    birthDate: asString(raw.birthDate, 10),
    location: asString(raw.location, 80),
    bio: asString(raw.bio, 600),
    website: asString(raw.website, 160),
    avatarUrl: asString(raw.avatarUrl, 1_800_000),
  };

  if (value.displayName.length < 2) {
    return { ok: false, message: "Nama minimal 2 karakter." };
  }

  if (value.phone && !/^[+()\-\s0-9]{6,24}$/.test(value.phone)) {
    return { ok: false, message: "Nomor telepon tidak valid. Gunakan angka, spasi, +, -, atau kurung." };
  }

  if (value.birthDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value.birthDate)) {
      return { ok: false, message: "Tanggal lahir tidak valid." };
    }
    const parsed = new Date(`${value.birthDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return { ok: false, message: "Tanggal lahir tidak valid." };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsed > today) {
      return { ok: false, message: "Tanggal lahir tidak boleh di masa depan." };
    }
    if (parsed.getFullYear() < 1900) {
      return { ok: false, message: "Tanggal lahir tidak valid." };
    }
  }

  if (value.website) {
    try {
      const url = new URL(value.website);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return { ok: false, message: "Website harus diawali http:// atau https://." };
      }
    } catch {
      return { ok: false, message: "Format website tidak valid." };
    }
  }

  if (value.avatarUrl) {
    const isDataImage = /^data:image\/(png|jpe?g|webp);base64,[a-z0-9+/=\s]+$/i.test(value.avatarUrl);
    const isLocalPath = /^\/(avatars|uploads)\/[a-zA-Z0-9._-]+$/.test(value.avatarUrl);
    if (!isDataImage && !isLocalPath) {
      return { ok: false, message: "Format foto profil tidak didukung." };
    }
  }

  return { ok: true, value };
}

export function calculateProfileCompletion(profile: {
  displayName: string;
  jobTitle: string;
  phone: string;
  birthDate: string;
  location: string;
  bio: string;
  avatarUrl: string;
}): number {
  const fields = [
    profile.displayName,
    profile.jobTitle,
    profile.phone,
    profile.birthDate,
    profile.location,
    profile.bio,
    profile.avatarUrl,
  ];
  const filled = fields.filter((field) => field.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}
