"use client";
import { useState } from "react";
import { CheckCircle2, Key, RefreshCw } from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import SecuritySettings from "@/components/admin/SecuritySettings";
import { useAdminDialog } from "@/components/admin/AdminDialogProvider";
import AccountsSettings from "@/components/admin/settings/AccountsSettings";
import SettingsTabs, { type SettingsTab } from "@/components/admin/settings/SettingsTabs";
import { settingsFont } from "@/components/admin/settings/typography";
import { useAdminAuth } from "@/lib/auth";
import { isSuperadminRole } from "@/lib/internalAccess";
import { useCitsStore } from "@/stores/citsStore";
export default function AdminSettingsPage() {
  const { session, loading } = useAdminAuth();
  const { actions } = useCitsStore();
  const dialog = useAdminDialog();
  const [tab, setTab] = useState<SettingsTab>("accounts");
  const [resetSuccess, setResetSuccess] = useState(false);
  const isSuperadmin = isSuperadminRole(session?.user.role);
  const activeTab = isSuperadmin ? tab : "security";
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

  if (loading)
    return (
      <div role="status" className="flex flex-1 items-center justify-center p-10 text-sm text-slate-500">
        Memuat pengaturan...
      </div>
    );
  if (!session) return null;
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminTopbar
        title="Pengaturan Back Office"
        description={
          isSuperadmin
            ? "Kelola akun internal, hak akses per halaman, keamanan, dan pemeliharaan data."
            : "Kelola keamanan akun dan kata sandi Anda"
        }
      />
      <div className={activeTab === "accounts" ? "flex-1 bg-[#F8FAFC] dark:bg-[#0F0F1A]" : ""}>
        <div
          className={
            "mx-auto w-full max-w-[1500px] space-y-5 p-4 sm:p-6 lg:p-8 " +
            (activeTab === "accounts" ? settingsFont.className : "")
          }
        >
          {isSuperadmin && <SettingsTabs value={activeTab} onChange={setTab} />}
          <div
            id="settings-panel"
            role={isSuperadmin ? "tabpanel" : undefined}
            aria-labelledby={isSuperadmin ? "tab-" + activeTab : undefined}
          >
            {activeTab === "accounts" ? (
              <AccountsSettings />
            ) : activeTab === "security" ? (
              <SecuritySettings />
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
                      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Akun Administrator Aktif
                      </h2>
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
                    Gunakan tombol di bawah jika Anda ingin menghapus seluruh riwayat edit percobaan dan mengembalikan
                    data produk, kontak Wisma Mampang, dan profil CITS kembali seperti semula.
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
      </div>
    </div>
  );
}
