export default function AdminLoading() {
  return (
    <div
      role="status"
      className="flex min-h-48 items-center justify-center gap-3 p-6 text-sm text-slate-600 dark:text-slate-300"
    >
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-orange-700 motion-reduce:animate-none"
      />
      Memuat halaman...
    </div>
  );
}
