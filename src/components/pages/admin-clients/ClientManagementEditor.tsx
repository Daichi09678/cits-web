"use client";
import { adminAction } from "@/components/pages/admin/accentStyles";
import { BackOfficeInput as Input } from "@/components/ui/Input";

import Image from "next/image";
import { Plus, CheckCircle2, Trash2, Edit, Search } from "lucide-react";
import AdminTopbar from "@/components/pages/admin/AdminTopbar";
import Pagination from "@/components/admin/Pagination";
import type { ClientManagementEditorState } from "./useClientManagementEditor";
import FormFeedback from "@/components/ui/FormFeedback";
import ClientManagementDialog from "./ClientManagementDialog";

export default function ClientManagementEditor({ editor }: { editor: ClientManagementEditorState }) {
  const {
    savedSuccess,
    search,
    setSearch,
    setPage,
    canCreate,
    openAddModal,
    paginatedClients,
    canEdit,
    actions,
    dialog,
    openEditModal,
    canDelete,
    page,
    pageSize,
    filteredClients,
  } = editor;
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Mitra Institusi & Klien"
        description="Kelola daftar logo kementerian, lembaga tinggi negara, dan BUMN yang tampil di beranda dan portofolio"
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {savedSuccess && (
          <FormFeedback tone="success" className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Data mitra institusi berhasil disimpan dan disinkronkan ke Front Office!</span>
          </FormFeedback>
        )}

        {/* Top Controls */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nama kementerian / instansi..."
              fieldSize="sm"
              className="w-full"
              withIcon
            />
          </div>

          <button
            disabled={!canCreate}
            onClick={openAddModal}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl ${adminAction} font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer`}
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mitra Baru</span>
          </button>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedClients.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between gap-4 hover:border-orange-500/40 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-2 flex items-center justify-center shrink-0">
                  <Image
                    src={c.logo}
                    alt={c.name}
                    width={40}
                    height={40}
                    unoptimized
                    className="max-h-full w-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target && c.logo.endsWith(".webp")) {
                        target.src = c.logo.replace(/\.webp$/, ".png");
                      }
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs text-slate-900 dark:text-white truncate">{c.name}</span>
                  <span className="block text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
                    {c.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={async () => {
                    try {
                      await actions.updateClient(c.id, { isActive: !c.isActive });
                    } catch (error) {
                      void dialog.alert({
                        title: "Status gagal disimpan",
                        description: error instanceof Error ? error.message : "Silakan coba lagi.",
                        variant: "danger",
                      });
                    }
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                    c.isActive !== false
                      ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                      : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/15 opacity-70"
                  }`}
                  title={
                    c.isActive !== false
                      ? "Mitra Aktif (Klik untuk Sembunyikan)"
                      : "Mitra Sembunyi (Klik untuk Tampilkan)"
                  }
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${c.isActive !== false ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                  />
                  <span>{c.isActive !== false ? "Aktif" : "Sembunyi"}</span>
                </button>
                <button
                  disabled={!canEdit}
                  onClick={() => openEditModal(c)}
                  className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-lg cursor-pointer"
                  title="Edit Mitra"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  disabled={!canDelete}
                  onClick={async () => {
                    const confirmed = await dialog.confirm({
                      title: "Hapus mitra klien?",
                      description: `Logo mitra "${c.name}" akan dihapus dari daftar mitra dan tampilan front office.`,
                      confirmLabel: "Hapus Mitra",
                      variant: "danger",
                    });
                    if (confirmed) {
                      const removed = await actions
                        .deleteClient(c.id)
                        .then(() => true)
                        .catch((error) => {
                          void dialog.alert({
                            title: "Gagal menghapus",
                            description: error instanceof Error ? error.message : "Data gagal dihapus.",
                            variant: "danger",
                          });
                          return false;
                        });
                      if (!removed) return;
                      await dialog.alert({
                        title: "Mitra dihapus",
                        description: `"${c.name}" berhasil dihapus dari daftar mitra.`,
                        variant: "success",
                      });
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer"
                  title="Hapus Mitra"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <Pagination page={page} pageSize={pageSize} total={filteredClients.length} onPageChange={setPage} />

        {/* Modal Add / Edit Client */}
        <ClientManagementDialog editor={editor} />
      </div>
    </div>
  );
}
