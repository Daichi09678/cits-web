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
  KeyRound,
  CheckCircle2,
  Sparkles,
  Building2,
} from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import ThemeToggle from "@/components/layout/ThemeToggle";
import GridPattern from "@/components/ui/GridPattern";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState("maswahyuganteng@cits.id");
  const [password, setPassword] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fillOfficialCredentials = () => {
    setEmail("maswahyuganteng@cits.id");
    setPassword("admin");
    setError("");
  };

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

          {/* Quick Demo Credentials Switcher */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                Kredensial Administrator:
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Klik untuk isi otomatis</span>
            </div>

            <button
              type="button"
              onClick={fillOfficialCredentials}
              className="w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer bg-orange-50/80 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800 text-orange-900 dark:text-orange-200 shadow-2xs hover:border-orange-500"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                  Email Resmi Administrator
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-200/70 dark:bg-orange-900/60 text-orange-800 dark:text-orange-200">
                  Password: admin
                </span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono mt-1 font-medium">
                maswahyuganteng@cits.id
              </div>
            </button>
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
                Email Resmi Administrator <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email-input"
                  name="email"
                  type="text"
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
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Terenkripsi SHA-256</span>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
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
    </div>
  );
}
