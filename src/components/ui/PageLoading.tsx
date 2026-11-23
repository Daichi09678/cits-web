import { cn } from "@/lib/cn";

export default function PageLoading({
  className,
  label = "Memuat halaman...",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-48 items-center justify-center gap-3 p-6 text-sm text-slate-700 dark:text-slate-200",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent motion-reduce:animate-none"
      />
      {label}
    </div>
  );
}
