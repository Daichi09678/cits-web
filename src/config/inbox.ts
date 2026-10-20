/**
 * Kebijakan retensi kotak masuk (inbox).
 *
 * Pesan konsultasi yang lebih tua dari batas ini dihapus otomatis dari database
 * (lihat DbRepo.purgeExpiredMessages) dan tidak lagi ditampilkan di halaman admin.
 *
 * Nilai bisa dioverride lewat environment variable:
 *  - Server          : MESSAGE_RETENTION_DAYS
 *  - Browser (UI)    : NEXT_PUBLIC_MESSAGE_RETENTION_DAYS
 * Default: 30 hari.
 */
export const DEFAULT_MESSAGE_RETENTION_DAYS = 30;

export function getMessageRetentionDays(): number {
  const env = typeof process !== "undefined" ? process.env : undefined;
  const raw = env?.MESSAGE_RETENTION_DAYS ?? env?.NEXT_PUBLIC_MESSAGE_RETENTION_DAYS;
  const days = Number(raw);
  return Number.isFinite(days) && days > 0 ? Math.floor(days) : DEFAULT_MESSAGE_RETENTION_DAYS;
}
