"use client";

import { useRef, useState, type FormEvent } from "react";
import type { ProductItem } from "@/types/schema";

export default function ProductCategoryEditor({
  products,
  onSave,
  onClose,
  onSaved,
  onBusyChange,
}: {
  products: ProductItem[];
  onSave: (id: string, category: string) => Promise<void>;
  onClose: () => void;
  onSaved: (category: string) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [ids, setIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending.current) return;
    const category = name.trim();
    if (!category || category.length > 100 || ids.length === 0) {
      setError("Isi nama kategori dan pilih minimal satu produk.");
      return;
    }
    const selected = products.filter((product) => ids.includes(product.id));
    if (selected.length !== ids.length) {
      setError("Produk yang dipilih sudah berubah. Pilih kembali produk.");
      return;
    }
    pending.current = true;
    setSaving(true);
    onBusyChange?.(true);
    setError("");
    let confirmed = 0;
    try {
      for (const product of selected) {
        await onSave(product.id, category);
        confirmed++;
      }
      onSaved(category);
      onClose();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Kategori produk belum tersimpan.";
      setIds(selected.slice(confirmed).map((product) => product.id));
      setError(
        confirmed
          ? `${confirmed} produk sudah diperbarui. ${message} Simpan kembali untuk melanjutkan produk lainnya.`
          : message
      );
    } finally {
      pending.current = false;
      setSaving(false);
      onBusyChange?.(false);
    }
  }
  return (
    <form
      id="product-category-editor"
      onSubmit={submit}
      className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
    >
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tambah kategori filter</h2>
      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
        Buat kategori dan pilih produk yang masuk di dalamnya. Kategori akan muncul sebagai filter setelah disimpan.
      </p>
      <fieldset disabled={saving} className="min-w-0 space-y-3">
        <label htmlFor="new-product-category" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          Nama kategori
        </label>
        <input
          id="new-product-category"
          required
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Contoh: Infrastruktur TI"
          className="h-9 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-white/10 dark:bg-[#151528] dark:text-white"
        />
        <fieldset className="space-y-2">
          <legend className="mb-2 text-xs font-medium text-slate-700 dark:text-slate-300">Terapkan ke produk</legend>
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {products.map((product) => (
              <label
                key={product.id}
                className="flex cursor-pointer items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  checked={ids.includes(product.id)}
                  onChange={(event) =>
                    setIds(event.target.checked ? [...ids, product.id] : ids.filter((id) => id !== product.id))
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-orange-600"
                />
                <span className="min-w-0 break-words">
                  {product.name} <span className="text-slate-500">· {product.category}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {error && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg px-3 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={ids.length === 0}
            className="h-9 rounded-lg bg-orange-600 px-3 text-xs font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan kategori"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
