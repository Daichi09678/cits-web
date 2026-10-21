"use client";

import AdminTopbar from "@/components/admin/AdminTopbar";
import SecuritySettings from "@/components/admin/SecuritySettings";

export default function AdminSecuritySettingsPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminTopbar
        title="Keamanan Akun"
        description="Ganti kata sandi akun dan kelola tautan reset untuk pengguna internal."
      />
      <div className="flex-1 bg-white p-4 sm:p-6 lg:p-8 dark:bg-[#0F0F1A]">
        <div className="mx-auto max-w-6xl">
          <SecuritySettings />
        </div>
      </div>
    </div>
  );
}
