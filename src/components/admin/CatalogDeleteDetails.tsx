interface CatalogDeleteDetailsProps {
  kind: "produk" | "layanan";
  name: string;
  category?: string;
  isActive: boolean;
  showOnHome: boolean;
  featureCount: number;
}

export default function CatalogDeleteDetails({
  kind,
  name,
  category,
  isActive,
  showOnHome,
  featureCount,
}: CatalogDeleteDetailsProps) {
  return (
    <div className="space-y-5">
      <dl className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <dt className="text-xs text-slate-500 dark:text-slate-400">{kind === "produk" ? "Produk" : "Layanan"}</dt>
        <dd className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{name}</dd>
        <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2 text-xs">
          <dt className="text-slate-500 dark:text-slate-400">Kategori</dt>
          <dd className="text-right text-slate-700 dark:text-slate-200">{category || "Belum dikategorikan"}</dd>
          <dt className="text-slate-500 dark:text-slate-400">Status publikasi</dt>
          <dd className="text-right text-slate-700 dark:text-slate-200">{isActive ? "Aktif" : "Nonaktif"}</dd>
          <dt className="text-slate-500 dark:text-slate-400">Tampil di beranda</dt>
          <dd className="text-right text-slate-700 dark:text-slate-200">{isActive && showOnHome ? "Ya" : "Tidak"}</dd>
        </div>
      </dl>
      <div>
        <p className="font-medium text-slate-900 dark:text-white">Setelah dihapus:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
          <li>{kind === "produk" ? "Produk" : "Layanan"} tidak lagi tersedia di katalog dan pilihan konsultasi.</li>
          {isActive && showOnHome && <li>Item ini juga dihapus dari daftar unggulan di beranda.</li>}
          <li>
            Rincian{featureCount > 0 ? ` beserta ${featureCount} ${kind === "produk" ? "fitur" : "kapabilitas"}` : ""}{" "}
            yang tersimpan pada item ini ikut dihapus.
          </li>
        </ul>
      </div>
      <p className="border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500 dark:border-white/10 dark:text-slate-400">
        Penghapusan tidak dapat dibatalkan. Jika hanya ingin menyembunyikan {kind} dari website, batalkan lalu ubah
        statusnya menjadi nonaktif.
      </p>
    </div>
  );
}
