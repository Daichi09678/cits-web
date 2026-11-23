"use client";
import { adminAccent, adminAction } from "@/components/pages/admin/accentStyles";
import { BackOfficeInput as Input } from "@/components/ui/Input";
import FieldLabel from "@/components/ui/FieldLabel";
import FormFeedback from "@/components/ui/FormFeedback";

import Image from "next/image";
import { CheckCircle2, Plus, Trash2, Building2, Search, Edit3, X, Check } from "lucide-react";
import type { LandingEditorState } from "./useLandingEditor";
import LandingClientDialog from "./LandingClientDialog";

export default function LandingClientsPanel({ editor }: { editor: LandingEditorState }) {
  const {
    activeTab,
    vis,
    toggleSection,
    formData,
    setFormData,
    clientSuccessMsg,
    clientError,
    clientModalOpen,
    clients,
    canCreateClients,
    openAddClientModal,
    clientMutation,
    clientSearch,
    setClientSearch,
    setClientFilter,
    clientFilter,
    canEditClients,
    openEditClientModal,
    canDeleteClients,
    handleDeleteClient,
  } = editor;
  return (
    <>
      {activeTab === "clients" && (
        <div className="bg-white dark:bg-[#16162d] p-6 rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6 animate-in fade-in">
          {/* Section Active Status Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${vis.clients ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
              />
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Status Section Mitra & Klien (Marquee):{" "}
                {vis.clients ? "Sedang Aktif Ditampilkan" : "Disembunyikan dari Halaman Depan"}
              </span>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/15 bg-white dark:bg-white/10 px-3 py-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={vis.clients}
                onChange={() => toggleSection("clients")}
                aria-label="Tampilkan section ini di beranda"
                className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Tampilkan di beranda</span>
            </label>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-600" />
              <span>Pengaturan Bagian Mitra & Klien (Marquee Logo)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Teks pengantar di atas barisan logo instansi kementerian dan BUMN yang berjalan otomatis di beranda.
            </p>
          </div>

          <div>
            <FieldLabel
              htmlFor="landing-clients-panel-form-data-clients-intro-title-dipercaya-oleh-kementerian-bumn-dan-lembaga-nasional"
              fieldSize="sm"
            >
              Judul Bagian Marquee Klien
            </FieldLabel>
            <Input
              type="text"
              value={formData.clientsIntro?.title || "Dipercaya oleh Kementerian, BUMN, dan Lembaga Nasional"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  clientsIntro: {
                    title: e.target.value,
                  },
                })
              }
              placeholder="e.g. Dipercaya oleh Kementerian, BUMN, dan Lembaga Nasional"
              fieldSize="sm"
              className="w-full"
              id="landing-clients-panel-form-data-clients-intro-title-dipercaya-oleh-kementerian-bumn-dan-lembaga-nasional"
            />
          </div>

          {/* Success Notification for Client Actions */}
          {clientSuccessMsg && (
            <FormFeedback tone="success" className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{clientSuccessMsg}</span>
            </FormFeedback>
          )}

          {clientError && !clientModalOpen && <FormFeedback tone="error">{clientError}</FormFeedback>}

          {/* Header & Controls for Ministries / Clients List */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  <span>Daftar Kementerian, BUMN & Mitra ({clients.length} Terdaftar)</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Kelola nama kementerian, foto logo, dan visibilitasnya yang tampil langsung di barisan beranda.
                </p>
              </div>

              {canCreateClients && (
                <button
                  type="button"
                  onClick={openAddClientModal}
                  disabled={clientMutation !== null}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${adminAction} font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kementerian / Mitra</span>
                </button>
              )}
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="Cari kementerian / instansi..."
                  fieldSize="sm"
                  className="w-full"
                  withIcon
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {["Semua", "Kementerian", "BUMN", "Lembaga", "Swasta"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setClientFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      clientFilter === cat
                        ? `${adminAccent} shadow-xs`
                        : "bg-white dark:bg-[#16162d] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-orange-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Ministries / Clients */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              {clients
                .filter((c) => {
                  const matchSearch =
                    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                    c.category.toLowerCase().includes(clientSearch.toLowerCase());
                  const matchFilter = clientFilter === "Semua" || c.category === clientFilter;
                  return matchSearch && matchFilter;
                })
                .map((c) => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      c.isActive
                        ? "bg-white dark:bg-[#16162d] border-slate-200/90 dark:border-white/10 hover:border-orange-500/40"
                        : "bg-slate-50/60 dark:bg-white/5 border-slate-200/50 dark:border-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-white/10 border border-slate-200/70 dark:border-white/10 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                        <Image
                          src={c.logo}
                          alt={c.name}
                          width={44}
                          height={44}
                          unoptimized
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target && c.logo.endsWith(".webp")) {
                              target.src = c.logo.replace(/\.webp$/, ".png");
                            }
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={c.name}>
                          {c.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                            {c.category}
                          </span>
                          <span
                            className={`text-[10px] font-medium ${
                              c.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                            }`}
                          >
                            {c.isActive ? "Aktif di Beranda" : "Disembunyikan"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        title={
                          c.isActive
                            ? "Sedang tampil di beranda (ubah lewat tombol Edit)"
                            : "Disembunyikan dari beranda (ubah lewat tombol Edit)"
                        }
                        aria-label={c.isActive ? "Status: tampil di beranda" : "Status: disembunyikan"}
                        className={`p-1.5 rounded-lg ${
                          c.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {c.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </span>
                      {canEditClients && (
                        <button
                          type="button"
                          onClick={() => openEditClientModal(c)}
                          disabled={clientMutation !== null}
                          aria-label={`Edit mitra ${c.name}`}
                          title="Edit kementerian / foto"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {canDeleteClients && (
                        <button
                          type="button"
                          onClick={() => handleDeleteClient(c)}
                          disabled={clientMutation !== null}
                          aria-label={clientMutation === c.id ? `Menghapus mitra ${c.name}` : `Hapus mitra ${c.name}`}
                          title="Hapus kementerian"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Modal Add / Edit Ministry & Client */}
          <LandingClientDialog editor={editor} />
        </div>
      )}
    </>
  );
}
