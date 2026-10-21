export function validateNewPassword(password: string): string | null {
  if (password.length < 8) return "Kata sandi baru minimal 8 karakter.";
  if (password.length > 128) return "Kata sandi maksimal 128 karakter.";
  if (!/[A-Za-z]/.test(password)) return "Kata sandi harus mengandung minimal satu huruf.";
  if (!/[0-9]/.test(password)) return "Kata sandi harus mengandung minimal satu angka.";
  return null;
}

export function passwordStrength(value: string): {
  score: number;
  label: string;
  barClass: string;
  textClass: string;
} {
  if (!value) {
    return { score: 0, label: "Belum diisi", barClass: "bg-slate-200 dark:bg-white/10", textClass: "text-slate-400" };
  }

  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) score += 1;

  if (score <= 1) return { score: 1, label: "Lemah", barClass: "bg-rose-500", textClass: "text-rose-500" };
  if (score === 2) return { score: 2, label: "Cukup", barClass: "bg-amber-500", textClass: "text-amber-600" };
  if (score === 3) return { score: 3, label: "Kuat", barClass: "bg-emerald-500", textClass: "text-emerald-600" };
  return { score: 4, label: "Sangat kuat", barClass: "bg-emerald-600", textClass: "text-emerald-600" };
}
