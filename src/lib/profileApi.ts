import type { AdminProfile, AdminProfileInput } from "./profile";

const BASE = "/api/admin/profile";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("cits_jwt_token");
  } catch {
    return null;
  }
}

async function request<T>(init?: RequestInit): Promise<T> {
  const token = getToken();
  const response = await fetch(BASE, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });

  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Permintaan profil gagal.");
  }

  return payload as T;
}

export async function fetchAdminProfile(): Promise<AdminProfile> {
  const payload = await request<{ data: AdminProfile }>();
  return payload.data;
}

export async function saveAdminProfile(input: AdminProfileInput): Promise<AdminProfile> {
  const payload = await request<{ data: AdminProfile }>({
    method: "PUT",
    body: JSON.stringify(input),
  });
  return payload.data;
}
