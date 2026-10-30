"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  LockKeyhole,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import type { PublicInternalAccount, SuperadminInfo } from "@/lib/internalAccess";
import { cardClass, fieldClass, primaryButton } from "./styles";

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function InternalAccountsTable({
  accounts,
  superadmin,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: {
  accounts: PublicInternalAccount[];
  superadmin: SuperadminInfo | null;
  loading: boolean;
  onAdd: () => void;
  onEdit: (account: PublicInternalAccount) => void;
  onDelete: (account: PublicInternalAccount) => void;
}) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const rows = [
    ...(superadmin ? [{ ...superadmin, isActive: true, pageAccess: [], updatedAt: "", locked: true }] : []),
    ...accounts.map((account) => ({ ...account, locked: false })),
  ].filter(
    (account) =>
      `${account.name} ${account.email}`.toLowerCase().includes(search.trim().toLowerCase()) &&
      (role === "all" || (role === "superadmin") === account.locked) &&
      (status === "all" || (status === "active") === account.isActive)
  );

  const pageCount = Math.max(1, Math.ceil(rows.length / 10));
  const current = Math.min(page, pageCount);
  const activeCount = accounts.filter((account) => account.isActive).length + (superadmin ? 1 : 0);
  const total = accounts.length + (superadmin ? 1 : 0);

  return (
    <section className={`${cardClass} overflow-hidden`} aria-labelledby="internal-accounts-title">
      <div className="flex flex-col gap-4 p-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2
              id="internal-accounts-title"
              className="text-base font-semibold tracking-tight text-[#0F172A] dark:text-white"
            >
              Akun Internal
            </h2>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-[#64748B] dark:bg-white/5">
              {loading ? "…" : total}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
            Kelola administrator dan tentukan halaman yang dapat mereka akses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative w-full sm:w-52">
            <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-[#64748B]" aria-hidden="true" />
            <input
              aria-label="Cari akun berdasarkan nama atau email"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Cari nama atau email..."
              className={`${fieldClass} h-9 min-h-9 pl-9`}
            />
          </label>
          <select
            aria-label="Filter role"
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setPage(1);
            }}
            className={`${fieldClass} h-9 min-h-9 !w-auto`}
          >
            <option value="all">Semua Role</option>
            <option value="superadmin">Superadmin</option>
            <option value="internal">Admin Internal</option>
          </select>
          <select
            aria-label="Filter status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className={`${fieldClass} h-9 min-h-9 !w-auto`}
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <span className="flex items-center gap-1.5 text-[11px] whitespace-nowrap text-[#64748B]">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            {loading ? "Memuat..." : `${activeCount} akun aktif`}
          </span>
          <button type="button" onClick={onAdd} className={`${primaryButton} h-9 min-h-9 shrink-0 px-3 text-[13px]`}>
            <Plus className="size-4" aria-hidden="true" />
            Tambah Akun
          </button>
        </div>
      </div>

      <div
        className="overflow-x-auto"
        tabIndex={0}
        role="region"
        aria-label="Tabel akun internal; geser untuk melihat semua kolom"
      >
        <table className="w-full min-w-[820px] text-left text-[13px]">
          <thead>
            <tr className="border-y border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold tracking-wide text-[#64748B] uppercase dark:border-white/5 dark:bg-white/[0.03]">
              {["Akun", "Role", "Status", "Hak Akses", "Terakhir Diperbarui", "Aksi"].map((label) => (
                <th key={label} scope="col" className="px-5 py-2.5 font-semibold first:pl-6 last:pr-6 last:text-right">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] dark:divide-white/5">
            {loading
              ? [1, 2, 3].map((row) => (
                  <tr key={row} aria-hidden="true">
                    {[1, 2, 3, 4, 5, 6].map((col) => (
                      <td key={col} className="px-5 py-4">
                        <span className="block h-4 animate-pulse rounded bg-slate-100 dark:bg-white/5" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.slice((current - 1) * 10, current * 10).map((account) => {
                  const original = accounts.find((item) => item.id === account.id);
                  const date = account.updatedAt ? new Date(account.updatedAt) : null;
                  return (
                    <tr key={account.id} className="transition-colors hover:bg-[#F8FAFC] dark:hover:bg-white/[0.025]">
                      <td className="py-3.5 pr-5 pl-6">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                              account.locked
                                ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                                : "bg-[#FFF1E9] text-[#C2410C] dark:bg-orange-500/10 dark:text-orange-300"
                            }`}
                            aria-hidden="true"
                          >
                            {initialsOf(account.name)}
                          </span>
                          <div className="min-w-0">
                            <p
                              className="max-w-60 truncate text-[13px] font-semibold text-[#0F172A] dark:text-slate-100"
                              title={account.name}
                            >
                              {account.name}
                            </p>
                            <p className="mt-0.5 max-w-60 truncate text-[11px] text-[#64748B]" title={account.email}>
                              {account.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${
                            account.locked
                              ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                              : "bg-[#FFF1E9] text-[#C2410C] dark:bg-orange-500/10 dark:text-orange-300"
                          }`}
                        >
                          {account.locked && <ShieldCheck className="size-3" aria-hidden="true" />}
                          {account.locked ? "Superadmin" : "Admin Internal"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            account.isActive
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                              : "bg-slate-100 text-[#64748B] dark:bg-white/5"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${account.isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                            aria-hidden="true"
                          />
                          {account.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-[#334155] dark:text-slate-300">
                        {account.locked ? "Semua Halaman" : `${account.pageAccess.length} Modul`}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-[#64748B]">
                        {date && !Number.isNaN(date.getTime()) ? (
                          new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(
                            date
                          )
                        ) : (
                          <span title="Waktu pembaruan tidak tersedia">—</span>
                        )}
                      </td>
                      <td className="py-3.5 pr-6 pl-5">
                        <div className="flex items-center justify-end gap-1">
                          {account.locked ? (
                            <span
                              title="Akun Superadmin utama tidak dapat diubah atau dihapus di sini"
                              className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B]"
                            >
                              <LockKeyhole className="size-3.5" aria-hidden="true" />
                              Terkunci
                            </span>
                          ) : (
                            original && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onEdit(original)}
                                  aria-label={`Edit ${account.name}`}
                                  title="Edit akun"
                                  className="flex size-8 items-center justify-center rounded-md text-[#64748B] transition hover:bg-[#FFF1E9] hover:text-[#FF4D00] focus-visible:outline-2 focus-visible:outline-[#FF4D00] dark:hover:bg-orange-500/10"
                                >
                                  <Pencil className="size-3.5" aria-hidden="true" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDelete(original)}
                                  aria-label={`Hapus ${account.name}`}
                                  title="Hapus akun"
                                  className="flex size-8 items-center justify-center rounded-md text-[#64748B] transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-500 dark:hover:bg-red-500/10"
                                >
                                  <Trash2 className="size-3.5" aria-hidden="true" />
                                </button>
                              </>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Users className="mx-auto mb-3 size-7 text-slate-300" aria-hidden="true" />
                  <p className="text-[13px] font-medium text-[#334155] dark:text-slate-300">
                    {search || role !== "all" || status !== "all"
                      ? "Tidak ada akun yang cocok"
                      : "Belum ada akun internal"}
                  </p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    {search || role !== "all" || status !== "all"
                      ? "Coba kata kunci atau filter lainnya."
                      : "Tambahkan administrator untuk mulai berbagi akses."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] px-6 py-3 text-[11px] text-[#64748B] dark:border-white/5">
        <span aria-live="polite">
          {loading
            ? "Memuat daftar akun..."
            : `Menampilkan ${rows.length ? (current - 1) * 10 + 1 : 0}–${Math.min(current * 10, rows.length)} dari ${rows.length} akun`}
        </span>
        {pageCount > 1 ? (
          <nav aria-label="Pagination akun" className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
              className="rounded-md border border-[#E2E8F0] p-2 hover:bg-slate-50 disabled:opacity-30 dark:border-white/10"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="px-1">
              {current} / {pageCount}
            </span>
            <button
              type="button"
              aria-label="Halaman berikutnya"
              disabled={current === pageCount}
              onClick={() => setPage(current + 1)}
              className="rounded-md border border-[#E2E8F0] p-2 hover:bg-slate-50 disabled:opacity-30 dark:border-white/10"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </nav>
        ) : (
          <span className="flex items-center gap-1.5">
            <CircleCheck className="size-3.5" aria-hidden="true" />
            Akses dikelola oleh Superadmin
          </span>
        )}
      </footer>
    </section>
  );
}
