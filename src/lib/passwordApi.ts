function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("cits_jwt_token");
  } catch {
    return null;
  }
}

async function request<T>(url: string, init: RequestInit): Promise<T> {
  const token = getToken();
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!response.ok || payload.success !== true) {
    throw new Error(payload.message || "Permintaan gagal diproses.");
  }

  return payload as T;
}

export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<string> {
  const payload = await request<{ message?: string }>("/api/admin/password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return payload.message || "Kata sandi berhasil diperbarui.";
}

export async function sendAdminResetLink(email: string): Promise<string> {
  const payload = await request<{ message?: string }>("/api/admin/password-reset", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return payload.message || "Tautan reset berhasil dikirim.";
}
