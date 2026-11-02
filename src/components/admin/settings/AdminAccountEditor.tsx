"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  LoaderCircle,
  Lock,
  Mail,
  Power,
  Save,
  User,
  UserPlus,
} from "lucide-react";
import { createInternalAccount, updateInternalAccount } from "@/lib/internalAccountsApi";
import {
  normalizePermissions,
  applyAccessPreset,
  getAccessPreset,
  validateAccountPassword,
  type InternalAccountInput,
  type PageKey,
  type PublicInternalAccount,
  type PagePermissions,
} from "@/lib/internalAccess";
import { passwordStrength } from "@/lib/password";
import { sendAdminResetLink } from "@/lib/passwordApi";
import AccessInformationPanel from "./AccessInformationPanel";
import PermissionMatrix from "./PermissionMatrix";
import { cardClass, fieldClass, primaryButton, secondaryButton } from "./styles";

const matrixId = "admin-permission-matrix";

export default function AdminAccountEditor({
  account,
  variant = "inline",
  onSaved,
  onCancel,
  onAccessSaved,
}: {
  account: PublicInternalAccount | null;
  variant?: "inline" | "dialog";
  onSaved: (account: PublicInternalAccount) => void;
  onCancel: () => void;
  onAccessSaved?: (account: PublicInternalAccount) => void;
}) {
  const isDialog = variant === "dialog";
  const [name, setName] = useState(account?.name ?? "");
  const [email, setEmail] = useState(account?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [permissions, setPermissions] = useState(() => normalizePermissions(account?.permissions, account?.pageAccess));
  const [active, setActive] = useState(account?.isActive ?? true);
  const [validation, setValidation] = useState("");
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetResult, setResetResult] = useState<{ message: string; success: boolean } | null>(null);
  const [statusBusy, setStatusBusy] = useState(false);
  const [statusError, setStatusError] = useState("");
  const permissionSavePending = useRef(false);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [permissionNotice, setPermissionNotice] = useState("");
  const [permissionError, setPermissionError] = useState("");

  const changePermissions = async (next: PagePermissions) => {
    if (permissionSavePending.current || busy || statusBusy) return;
    const previous = permissions;
    setPermissions(next);
    setPermissionError("");
    setPermissionNotice("");
    if (!account) return;
    permissionSavePending.current = true;
    setSavingPermissions(true);
    try {
      // Only persist access changes here; profile edits remain in the form draft.
      const saved = await updateInternalAccount(account.id, {
        name: account.name,
        email: account.email,
        isActive: account.isActive,
        permissions: next,
        pageAccess: Object.keys(next) as PageKey[],
      });
      if (saved?.id !== account.id) throw new Error("Server belum mengonfirmasi perubahan hak akses.");
      setPermissions(normalizePermissions(saved.permissions, saved.pageAccess));
      setPermissionNotice("Hak akses tersimpan. Akun terkait akan mengikuti izin terbaru tanpa login ulang.");
      onAccessSaved?.(saved);
    } catch (error) {
      setPermissions(previous);
      setPermissionError(error instanceof Error ? error.message : "Hak akses gagal disimpan. Coba lagi.");
    } finally {
      permissionSavePending.current = false;
      setSavingPermissions(false);
    }
  };

  const strength = passwordStrength(password);
  const mismatch = confirmation.length > 0 && password !== confirmation;

  const resetForm = () => {
    setName(account?.name ?? "");
    setEmail(account?.email ?? "");
    setPassword("");
    setConfirmation("");
    setPermissions(normalizePermissions(account?.permissions, account?.pageAccess));
    setActive(account?.isActive ?? true);
    setValidation("");
    setServerError("");
    setResetResult(null);
    onCancel();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || permissionSavePending.current || statusBusy) return;
    const issue =
      name.trim().length < 2
        ? "Nama lengkap minimal 2 karakter."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
          ? "Masukkan email login yang valid."
          : !account
            ? validateAccountPassword(password) ||
              (password !== confirmation ? "Konfirmasi password belum sesuai." : "")
            : "";
    setValidation(issue);
    if (issue) return;

    const input: InternalAccountInput = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      ...(account ? {} : { password }),
      permissions,
      pageAccess: Object.keys(permissions) as PageKey[],
      isActive: active,
    };

    setBusy(true);
    setServerError("");
    try {
      const saved = account ? await updateInternalAccount(account.id, input) : await createInternalAccount(input);
      if (!saved?.id)
        throw new Error("Server tidak mengembalikan data akun. Muat ulang daftar untuk memeriksa hasilnya.");
      onSaved(saved);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Gagal menyimpan akun.");
    } finally {
      setBusy(false);
    }
  };

  const sendReset = async () => {
    if (!account || resetting) return;
    setResetting(true);
    setResetResult(null);
    try {
      setResetResult({ message: await sendAdminResetLink(account.email), success: true });
    } catch (error) {
      setResetResult({
        message: error instanceof Error ? error.message : "Gagal mengirim tautan reset.",
        success: false,
      });
    } finally {
      setResetting(false);
    }
  };

  const toggleStatus = async () => {
    if (!account || statusBusy || permissionSavePending.current || busy) return;
    setStatusBusy(true);
    setStatusError("");
    try {
      const saved = await updateInternalAccount(account.id, {
        name: account.name,
        email: account.email,
        pageAccess: account.pageAccess,
        permissions: account.permissions,
        isActive: !account.isActive,
      });
      if (!saved?.id) throw new Error("Server tidak mengembalikan data akun.");
      onSaved(saved);
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : "Gagal mengubah status akun.");
    } finally {
      setStatusBusy(false);
    }
  };

  return (
    <section
      id={isDialog ? "admin-account-edit" : "admin-account-editor"}
      aria-labelledby={isDialog ? undefined : "admin-account-editor-title"}
      className={isDialog ? "flex min-h-0 min-w-0 flex-1 flex-col" : `${cardClass} scroll-mt-24`}
    >
      <form
        onSubmit={submit}
        className={
          isDialog
            ? "min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5 sm:p-6"
            : "grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:gap-8"
        }
      >
        {isDialog && account && (
          <section
            aria-label="Status akun"
            className="rounded-xl border border-[#E2E8F0] bg-white p-4 dark:border-white/10 dark:bg-[#151528]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#0F172A] dark:text-slate-100">Status Akun</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] leading-relaxed text-[#64748B]">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-semibold ${
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
                  {account.isActive
                    ? "Akun dapat masuk ke Back Office."
                    : "Akun tidak dapat masuk sampai diaktifkan kembali."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void toggleStatus()}
                disabled={statusBusy || busy || savingPermissions}
                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  account.isActive
                    ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                }`}
              >
                {statusBusy ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Power className="size-4" aria-hidden="true" />
                )}
                {statusBusy ? "Memproses..." : account.isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
              </button>
            </div>
            {statusError && (
              <p role="alert" className="mt-2.5 text-[11px] leading-relaxed text-red-600">
                {statusError}
              </p>
            )}
          </section>
        )}

        {/* Kolom kiri: formulir */}
        <div className="min-w-0 space-y-5">
          {!isDialog && (
            <header className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FF4D00] text-white">
                <UserPlus className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2
                  id="admin-account-editor-title"
                  className="text-base font-semibold tracking-tight text-[#0F172A] dark:text-white"
                >
                  Tambah Akun Administrator
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  Buat akun admin internal baru dengan hak akses sesuai kebutuhan.
                </p>
              </div>
            </header>
          )}

          <fieldset
            disabled={busy || savingPermissions || statusBusy}
            className="min-w-0 space-y-5 disabled:opacity-70"
          >
            {/* Informasi Akun */}
            <section className="rounded-lg border border-[#E2E8F0] p-4 dark:border-white/10 sm:p-5">
              <div className="flex items-start gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF1E9] text-[#FF4D00] dark:bg-orange-500/10 dark:text-orange-300">
                  <User className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">Informasi Akun</h3>
                  <p className="mt-0.5 text-[11px] text-[#64748B]">Lengkapi informasi dasar akun administrator.</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-medium text-[#334155] dark:text-slate-300">
                  <span className="mb-2 block">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </span>
                  <span className="relative block">
                    <User
                      className="pointer-events-none absolute top-2.5 left-3 size-4 text-[#94A3B8]"
                      aria-hidden="true"
                    />
                    <input
                      name="name"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={120}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className={`${fieldClass} pl-9`}
                    />
                  </span>
                </label>

                <label className="block text-xs font-medium text-[#334155] dark:text-slate-300">
                  <span className="mb-2 block">
                    Email Login <span className="text-red-500">*</span>
                  </span>
                  <span className="relative block">
                    <Mail
                      className="pointer-events-none absolute top-2.5 left-3 size-4 text-[#94A3B8]"
                      aria-hidden="true"
                    />
                    <input
                      name="email"
                      type="email"
                      autoComplete="off"
                      required
                      maxLength={254}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="contoh@email.com"
                      className={`${fieldClass} pl-9`}
                    />
                  </span>
                </label>

                {!account && (
                  <>
                    <div>
                      <label
                        htmlFor="admin-new-password"
                        className="mb-2 block text-xs font-medium text-[#334155] dark:text-slate-300"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock
                          className="pointer-events-none absolute top-2.5 left-3 size-4 text-[#94A3B8]"
                          aria-hidden="true"
                        />
                        <input
                          id="admin-new-password"
                          type={visible ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          minLength={8}
                          maxLength={128}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          aria-describedby="admin-password-help"
                          placeholder="Minimal 8 karakter"
                          className={`${fieldClass} pr-10 pl-9`}
                        />
                        <button
                          type="button"
                          onClick={() => setVisible(!visible)}
                          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
                          aria-pressed={visible}
                          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-[#94A3B8] hover:text-[#334155] focus-visible:outline-2 focus-visible:outline-[#FF4D00]"
                        >
                          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex flex-1 gap-1" aria-hidden="true">
                          {[1, 2, 3, 4].map((step) => (
                            <span
                              key={step}
                              className={`h-1 flex-1 rounded-full ${
                                step <= strength.score ? strength.barClass : "bg-slate-100 dark:bg-white/10"
                              }`}
                            />
                          ))}
                        </div>
                        <span
                          className={`text-[10px] font-medium ${
                            strength.score === 0
                              ? "text-[#64748B]"
                              : strength.score === 1
                                ? "text-red-600"
                                : strength.score === 2
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                          }`}
                        >
                          {strength.label}
                        </span>
                      </div>
                      <p id="admin-password-help" className="mt-2 text-[11px] leading-relaxed text-[#64748B]">
                        Minimal 8 karakter: huruf besar, huruf kecil, angka, dan simbol.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="admin-confirm-password"
                        className="mb-2 block text-xs font-medium text-[#334155] dark:text-slate-300"
                      >
                        Konfirmasi Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock
                          className="pointer-events-none absolute top-2.5 left-3 size-4 text-[#94A3B8]"
                          aria-hidden="true"
                        />
                        <input
                          id="admin-confirm-password"
                          type={confirmationVisible ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          maxLength={128}
                          value={confirmation}
                          onChange={(event) => setConfirmation(event.target.value)}
                          aria-invalid={mismatch}
                          aria-describedby="admin-confirm-help"
                          placeholder="Ulangi password"
                          className={`${fieldClass} pr-10 pl-9 ${mismatch ? "border-red-400" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => setConfirmationVisible(!confirmationVisible)}
                          aria-label={
                            confirmationVisible ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"
                          }
                          aria-pressed={confirmationVisible}
                          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-[#94A3B8] hover:text-[#334155] focus-visible:outline-2 focus-visible:outline-[#FF4D00]"
                        >
                          {confirmationVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                      <p
                        id="admin-confirm-help"
                        aria-live="polite"
                        className={`mt-2 flex items-center gap-1 text-[11px] ${mismatch ? "text-red-600" : "text-emerald-700 dark:text-emerald-400"}`}
                      >
                        {confirmation &&
                          (mismatch ? (
                            "Konfirmasi password belum sesuai."
                          ) : (
                            <>
                              <Check className="size-3" aria-hidden="true" />
                              Password sesuai.
                            </>
                          ))}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {account && (
                <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 dark:border-white/10 dark:bg-white/5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#0F172A] dark:text-slate-100">Reset Password</p>
                      <p className="mt-0.5 truncate text-[11px] text-[#64748B]">
                        Kirim tautan reset ke email tersimpan: {account.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void sendReset()}
                      disabled={resetting}
                      className={secondaryButton}
                    >
                      {resetting ? <LoaderCircle className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
                      Kirim Tautan Reset
                    </button>
                  </div>
                  {resetResult && (
                    <p
                      role={resetResult.success ? "status" : "alert"}
                      className={`mt-2.5 text-[11px] ${resetResult.success ? "text-emerald-700" : "text-red-600"}`}
                    >
                      {resetResult.message}
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Hak Akses & Role */}
            <section className="rounded-lg border border-[#E2E8F0] p-4 dark:border-white/10 sm:p-5">
              <div className="flex items-start gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF1E9] text-[#FF4D00] dark:bg-orange-500/10 dark:text-orange-300">
                  <UserPlus className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">Hak Akses &amp; Role</h3>
                  <p className="mt-0.5 text-[11px] text-[#64748B]">
                    Tentukan role dan halaman yang dapat diakses oleh akun ini.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-medium text-[#334155] dark:text-slate-300">
                  <span className="mb-2 block">
                    Role / Tingkat Hak Akses <span className="text-red-500">*</span>
                  </span>
                  <select
                    value={getAccessPreset(permissions)}
                    onChange={(event) => {
                      const preset = event.target.value;
                      if (preset === "view" || preset === "edit")
                        void changePermissions(applyAccessPreset(permissions, preset));
                    }}
                    className={fieldClass}
                  >
                    <option value="custom" disabled>
                      Admin Internal — Izin Kustom
                    </option>
                    <option value="view">Admin Internal — Lihat saja</option>
                    <option value="edit">Admin Internal — Lihat &amp; Edit</option>
                  </select>
                </label>
                <label className="block text-xs font-medium text-[#334155] dark:text-slate-300">
                  <span className="mb-2 block">Status Akun</span>
                  <select
                    value={active ? "active" : "inactive"}
                    onChange={(event) => setActive(event.target.value === "active")}
                    className={fieldClass}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </label>
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#EFF6FF] p-3 text-[11px] leading-relaxed text-[#1D4ED8] dark:bg-blue-500/10 dark:text-blue-200">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                <p>
                  Admin Internal hanya dapat mengakses modul yang diberikan Superadmin. Tingkat akses berlaku pada modul
                  terpilih; jika belum ada pilihan, berlaku pada semua modul. Lihat &amp; Edit tidak memberikan izin
                  Tambah atau Hapus.
                </p>
              </div>

              <div className="mt-4">
                <PermissionMatrix
                  id={matrixId}
                  value={permissions}
                  onChange={(next) => void changePermissions(next)}
                  disabled={busy || savingPermissions || statusBusy}
                />
              </div>
              <p role="status" aria-live="polite" className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {savingPermissions
                  ? "Menyimpan hak akses..."
                  : permissionNotice ||
                    (account
                      ? "Perubahan hak akses langsung disimpan saat dipilih."
                      : "Hak akses disimpan setelah akun baru dibuat.")}
              </p>
              {permissionError && (
                <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {permissionError}
                </p>
              )}
            </section>
          </fieldset>
        </div>

        {/* Kolom kanan: informasi & aksi */}
        <div className="flex min-w-0 flex-col gap-4">
          <AccessInformationPanel
            permissions={permissions}
            active={active}
            onShowDetail={() =>
              document.getElementById(matrixId)?.scrollIntoView({ behavior: "smooth", block: "center" })
            }
          />

          {(validation || serverError) && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-[11px] leading-relaxed text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            >
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              {validation || serverError}
            </p>
          )}
        </div>

        <div
          className={
            isDialog
              ? "sticky bottom-0 z-10 -mx-5 -mb-5 flex flex-col-reverse gap-2 border-t border-[#E2E8F0] bg-white px-5 py-3 sm:-mx-6 sm:-mb-6 sm:flex-row sm:justify-end sm:px-6 dark:border-white/10 dark:bg-[#151528]"
              : "flex flex-col-reverse gap-2 lg:col-start-2 lg:row-start-2 sm:flex-row sm:justify-end"
          }
        >
          <button
            type="button"
            disabled={busy || savingPermissions || statusBusy}
            onClick={resetForm}
            className={secondaryButton}
          >
            Batal
          </button>
          <button type="submit" disabled={busy || savingPermissions || statusBusy} className={primaryButton}>
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
            {busy ? "Menyimpan..." : account ? "Simpan Perubahan" : "Simpan Akun Administrator"}
          </button>
        </div>
      </form>
    </section>
  );
}
