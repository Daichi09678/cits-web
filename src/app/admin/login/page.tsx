"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAdminAuth } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState("admin@cits.id");
  const [password, setPassword] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      if (res.success) {
        router.push("/admin");
      } else {
        setError(res.message || "Email atau kata sandi salah.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-white to-orange-50/30 dark:from-[#0F0F1A] dark:via-[#151528] dark:to-[#1B1525]">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#16162D] border border-slate-200/90 dark:border-white/10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-600/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              CITS Back Office
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Masuk ke portal administrasi internal untuk mengelola konten website
            </p>
          </div>

          {/* Quick Demo Credentials Info */}
          <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200/80 dark:border-orange-500/20 text-xs">
            <span className="font-bold text-orange-950 dark:text-orange-200 block mb-1">
              Kredensial Akses Internal:
            </span>
            <div className="text-[11px] text-orange-800 dark:text-orange-300 space-y-0.5">
              <div>Email: <code className="font-bold bg-white/70 dark:bg-black/30 px-1 py-0.5 rounded">admin@cits.id</code> atau <code className="font-bold bg-white/70 dark:bg-black/30 px-1 py-0.5 rounded">admin</code></div>
              <div>Kata Sandi: <code className="font-bold bg-white/70 dark:bg-black/30 px-1 py-0.5 rounded">admin</code> atau <code className="font-bold bg-white/70 dark:bg-black/30 px-1 py-0.5 rounded">admin123</code></div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email / Akun Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cits.id"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Memverifikasi..." : "Masuk ke Back Office"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              ← Kembali ke Beranda Front Office
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
