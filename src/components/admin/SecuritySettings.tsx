"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import { useAdminDialog } from "@/components/admin/AdminDialogProvider";
import { changeAdminPassword, sendAdminResetLink } from "@/lib/passwordApi";
import { passwordStrength, validateNewPassword } from "@/lib/password";
import { fetchInternalAccounts } from "@/lib/internalAccountsApi";
import type { PublicInternalAccount } from "@/lib/internalAccess";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete: string;
  placeholder?: string;
}

function PasswordField({ id, label, value, onChange, show, onToggle, autoComplete, placeholder }: PasswordFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
      >
        <LockKeyhole className="h-3.5 w-3.5 text-orange-500" />
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`${inputClass} pr-11`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default function SecuritySettings() {
  const { session } = useAdminAuth();
  const dialog = useAdminDialog();
  const isSuperadmin = (session?.user.role || "").toLowerCase().includes("super");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [accounts, setAccounts] = useState<PublicInternalAccount[]>([]);
  const [superadminEmail, setSuperadminEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);

  const strength = useMemo(() => passwordStrength(newPassword), [newPassword]);
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const canSubmitPassword =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    passwordsMatch &&
    !savingPassword;

  useEffect(() => {
    if (!isSuperadmin) return;
    let cancelled = false;

    fetchInternalAccounts()
      .then((data) => {
        if (cancelled) return;
        setAccounts(data.accounts);
        setSuperadminEmail(data.superadmin?.email || "");
      })
      .catch(() => {
        // Daftar email hanya membantu autocomplete; kegagalan tidak memblokir form.
      });

    return () => {
      cancelled = true;
    };
  }, [isSuperadmin]);

  async function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!currentPassword) {
      await dialog.alert({
        title: "Kata sandi saat ini kosong",
        description: "Masukkan kata sandi yang sedang Anda gunakan.",
        variant: "warning",
      });
      return;
    }

    const validationError = validateNewPassword(newPassword);
    if (validationError) {
      await dialog.alert({ title: "Kata sandi baru belum valid", description: validationError, variant: "warning" });
      return;
    }

    if (newPassword !== confirmPassword) {
      await dialog.alert({
        title: "Konfirmasi tidak cocok",
        description: "Kata sandi baru dan konfirmasi harus sama.",
        variant: "warning",
      });
      return;
    }

    setSavingPassword(true);
    try {
      const message = await changeAdminPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await dialog.alert({
        title: "Kata sandi berhasil diperbarui",
        description: message,
        variant: "success",
      });
    } catch (error) {
      await dialog.alert({
        title: "Kata sandi gagal diperbarui",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan kata sandi.",
        variant: "danger",
      });
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleResetSubmit(event: React.FormEvent) {
    event.preventDefault();
    const email = resetEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      await dialog.alert({
        title: "Email belum valid",
        description: "Masukkan alamat email asli yang terdaftar pada akun internal.",
        variant: "warning",
      });
      return;
    }

    const knownEmails = new Set(accounts.map((account) => account.email.toLowerCase()));
    if (superadminEmail) knownEmails.add(superadminEmail.toLowerCase());

    if (knownEmails.size > 0 && !knownEmails.has(email)) {
      await dialog.alert({
        title: "Email tidak terdaftar",
        description:
          "Email tersebut tidak ada di daftar akun internal. Gunakan email asli yang terdaftar agar tautan reset benar-benar sampai.",
        variant: "warning",
      });
      return;
    }

    setSendingReset(true);
    try {
      const message = await sendAdminResetLink(email);
      setResetEmail("");
      await dialog.alert({
        title: "Tautan reset dikirim",
        description: message,
        variant: "success",
      });
    } catch (error) {
      await dialog.alert({
        title: "Tautan reset gagal dikirim",
        description: error instanceof Error ? error.message : "Periksa konfigurasi email server.",
        variant: "danger",
      });
    } finally {
      setSendingReset(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-blue-200/70 bg-gradient-to-r from-blue-50 via-sky-50/60 to-transparent p-4 dark:border-blue-500/20 dark:from-blue-500/10 dark:via-sky-500/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/25">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white">Pusat Keamanan Akun</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Ganti kata sandi Anda sendiri. Superadmin juga dapat mengirim tautan reset ke email asli akun internal.
            </p>
          </div>
        </div>
        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:border-blue-500/30 dark:bg-black/10 dark:text-blue-200">
          <LockKeyhole className="h-3 w-3" />
          Sesi Terenkripsi
        </span>
      </div>

      <div className={`grid gap-5 ${isSuperadmin ? "lg:grid-cols-2" : "max-w-2xl"}`}>
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#151528] sm:p-6">
          <div className="flex items-start gap-3 border-b border-slate-100 pb-4 dark:border-white/5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Ganti Kata Sandi</h3>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
            <PasswordField
              id="current-password"
              label="Kata Sandi Saat Ini"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrent}
              onToggle={() => setShowCurrent((value) => !value)}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi lama"
            />

            <PasswordField
              id="new-password"
              label="Kata Sandi Baru"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              onToggle={() => setShowNew((value) => !value)}
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
            />

            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  Kekuatan kata sandi
                </span>
                <span className={`text-[10px] font-bold ${strength.textClass}`}>{strength.label}</span>
              </div>
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4].map((segment) => (
                  <span
                    key={segment}
                    className={`h-1.5 flex-1 rounded-full ${segment <= strength.score ? strength.barClass : "bg-slate-200 dark:bg-white/10"}`}
                  />
                ))}
              </div>
            </div>

            <PasswordField
              id="confirm-password"
              label="Konfirmasi Kata Sandi Baru"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm((value) => !value)}
              autoComplete="new-password"
              placeholder="Ulangi kata sandi baru"
            />

            {confirmPassword.length > 0 && (
              <p
                className={`flex items-center gap-1.5 text-[11px] font-medium ${passwordsMatch ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-300"}`}
              >
                {passwordsMatch ? <CheckCircle2 className="h-3.5 w-3.5" /> : <LockKeyhole className="h-3.5 w-3.5" />}
                {passwordsMatch ? "Konfirmasi kata sandi cocok." : "Konfirmasi kata sandi belum cocok."}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmitPassword}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-xs font-bold text-white shadow-sm shadow-orange-600/25 transition-all hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              {savingPassword ? "Menyimpan..." : "Perbarui Kata Sandi"}
            </button>
          </form>
        </section>

        {isSuperadmin ? (
          <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#151528] sm:p-6">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4 dark:border-white/5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Kirim Link Reset Kata Sandi</h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Kirim tautan ke email asli milik akun internal. Link berlaku 60 menit.
                </p>
              </div>
            </div>

            <form onSubmit={handleResetSubmit} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="reset-email"
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                >
                  <UserRound className="h-3.5 w-3.5 text-orange-500" />
                  Email Akun Internal
                </label>
                <input
                  id="reset-email"
                  type="email"
                  list="internal-emails"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  placeholder="nama@cits.id"
                  autoComplete="off"
                  className={inputClass}
                />
                <datalist id="internal-emails">
                  {accounts.map((account) => (
                    <option key={account.id} value={account.email}>
                      {account.name}
                    </option>
                  ))}
                  {superadminEmail && <option value={superadminEmail}>Superadmin</option>}
                </datalist>
                <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
                  <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
                  Gunakan email asli yang terdaftar. Sistem akan mengirim tautan langsung ke inbox user tersebut.
                </p>
              </div>

              <button
                type="submit"
                disabled={sendingReset || resetEmail.trim().length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {sendingReset ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sendingReset ? "Mengirim..." : "Kirim Link Reset"}
              </button>

              <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 p-3 text-[10px] leading-relaxed text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                Pastikan SMTP server sudah dikonfigurasi. Jika belum, aplikasi akan menampilkan pesan bahwa layanan
                email belum aktif.
              </div>
            </form>
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#151528] sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Lupa Kata Sandi?</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Keluar dari sesi ini, lalu gunakan tautan <strong>Lupa kata sandi?</strong> di halaman login. Tautan
                  reset akan dikirim ke email akun Anda.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
