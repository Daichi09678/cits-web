"use client";

import { useState } from "react";
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
import ThemeToggle from "@/components/layout/ThemeToggle";
import GridPattern from "@/components/ui/GridPattern";
import AdminModal from "@/components/admin/AdminModal";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setForgotError("");
    setForgotLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const payload = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!response.ok || payload.success === false) {
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
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#0c0c16] text-slate-900 dark:text-white transition-colors overflow-hidden">
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
        <div className="p-7 sm:p-9 rounded-3xl bg-white/95 dark:bg-[#16162d]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 space-y-6">
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

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 text-[11px] font-bold tracking-wide uppercase shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-700 dark:text-orange-400" />
              <span>Back Office • Sistem Kontrol CMS</span>
            </div>

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
              className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 shadow-2xs animate-shake"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email-input"
                className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5"
              >
                Email Akun <span className="text-red-500">*</span>
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
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maswahyuganteng@cits.id"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password-input"
                  className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider"
                >
                  Kata Sandi <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={openForgotPassword}
                  className="text-[10px] font-bold text-orange-600 transition-colors hover:text-orange-700 hover:underline dark:text-orange-400 dark:hover:text-orange-300"
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
                />
                <span>Ingat sesi di peramban ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 active:scale-[0.99] text-white font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-md shadow-orange-600/20 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Hak Akses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard Back Office</span>
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
              <span>CV CITS Indonesia • Wisma Mampang Lt. 5</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Sistem Terproteksi IDDS & SPBE. Akses terbatas hanya untuk staf berwenang.
            </p>
          </div>
        </div>
      </div>

      <AdminModal
        open={forgotOpen}
        onClose={() => {
          if (!forgotLoading) setForgotOpen(false);
        }}
        title="Lupa Kata Sandi"
        description="Masukkan email akun back office Anda. Kami akan mengirim tautan untuk membuat kata sandi baru."
        icon={KeyRound}
        size="md"
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-700"
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
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
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                  placeholder="nama@cits.id"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={forgotLoading || forgotEmail.trim().length === 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-xs font-bold text-white shadow-sm shadow-orange-600/25 transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {forgotLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {forgotLoading ? "Mengirim tautan..." : "Kirim Tautan Reset"}
            </button>

            <p className="text-center text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
              Demi keamanan, kami tidak menampilkan apakah email tersebut terdaftar atau tidak.
            </p>
          </form>
        )}
      </AdminModal>
    </div>
  );
}
