"use client";
import { adminAction } from "@/components/pages/admin/accentStyles";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  CheckCircle2,
  KeyRound,
  Loader2,
  Send,
} from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import ThemeToggle from "@/components/pages/public/ThemeToggle";
import GridPattern from "@/components/ui/GridPattern";
import AdminModal from "@/components/pages/admin/AdminModal";
import { BackOfficeBadge as Badge } from "@/components/ui/Badge";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, loading: checkingSession } = useAdminAuth();
  const forgotEmailField = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || checkingSession) return;
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/admin");
      } else {
        setError(res.message || "Email atau kata sandi tidak cocok dengan akun administrator terdaftar.");
        setLoading(false);
      }
    } catch {
      setError("Terjadi kesalahan saat menghubungi server autentikasi.");
      setLoading(false);
    }
  };

  function openForgotPassword() {
    setForgotEmail(email.trim());
    setForgotSent(false);
    setForgotError("");
    setForgotOpen(true);
  }

  async function handleForgotSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (forgotLoading) return;
    setForgotError("");
    setForgotLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const payload = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!response.ok || payload.success !== true) {
        throw new Error(payload.message || "Permintaan reset kata sandi gagal diproses.");
      }
      setForgotSent(true);
    } catch (forgotSubmitError) {
      setForgotError(
        forgotSubmitError instanceof Error ? forgotSubmitError.message : "Gagal mengirim tautan reset kata sandi."
      );
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#0c0c16] text-slate-900 dark:text-white transition-colors overflow-hidden">
      {/* Background Decorative Patterns */}
      <GridPattern className="opacity-60 dark:opacity-40" />

      {/* Ambient Radial Glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 dark:bg-orange-600/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* Top Bar Utilities */}
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle />
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md z-10 my-16">
        <div className="p-5 sm:p-9 rounded-3xl bg-white/95 dark:bg-[#16162d]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 space-y-6">
          {/* Header Brand & Badge */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              {/* Logo Mode Terang */}
              <Image
                src="/logo.webp"
                alt="Logo Resmi CITS Indonesia"
                width={150}
                height={44}
                unoptimized
                className="h-9 w-auto block dark:hidden"
                priority
              />
              {/* Logo Putih Mode Gelap */}
              <Image
                src="/logo-dark.webp"
                alt="Logo Resmi CITS Indonesia"
                width={150}
                height={44}
                unoptimized
                className="h-9 w-auto hidden dark:block"
                priority
              />
            </div>

            <Badge tone="accent" size="md" className="max-w-full whitespace-normal! uppercase tracking-wide">
              <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0 text-orange-700 dark:text-orange-400" />
              <span>Back Office • Sistem Kontrol CMS</span>
            </Badge>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Autentikasi Administrator
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
              Kelola produk, form kontak, konten tentang kami, dan konfigurasi website instansi secara dinamis.
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div
              role="alert"
              id="admin-login-error"
              className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 shadow-2xs motion-safe:animate-shake"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form
            method="post"
            onSubmit={handleSubmit}
            aria-describedby={error ? "admin-login-error" : undefined}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="admin-email-input"
                className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5"
              >
                Email Akun{" "}
                <span aria-hidden="true" className="text-rose-700 dark:text-rose-300">
                  *
                </span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email-input"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@cits.id"
                  className="min-h-11 w-full rounded-xl border border-control-border bg-slate-50 py-2.5 pl-10 pr-4 font-mono text-sm text-slate-900 placeholder:text-slate-600 focus:border-orange-800 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-300 dark:focus:border-orange-400"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-2">
                <label
                  htmlFor="admin-password-input"
                  className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider"
                >
                  Kata Sandi{" "}
                  <span aria-hidden="true" className="text-rose-700 dark:text-rose-300">
                    *
                  </span>
                </label>
                <button
                  type="button"
                  onClick={openForgotPassword}
                  className="min-h-6 cursor-pointer text-xs font-semibold text-orange-800 underline underline-offset-2 hover:text-orange-950 dark:text-orange-300 dark:hover:text-orange-200"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="min-h-11 w-full rounded-xl border border-control-border bg-slate-50 py-2.5 pl-10 pr-12 font-mono text-sm text-slate-900 placeholder:text-slate-600 focus:border-orange-800 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-300 dark:focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  aria-controls="admin-password-input"
                  className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="size-4" />
                  ) : (
                    <Eye aria-hidden="true" className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || checkingSession}
                className={`w-full py-3.5 ${adminAction} font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 group cursor-pointer shadow-md shadow-orange-600/20 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Hak Akses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>PT Cipta Integrasi Teknologi Solusi • CITS Indonesia</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Sistem Terproteksi IDDS & SPBE. Akses terbatas hanya untuk staf berwenang.
            </p>
          </div>
        </div>
      </div>

      <AdminModal
        open={forgotOpen}
        busy={forgotLoading}
        onClose={() => {
          if (!forgotLoading) setForgotOpen(false);
        }}
        title="Lupa Kata Sandi"
        description="Masukkan email akun back office Anda. Kami akan mengirim tautan untuk membuat kata sandi baru."
        icon={KeyRound}
        size="md"
        initialFocusRef={forgotEmailField}
      >
        {forgotSent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Periksa Kotak Masuk Email</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Jika <strong className="text-slate-700 dark:text-slate-200">{forgotEmail}</strong> terdaftar, tautan
                reset kata sandi sudah dikirim. Periksa inbox dan folder spam.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForgotOpen(false)}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl ${adminAction} px-4 py-2.5 text-xs font-bold transition-colors`}
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          <form method="post" onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Masukkan alamat email asli yang terdaftar pada akun internal atau Superadmin.
            </p>

            {forgotError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[11px] leading-relaxed text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="forgot-email"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
              >
                Email Akun
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  ref={forgotEmailField}
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                  placeholder="nama@cits.id"
                  autoComplete="email"
                  required
                  className="min-h-11 w-full rounded-xl border border-control-border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-600 focus:border-orange-800 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-300 dark:focus:border-orange-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={forgotLoading || forgotEmail.trim().length === 0}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl ${adminAction} px-4 py-3 text-xs font-bold shadow-sm shadow-orange-600/25 transition-colors disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {forgotLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {forgotLoading ? "Mengirim tautan..." : "Kirim Tautan Reset"}
            </button>

            <p className="text-center text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Demi keamanan, kami tidak menampilkan apakah email tersebut terdaftar atau tidak.
            </p>
          </form>
        )}
      </AdminModal>
    </main>
  );
}
