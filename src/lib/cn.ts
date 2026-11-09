export type ClassValue = string | false | null | undefined;

/**
 * Gabungkan class Tailwind secara kondisional tanpa dependensi tambahan.
 *
 * Catatan: helper ini hanya menyatukan string, tidak menyelesaikan konflik
 * utility (mis. `px-2` vs `px-4`). Karena itu setiap primitive menyimpan warna
 * dan ukuran di dalam variannya sendiri, dan `className` hanya dipakai untuk
 * menambah layout (lebar, margin, animasi).
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
