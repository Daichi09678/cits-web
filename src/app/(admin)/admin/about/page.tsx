"use client";

import AdminTopbar from "@/components/admin/AdminTopbar";
import AboutContentEditor from "@/components/admin/about/AboutContentEditor";

export default function AdminAboutPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminTopbar
        title="Manajemen Tentang Kami"
        description="Kelola narasi profil perusahaan, visi, misi, dan angka statistik pencapaian CITS Indonesia."
      />
      <AboutContentEditor />
    </div>
  );
}
