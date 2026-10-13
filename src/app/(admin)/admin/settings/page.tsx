"use client";

import { useState } from "react";
import { Settings, RefreshCw, ShieldCheck, CheckCircle2, AlertTriangle, Key } from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useCitsStore } from "@/database/store";
import { useAdminAuth } from "@/lib/auth";

export default function AdminSettingsPage() {
  const { actions, products, messages } = useCitsStore();
  const { session } = useAdminAuth();

  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (confirm("Peringatan: Semua data yang telah Anda edit atau tambahkan akan dikembalikan ke data awal default pabrik. Lanjutkan?")) {
      actions.resetAllToDefault();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <AdminTopbar
        title="Pengaturan Sistem Back Office"
        description="Konfigurasi akun admin, sinkronisasi data lokal, dan pemeliharaan sistem"
      />

      {resetSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Semua data berhasil di-reset kembali ke data bawaan resmi CITS Indonesia!</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4 max-w-2xl">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Akun Administrator Aktif
            </h3>
            <p className="text-xs text-slate-500">
              Hak akses super administrator untuk seluruh modul CMS
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <span className="text-slate-500">Nama Akun:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {session?.user.name || "Administrator CITS"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <span className="text-slate-500">Email Login:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {session?.user.email || "admin@cits.id"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <span className="text-slate-500">Tingkat Hak Akses:</span>
            <span className="font-bold text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded">
              Super Admin (Full Access)
            </span>
          </div>
        </div>
      </div>

      {/* Database Maintenance & Reset Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4 max-w-2xl">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Pemeliharaan Data & Reset Default
            </h3>
            <p className="text-xs text-slate-500">
              Kembalikan semua produk, kontak, dan narasi profil ke kondisi awal
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Gunakan tombol di bawah jika Anda ingin menghapus seluruh riwayat edit percobaan dan mengembalikan data produk, kontak Wisma Mampang, dan profil CITS kembali seperti semula.
        </p>

        <div className="pt-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Semua Data ke Awal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
