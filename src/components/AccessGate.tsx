"use client";

import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const EXPECTED_HASH = "558e8f4fab194ea1359f70deb1dd90a8";
const SALT = "cits-salt-2025";

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key + SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export default function AccessGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cits-access");
    if (stored === EXPECTED_HASH) {
      setUnlocked(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputHash = await hashKey(inputKey);
    if (inputHash === EXPECTED_HASH) {
      localStorage.setItem("cits-access", EXPECTED_HASH);
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setInputKey("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-brand-light dark:from-[#0B0B1E] dark:via-[#1A1A2E] dark:to-[#0B0B1E] p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#16162c] rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-8 transition-colors">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image src="/logo.webp" alt="CITS Indonesia" width={180} height={54} className="h-12 w-auto block dark:hidden" priority />
              <Image src="/logo-dark.webp" alt="CITS Indonesia" width={180} height={54} className="h-12 w-auto hidden dark:block" priority />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/70 dark:border-orange-800/50 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pratinjau Terproteksi</h1>
            <p className="text-sm text-gray-700 dark:text-white/85 mt-2">Masukkan kunci akses untuk membuka website ini</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={inputKey}
                onChange={(e) => { setInputKey(e.target.value); setError(false); }}
                placeholder="Masukkan kunci akses"
                className={`w-full px-4 py-3 pr-12 rounded-xl border bg-gray-50 dark:bg-[#121222] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none transition-all ${
                  error ? "border-red-400 ring-2 ring-red-100 dark:ring-red-950/40" : "border-gray-200 dark:border-white/15 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/60 hover:text-gray-700 dark:hover:text-white"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Kunci akses tidak sesuai. Silakan coba lagi.</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Buka Akses
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-xs text-gray-700 dark:text-white/80 text-center mt-6">
            &copy; {new Date().getFullYear()} CITS Indonesia. Hak cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
    </div>
  );
}
