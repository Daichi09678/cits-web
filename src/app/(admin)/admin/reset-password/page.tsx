"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock, ShieldCheck } from "lucide-react";
import { passwordStrength, validateNewPassword } from "@/lib/password";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => passwordStrength(newPassword), [newPassword]);
  const match = confirmPassword.length > 0 && newPassword === confirmPassword;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const validationError = validateNewPassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi belum cocok.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const payload = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Kata sandi gagal diperbarui.");
      }
      setSuccess(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Kata sandi gagal diperbarui.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 text-slate-900 transition-colors dark:bg-[#0c0c16] dark:text-white sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl dark:bg-orange-600/15"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/95 p-7 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-[#16162d]/95 dark:shadow-black/50 sm:p-9">
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              <Image
                src="/logo.webp"
                alt="Logo CITS Indonesia"
                width={150}
                height={44}
                unoptimized
                className="block h-9 w-auto dark:hidden"
                priority
              />
              <Image
                src="/logo-dark.webp"
                alt="Logo CITS Indonesia"
                width={150}
                height={44}
                unoptimized
                className="hidden h-9 w-auto dark:block"
                priority
              />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-900 shadow-2xs dark:border-orange-800/60 dark:bg-orange-950/60 dark:text-orange-300">
              <ShieldCheck className="h-3.5 w-3.5 text-orange-700 dark:text-orange-400" />
              Keamanan Akun
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Buat Kata Sandi Baru
            </h1>
            <p className="mx-auto max-w-xs text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Masukkan kata sandi baru untuk akun back office Anda.
            </p>
          </div>

          {!token ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Tautan tidak valid</h2>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Tautan reset tidak ditemukan. Minta tautan baru dari halaman login.
                </p>
              </div>
              <Link
                href="/admin/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-700 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-orange-800"
              >
                Kembali ke Login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : success ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Kata sandi berhasil diperbarui
                </h2>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Silakan masuk kembali menggunakan kata sandi baru Anda.
                </p>
              </div>
              <Link
                href="/admin/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-700 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-orange-800"
              >
                Masuk ke Back Office
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[11px] leading-relaxed text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="reset-new-password"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                >
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reset-new-password"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    placeholder="Minimal 8 karakter"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((value) => !value)}
                    aria-label={showNew ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  Kekuatan kata sandi
                </span>
                <span className={`text-[10px] font-bold ${strength.textClass}`}>{strength.label}</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((segment) => (
                  <span
                    key={segment}
                    className={`h-1.5 flex-1 rounded-full ${segment <= strength.score ? strength.barClass : "bg-slate-200 dark:bg-white/10"}`}
                  />
                ))}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="reset-confirm-password"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                >
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reset-confirm-password"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    placeholder="Ulangi kata sandi baru"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((value) => !value)}
                    aria-label={showConfirm ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p
                    className={`text-[10px] font-semibold ${match ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-300"}`}
                  >
                    {match ? "Konfirmasi cocok." : "Konfirmasi belum cocok."}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-700 px-4 py-3.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition-all hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                {loading ? "Menyimpan kata sandi..." : "Simpan Kata Sandi Baru"}
              </button>

              <p className="text-center text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
                Tautan ini hanya berlaku 60 menit dan hanya dapat digunakan satu kali.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-xs text-slate-500">Memuat halaman...</div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
