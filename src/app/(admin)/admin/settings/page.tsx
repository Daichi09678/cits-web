"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  UserPlus,
  UserCog,
  Pencil,
  Trash2,
  Save,
  CheckCircle2,
  Key,
  RefreshCw,
  Lock,
  Eye,
  Wrench,
  Info,
  AlertTriangle,
} from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminModal from "@/components/admin/AdminModal";
import { useAdminDialog } from "@/components/admin/AdminDialogProvider";
import MatrixCheckbox from "@/components/admin/MatrixCheckbox";
import { useAdminAuth } from "@/lib/auth";
import {
  EDITABLE_PAGES,
  buildPageMatrix,
  sortPageKeys,
  type PageKey,
  type PublicInternalAccount,
  type SuperadminInfo,
} from "@/lib/internalAccess";
import {
  clearLegacyAccounts,
  createInternalAccount,
  deleteInternalAccount,
  fetchInternalAccounts,
  migrateLegacyAccounts,
  readLegacyAccounts,
  savePageAccess,
  updateInternalAccount,
} from "@/lib/internalAccountsApi";
import { useCitsStore } from "@/stores/citsStore";

type TabKey = "accounts" | "maintenance";

interface AccountFormState {
  id: string | null;
  name: string;
  email: string;
  password: string;
  pageAccess: PageKey[];
  isActive: boolean;
}

const EMPTY_FORM: AccountFormState = {
  id: null,
  name: "",
  email: "",
  password: "",
  pageAccess: [],
  isActive: true,
};

const DEFAULT_SUPERADMIN: SuperadminInfo = {
  id: "admin-1",
  name: "maswahyuganteng",
  email: "maswahyuganteng@cits.id",
  role: "Super Admin",
};

function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function getPageLabels(keys: PageKey[]): string[] {
  return EDITABLE_PAGES.filter((page) => keys.includes(page.key)).map((page) => page.label);
}

function pageAccessChanged(a: PageKey[], b: PageKey[]): boolean {
  return a.length !== b.length || a.some((key) => !b.includes(key));
}

export default function AdminSettingsPage() {
  const { session, loading } = useAdminAuth();
  const { actions } = useCitsStore();
  const dialog = useAdminDialog();

  const [tab, setTab] = useState<TabKey>("accounts");
  const [accounts, setAccounts] = useState<PublicInternalAccount[]>([]);
  const [matrix, setMatrix] = useState<Record<string, PageKey[]>>({});
  const [superadminInfo, setSuperadminInfo] = useState<SuperadminInfo>(DEFAULT_SUPERADMIN);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState<AccountFormState | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const loadAccounts = useCallback(async () => {
    setAccountsLoading(true);
    try {
      const data = await fetchInternalAccounts();
      setAccounts(data.accounts);
      setMatrix(buildPageMatrix(data.accounts));
      setSuperadminInfo(data.superadmin || DEFAULT_SUPERADMIN);
      setLoadError("");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Gagal memuat akun internal.");
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Muat akun dari database + migrasikan akun lama (localStorage) bila ada.
    let cancelled = false;
    (async () => {
      const legacy = readLegacyAccounts();
      if (legacy.length > 0) {
        const migrated = await migrateLegacyAccounts(legacy);
        if (migrated !== null) clearLegacyAccounts();
      }
      if (!cancelled) await loadAccounts();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAccounts]);

  const isSuperadmin = (session?.user.role || "").toLowerCase().includes("super");
  const activeAccounts = accounts.filter((account) => account.isActive).length;
  const isMatrixDirty = useMemo(
    () => accounts.some((account) => pageAccessChanged(matrix[account.id] ?? [], account.pageAccess)),
    [accounts, matrix]
  );

  const commitMatrixDraft = async () => {
    const updates = accounts
      .filter((account) => pageAccessChanged(matrix[account.id] ?? [], account.pageAccess))
      .map((account) => ({
        id: account.id,
        pageAccess: sortPageKeys(matrix[account.id] ?? account.pageAccess),
      }));

    if (updates.length === 0) return;

    const updated = await savePageAccess(updates);
    setAccounts(updated);
    setMatrix(buildPageMatrix(updated));
  };

  const handleSaveMatrix = async () => {
    if (!isMatrixDirty) return;
    try {
      await commitMatrixDraft();
      setLoadError("");
      await dialog.alert({
        title: "Matriks hak akses disimpan",
        description: "Perubahan hak akses halaman sudah diterapkan ke semua akun internal.",
        variant: "success",
      });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Gagal menyimpan matriks hak akses.");
    }
  };

  const handleDiscardMatrix = () => {
    setMatrix(buildPageMatrix(accounts));
  };

  const toggleMatrixPage = (accountId: string, page: PageKey, checked: boolean) => {
    setMatrix((previous) => {
      const current = previous[accountId] ?? [];
      const next = checked ? [...current, page] : current.filter((key) => key !== page);
      return { ...previous, [accountId]: sortPageKeys(next) };
    });
  };

  const toggleMatrixAll = (accountId: string, checked: boolean) => {
    setMatrix((previous) => ({
      ...previous,
      [accountId]: checked ? EDITABLE_PAGES.map((page) => page.key) : [],
    }));
  };

  const openCreateForm = async () => {
    if (isMatrixDirty) {
      try {
        await commitMatrixDraft();
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Gagal menyimpan matriks hak akses.");
        return;
      }
    }
    setForm({ ...EMPTY_FORM });
    setFormError("");
  };

  const openEditForm = async (account: PublicInternalAccount) => {
    const draftAccess = sortPageKeys(matrix[account.id] ?? account.pageAccess);
    if (isMatrixDirty) {
      try {
        await commitMatrixDraft();
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Gagal menyimpan matriks hak akses.");
        return;
      }
    }
    setForm({
      id: account.id,
      name: account.name,
      email: account.email,
      password: "",
      pageAccess: draftAccess,
      isActive: account.isActive,
    });
    setFormError("");
  };

  const toggleFormPage = (page: PageKey, checked: boolean) => {
    setForm((previous) => {
      if (!previous) return previous;
      const next = checked ? [...previous.pageAccess, page] : previous.pageAccess.filter((key) => key !== page);
      return { ...previous, pageAccess: sortPageKeys(next) };
    });
  };

  const toggleFormAllPages = (checked: boolean) => {
    setForm((previous) =>
      previous ? { ...previous, pageAccess: checked ? EDITABLE_PAGES.map((p) => p.key) : [] } : previous
    );
  };

  const handleSubmitAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form || saving) return;

    setSaving(true);
    setFormError("");

    try {
      // Jangan buang perubahan matriks yang belum disimpan.
      if (isMatrixDirty) await commitMatrixDraft();

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        pageAccess: form.pageAccess,
        isActive: form.isActive,
      };

      if (form.id) {
        await updateInternalAccount(form.id, payload);
      } else {
        await createInternalAccount(payload);
      }

      await loadAccounts();
      setForm(null);
      await dialog.alert({
        title: form.id ? "Akun internal diperbarui" : "Akun internal dibuat",
        description: form.id
          ? `Perubahan untuk "${form.name}" berhasil disimpan.`
          : `Akun "${form.name}" berhasil dibuat dan bisa langsung dipakai login.`,
        variant: "success",
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Gagal menyimpan akun internal.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (account: PublicInternalAccount) => {
    const confirmed = await dialog.confirm({
      title: "Hapus akun internal?",
      description: `Akun "${account.name}" (${account.email}) akan dihapus permanen dan tidak bisa login lagi.`,
      confirmLabel: "Hapus Akun",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      if (isMatrixDirty) await commitMatrixDraft();
      await deleteInternalAccount(account.id);
      await loadAccounts();
      if (form?.id === account.id) setForm(null);
      await dialog.alert({
        title: "Akun internal dihapus",
        description: `Akun "${account.name}" berhasil dihapus dari database.`,
        variant: "success",
      });
    } catch (error) {
      await dialog.alert({
        title: "Gagal menghapus akun",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus akun.",
        variant: "danger",
      });
    }
  };

  const handleReset = async () => {
    const confirmed = await dialog.confirm({
      title: "Reset semua data?",
      description:
        "Seluruh produk, kontak, dan narasi profil akan dikembalikan ke data awal default pabrik. Tindakan ini tidak dapat dibatalkan.",
      confirmLabel: "Ya, Reset Semua Data",
      variant: "danger",
    });
    if (!confirmed) return;

    actions.resetAllToDefault();
    setResetSuccess(true);
    window.setTimeout(() => setResetSuccess(false), 5000);
    await dialog.alert({
      title: "Data berhasil direset",
      description: "Semua data sudah dikembalikan ke data bawaan resmi CITS Indonesia.",
      variant: "success",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          Memuat pengaturan...
        </div>
      </div>
    );
  }

  if (!session || !isSuperadmin) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center dark:border-rose-500/20 dark:bg-[#151528]">
          <ShieldAlert className="mx-auto h-10 w-10 text-rose-500" />
          <h1 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">Akses Ditolak</h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Pengaturan hanya dapat dibuka oleh Superadmin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminTopbar
        title="Pengaturan Back Office"
        description="Kelola akun internal, hak akses per halaman, dan pemeliharaan data"
      />

      <div className="mx-auto w-full max-w-[1600px] space-y-5 p-4 sm:p-6 lg:p-8">
        {loadError && (
          <div className="flex flex-col gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {loadError}
            </span>
            <button
              type="button"
              onClick={() => void loadAccounts()}
              className="w-fit rounded-lg border border-rose-300 px-3 py-1.5 text-[10px] font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-500/30 dark:text-rose-200 dark:hover:bg-rose-500/20"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex w-fit flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs dark:border-white/10 dark:bg-[#151528]">
          <button
            type="button"
            onClick={() => setTab("accounts")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[11px] font-bold transition-colors ${
              tab === "accounts"
                ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Akun & Hak Akses
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                tab === "accounts" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 dark:bg-white/10"
              }`}
            >
              {accounts.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("maintenance")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[11px] font-bold transition-colors ${
              tab === "maintenance"
                ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            Pemeliharaan
          </button>
        </div>

        {tab === "accounts" ? (
          <>
            {/* Banner internal */}
            <div className="flex flex-col gap-3 rounded-2xl border border-orange-200/80 bg-gradient-to-r from-orange-50 via-amber-50/60 to-transparent p-4 dark:border-orange-500/20 dark:from-orange-500/10 dark:via-amber-500/5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm shadow-orange-600/25">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Manajemen Role &amp; Hak Akses Internal
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    Superadmin membuat akun staf dan menentukan halaman mana yang boleh diedit. Halaman lain tetap bisa
                    dibuka, tetapi hanya dalam mode lihat.
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {activeAccounts} akun aktif
              </span>
            </div>

            {/* Perbandingan role */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-purple-200/70 bg-white p-5 dark:border-purple-500/20 dark:bg-[#151528]">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Superadmin</h2>
                      <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                        Akses Penuh
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      Pemilik sistem yang mengatur akun internal dan seluruh halaman.
                    </p>
                  </div>
                </div>
                <ul className="mt-3 grid gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-700 dark:border-white/5 dark:text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Akses edit semua halaman
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Membuat & mengatur akun internal
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Konfigurasi, reset data, dan audit
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-orange-200/70 bg-white p-5 dark:border-orange-500/20 dark:bg-[#151528]">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white">
                    <UserCog className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Admin Internal</h2>
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                        Per Halaman
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      Akun staf dengan izin edit terbatas pada halaman yang dicentang.
                    </p>
                  </div>
                </div>
                <ul className="mt-3 grid gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-700 dark:border-white/5 dark:text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Edit halaman yang diizinkan
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Eye className="h-3 w-3 text-slate-500" /> Halaman lain hanya bisa dilihat
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-slate-500" /> Tidak bisa membuka Pengaturan & akun
                  </li>
                </ul>
              </div>
            </div>

            {/* Akun internal */}
            <section className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs dark:border-white/10 dark:bg-[#151528]">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white/10">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Akun Internal</h2>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      Buat akun staf dan tentukan halaman yang boleh mereka edit.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void openCreateForm()}
                  className="inline-flex w-fit items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2.5 text-[11px] font-bold text-white shadow-md shadow-orange-600/20 transition-colors hover:bg-orange-700"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Tambah Akun
                </button>
              </div>

              {form && (
                <AdminModal
                  open
                  onClose={() => {
                    if (!saving) setForm(null);
                  }}
                  title={form.id ? "Edit Akun Internal" : "Tambah Akun Internal"}
                  description="Akun internal selalu memakai role Admin Internal. Pilih halaman yang boleh diedit."
                  icon={UserPlus}
                  size="2xl"
                >
                  <form onSubmit={handleSubmitAccount} className="space-y-4">
                    {formError && (
                      <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[11px] text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <label className="block">
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Nama Akun
                        </span>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(event) => setForm({ ...form, name: event.target.value })}
                          placeholder="Contoh: Editor Konten"
                          required
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-[#151528] dark:text-white"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Email Login
                        </span>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(event) => setForm({ ...form, email: event.target.value })}
                          placeholder="editor@cits.id"
                          required
                          autoComplete="off"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-[#151528] dark:text-white"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Kata Sandi
                        </span>
                        <input
                          type="password"
                          value={form.password}
                          onChange={(event) => setForm({ ...form, password: event.target.value })}
                          placeholder={form.id ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"}
                          required={!form.id}
                          autoComplete="new-password"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-[#151528] dark:text-white"
                        />
                      </label>

                      <label className="flex items-center gap-2 self-end rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-[#151528]">
                        <input
                          type="checkbox"
                          checked={form.isActive}
                          onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 accent-orange-600"
                        />
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                          Akun aktif (bisa login)
                        </span>
                      </label>
                    </div>

                    <fieldset className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#151528]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <legend className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Halaman yang boleh diedit
                        </legend>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleFormAllPages(form.pageAccess.length !== EDITABLE_PAGES.length)}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                          >
                            {form.pageAccess.length === EDITABLE_PAGES.length ? "Kosongkan" : "Pilih semua"}
                          </button>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {form.pageAccess.length}/{EDITABLE_PAGES.length} dipilih
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                        {EDITABLE_PAGES.map((page) => {
                          const selected = form.pageAccess.includes(page.key);
                          return (
                            <label
                              key={page.key}
                              className={`flex cursor-pointer items-start gap-2 rounded-xl border p-2.5 transition-colors ${
                                selected
                                  ? "border-orange-400 bg-orange-50/70 dark:border-orange-500/40 dark:bg-orange-500/10"
                                  : "border-slate-200 hover:border-orange-300 dark:border-white/10 dark:hover:border-orange-500/40"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={(event) => toggleFormPage(page.key, event.target.checked)}
                                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-orange-600"
                              />
                              <span className="min-w-0">
                                <span className="block text-[11px] font-bold text-slate-900 dark:text-white">
                                  {page.label}
                                </span>
                                <span className="block text-[9px] leading-snug text-slate-500 dark:text-slate-400">
                                  {page.description}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setForm(null)}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-[11px] font-bold text-slate-700 transition-colors hover:bg-white dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-5 py-2.5 text-[11px] font-bold text-white shadow-md shadow-orange-600/20 transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {saving ? "Menyimpan..." : "Simpan Akun"}
                      </button>
                    </div>
                  </form>
                </AdminModal>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[940px] border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 dark:border-white/10 dark:bg-white/[0.03]">
                      <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                        Akun
                      </th>
                      <th className="w-32 px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                        Role
                      </th>
                      <th className="w-28 px-4 py-3 text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                        Halaman Diizinkan
                      </th>
                      <th className="w-40 px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                        Diperbarui
                      </th>
                      <th className="w-24 px-4 py-3 text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Akun Superadmin bawaan — selalu tampil di daftar */}
                    <tr className="border-b border-purple-100 bg-purple-50/40 dark:border-purple-500/10 dark:bg-purple-500/[0.04]">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                            {superadminInfo.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="block truncate text-xs font-bold text-slate-900 dark:text-white">
                                {superadminInfo.name}
                              </span>
                              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                                Superadmin
                              </span>
                            </div>
                            <span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">
                              {superadminInfo.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                          Superadmin
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Aktif
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[9px] font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                          Semua halaman ({EDITABLE_PAGES.length})
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[10px] text-slate-500 dark:text-slate-400">Akun bawaan</td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          title="Akun Superadmin tidak dapat diubah dari sini"
                          className="inline-flex text-slate-400"
                        >
                          <Lock className="h-3.5 w-3.5" />
                        </span>
                      </td>
                    </tr>

                    {accountsLoading ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center">
                          <span className="mx-auto block h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                            Memuat akun internal dari database...
                          </p>
                        </td>
                      </tr>
                    ) : accounts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center">
                          <Users className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
                          <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                            Belum ada akun internal
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            Klik “Tambah Akun” untuk membuat akun staf pertama.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      accounts.map((account) => {
                        const labels = getPageLabels(account.pageAccess);
                        return (
                          <tr
                            key={account.id}
                            className="border-b border-slate-100 transition-colors last:border-0 hover:bg-orange-50/30 dark:border-white/5 dark:hover:bg-orange-500/[0.04]"
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                                  {account.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <span className="block truncate text-xs font-bold text-slate-900 dark:text-white">
                                    {account.name}
                                  </span>
                                  <span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">
                                    {account.email}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                                Admin Internal
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                  account.isActive
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                    : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    account.isActive ? "bg-emerald-500" : "bg-slate-400"
                                  }`}
                                />
                                {account.isActive ? "Aktif" : "Nonaktif"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              {labels.length === 0 ? (
                                <span className="text-[10px] italic text-slate-400 dark:text-slate-500">
                                  Belum ada halaman
                                </span>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {labels.map((label) => (
                                    <span
                                      key={label}
                                      className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300"
                                    >
                                      {label}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-[10px] text-slate-500 dark:text-slate-400">
                              {formatDateTime(account.updatedAt)}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => void openEditForm(account)}
                                  title={`Edit ${account.name}`}
                                  aria-label={`Edit ${account.name}`}
                                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-orange-500/10 dark:hover:text-orange-400"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleDeleteAccount(account)}
                                  title={`Hapus ${account.name}`}
                                  aria-label={`Hapus ${account.name}`}
                                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Matriks akses halaman */}
            {accounts.length > 0 && (
              <section className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs dark:border-white/10 dark:bg-[#151528]">
                <div className="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-white/5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Matriks Akses Halaman</h2>
                      {isMatrixDirty && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Belum disimpan
                        </span>
                      )}
                    </div>
                    <p className="mt-1 max-w-2xl text-[11px] text-slate-500 dark:text-slate-400">
                      Centang halaman yang boleh diedit oleh masing-masing akun. Checkbox tampil langsung di sel tabel;
                      gunakan “Pilih Semua” per akun untuk menyalakan seluruh halaman.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDiscardMatrix}
                      disabled={!isMatrixDirty}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      Batalkan
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleSaveMatrix()}
                      disabled={!isMatrixDirty}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-[11px] font-bold text-white shadow-md shadow-orange-600/20 transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Simpan Perubahan
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90 dark:border-white/10 dark:bg-white/[0.03]">
                        <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                          Akun
                        </th>
                        {EDITABLE_PAGES.map((page) => (
                          <th
                            key={page.key}
                            title={page.description}
                            className="w-20 px-2 py-3.5 text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200"
                          >
                            {page.shortLabel}
                          </th>
                        ))}
                        <th className="w-28 px-4 py-3.5 text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                          Pilih Semua
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((account) => {
                        const row = matrix[account.id] ?? [];
                        const granted = EDITABLE_PAGES.filter((page) => row.includes(page.key)).length;
                        const allGranted = granted === EDITABLE_PAGES.length;
                        const partial = granted > 0 && !allGranted;

                        return (
                          <tr
                            key={account.id}
                            className="border-b border-slate-100 transition-colors last:border-0 hover:bg-orange-50/40 dark:border-white/5 dark:hover:bg-orange-500/[0.04]"
                          >
                            <td className="px-5 py-3.5">
                              <span className="block text-xs font-bold text-slate-900 dark:text-white">
                                {account.name}
                              </span>
                              <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                                {account.email}
                                {!account.isActive && " · nonaktif"}
                              </span>
                            </td>

                            {EDITABLE_PAGES.map((page) => (
                              <td key={page.key} className="px-2 py-3.5 text-center">
                                <MatrixCheckbox
                                  checked={row.includes(page.key)}
                                  onChange={(checked) => toggleMatrixPage(account.id, page.key, checked)}
                                  label={`${page.label} untuk ${account.name}`}
                                />
                              </td>
                            ))}

                            <td className="px-4 py-3.5">
                              <div className="flex items-center justify-center gap-1.5">
                                <MatrixCheckbox
                                  checked={allGranted}
                                  indeterminate={partial}
                                  onChange={(checked) => toggleMatrixAll(account.id, checked)}
                                  label={`Pilih semua halaman untuk ${account.name}`}
                                />
                                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                  Semua
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-3 text-[10px] text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex items-center gap-1.5">
                    <Info className="h-3 w-3" />
                    Perubahan matriks baru berlaku setelah menekan “Simpan Perubahan”.
                  </span>
                  <span>
                    {accounts.length} akun · {EDITABLE_PAGES.length} halaman
                  </span>
                </div>
              </section>
            )}

            <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
              <Info className="mt-0.5 h-3 w-3 shrink-0" />
              Akun internal dan hak akses halaman disimpan di database, sehingga berlaku lintas browser/perangkat. Kata
              sandi disimpan sebagai hash <strong>scrypt</strong>, bukan teks asli.
            </p>
          </>
        ) : (
          <div className="space-y-6">
            {resetSuccess && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Semua data berhasil di-reset kembali ke data bawaan resmi CITS Indonesia!</span>
              </div>
            )}

            <div className="max-w-2xl space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#151528] md:p-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 font-bold text-white">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Akun Administrator Aktif</h2>
                  <p className="text-xs text-slate-500">Sesi Superadmin dengan akses penuh ke seluruh sistem</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/5">
                  <span className="text-slate-500">Nama Akun:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {session?.user.name || "Administrator CITS"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/5">
                  <span className="text-slate-500">Email Login:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {session?.user.email || "admin@cits.id"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/5">
                  <span className="text-slate-500">Tingkat Hak Akses:</span>
                  <span className="rounded bg-orange-50 px-2 py-0.5 font-bold text-orange-600 dark:bg-orange-500/10">
                    Superadmin (Full Access)
                  </span>
                </div>
              </div>
            </div>

            <div className="max-w-2xl space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#151528] md:p-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 font-bold text-white">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Pemeliharaan Data & Reset Default
                  </h2>
                  <p className="text-xs text-slate-500">
                    Kembalikan semua produk, kontak, dan narasi profil ke kondisi awal
                  </p>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Gunakan tombol di bawah jika Anda ingin menghapus seluruh riwayat edit percobaan dan mengembalikan data
                produk, kontak Wisma Mampang, dan profil CITS kembali seperti semula.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset Semua Data ke Awal</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
