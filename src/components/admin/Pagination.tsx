"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 px-5 py-3 text-xs dark:border-white/10">
      <span className="text-slate-500 dark:text-slate-400">
        Menampilkan {start}–{end} dari {total} data
      </span>
      <div className="flex items-center gap-1">
        <button type="button" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-orange-400 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-300">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-20 text-center font-semibold text-slate-700 dark:text-slate-200">Halaman {currentPage} / {pageCount}</span>
        <button type="button" disabled={currentPage === pageCount} onClick={() => onPageChange(currentPage + 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-orange-400 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-300">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
