/**
 * Format tanggal & jam pesan.
 *
 * Semua formatter memakai zona waktu eksplisit (Asia/Jakarta / WIB) agar hasilnya
 * identik di server, browser pengunjung, dan mesin mana pun — jadi tampilan
 * "dikirim" tidak bergeser tergantung timezone perangkat.
 */
export const APP_TIME_ZONE = "Asia/Jakarta";
export const APP_TIME_ZONE_LABEL = "WIB";

const DATE_LONG = new Intl.DateTimeFormat("id-ID", {
  timeZone: APP_TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const DATE_SHORT = new Intl.DateTimeFormat("id-ID", {
  timeZone: APP_TIME_ZONE,
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const TIME = new Intl.DateTimeFormat("id-ID", {
  timeZone: APP_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Contoh: "Senin, 20 Oktober 2026" */
export function formatMessageDate(value?: string | Date | null): string {
  const date = toDate(value);
  return date ? DATE_LONG.format(date) : "-";
}

/** Contoh: "20 Okt 2026" */
export function formatMessageDateShort(value?: string | Date | null): string {
  const date = toDate(value);
  return date ? DATE_SHORT.format(date) : "-";
}

/** Contoh: "14.05 WIB" */
export function formatMessageTime(value?: string | Date | null): string {
  const date = toDate(value);
  return date ? `${TIME.format(date)} ${APP_TIME_ZONE_LABEL}` : "-";
}

/** Contoh: "Senin, 20 Oktober 2026 pukul 14.05 WIB" */
export function formatMessageDateTime(value?: string | Date | null): string {
  const date = toDate(value);
  if (!date) return "-";
  return `${DATE_LONG.format(date)} pukul ${TIME.format(date)} ${APP_TIME_ZONE_LABEL}`;
}

/** Jarak waktu relatif, contoh: "2 menit lalu". */
export function formatMessageRelative(value?: string | Date | null, now: Date = new Date()): string {
  const date = toDate(value);
  if (!date) return "-";
  const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const abs = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });

  if (abs < 60) return "baru saja";
  if (abs < 3600) return rtf.format(Math.round(diffSeconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSeconds / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diffSeconds / 86400), "day");
  if (abs < 31536000) return rtf.format(Math.round(diffSeconds / 2592000), "month");
  return rtf.format(Math.round(diffSeconds / 31536000), "year");
}
