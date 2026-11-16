"use client";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FormFeedback from "@/components/ui/FormFeedback";

import Image from "next/image";
import { Briefcase, Plus, Search, Edit, Trash2, CheckCircle2, ExternalLink, Building2, Award } from "lucide-react";
import AdminTopbar from "@/components/pages/admin/AdminTopbar";
import PortfolioEditor from "@/components/pages/admin-portfolio/PortfolioEditor";
import type { PortfolioEditorState } from "./usePortfolioEditor";
import PortfolioEditorDialog from "./PortfolioEditorDialog";

export default function PortfolioWorkspace({ editor }: { editor: PortfolioEditorState }) {
  const {
    caseStudies,
    actions,
    savedSuccess,
    activeCount,
    flagshipCount,
    sectorsCount,
    search,
    setSearch,
    sectorFilter,
    setSectorFilter,
    statusFilter,
    setStatusFilter,
    canCreate,
    openAddModal,
    mutationError,
    modalOpen,
    filteredStudies,
    canEdit,
    handleToggleStatus,
    openEditModal,
    canDelete,
    handleDelete,
  } = editor;
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Portofolio & Studi Kasus"
        description="Kelola seluruh rekam jejak kemitraan instansi, capaian proyek nasional, dan rincian arsitektur sistem Front Office"
      />

      <PortfolioEditor studies={caseStudies} onSaveStudies={(next) => actions.saveCaseStudies(next)}>
        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Data portofolio berhasil disimpan dan langsung disinkronkan ke halaman /portfolio!</span>
          </div>
        )}

        {/* Top KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4" aria-label="Ringkasan studi kasus">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Penugasan</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{caseStudies.length}</h4>
              <p className="text-[10px] text-slate-400">Portofolio terdaftar</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aktif di Front Office</p>
              <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{activeCount}</h4>
              <p className="text-[10px] text-slate-400">Tampil di halaman /portfolio</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Proyek Unggulan</p>
              <h4 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{flagshipCount}</h4>
              <p className="text-[10px] text-slate-400">Flagship Banner Atas</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sektor Klien</p>
              <h4 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">{sectorsCount}</h4>
              <p className="text-[10px] text-slate-400">Kategori instansi</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Top Controls & Filter */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex min-w-0 flex-wrap items-center gap-3 flex-1 basis-full">
            <div className="relative min-w-0 flex-1 basis-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                aria-label="Cari studi kasus"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama kementerian, proyek, atau sektor..."
                fieldSize="sm"
                className="w-full"
                withIcon
              />
            </div>

            <Select
              aria-label="Filter sektor penugasan"
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              selectSize="sm"
              className="min-w-0 max-w-full flex-1"
            >
              <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Semua Sektor Penugasan
              </option>
              {[...new Set(caseStudies.map((study) => study.sector))].sort().map((sec) => (
                <option key={sec} value={sec} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {sec}
                </option>
              ))}
            </Select>

            <Select
              aria-label="Filter status studi kasus"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              selectSize="sm"
              className="min-w-0 max-w-full flex-1"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Semua Status
              </option>
              <option value="active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Hanya Aktif
              </option>
              <option value="inactive" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Non-aktif (Draft)
              </option>
              <option value="flagship" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Hanya Flagship
              </option>
            </Select>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <a
              href="/portfolio"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Halaman Portofolio</span>
            </a>

            <button
              disabled={!canCreate}
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Studi Kasus</span>
            </button>
          </div>
        </div>

        {/* Case Studies Cards List */}
        {mutationError && !modalOpen && <FormFeedback tone="error">{mutationError}</FormFeedback>}
        <div className="grid min-w-0 grid-cols-1 xl:grid-cols-2 gap-5" aria-label="Daftar studi kasus">
          {filteredStudies.map((study) => (
            <div
              key={study.id}
              data-study-id={study.id}
              className={`min-w-0 p-5 rounded-2xl bg-white dark:bg-[#151528] border transition-all flex flex-col justify-between shadow-xs ${
                study.isActive !== false
                  ? "border-slate-200/90 dark:border-white/10"
                  : "border-slate-200 dark:border-white/5 opacity-60 bg-slate-50/50 dark:bg-white/[0.02]"
              }`}
            >
              <div>
                {/* Header: Logo & Status Badge */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 p-1.5 flex items-center justify-center shrink-0">
                      {study.clientLogo ? (
                        <Image
                          src={study.clientLogo}
                          alt={study.client}
                          width={32}
                          height={32}
                          unoptimized
                          className="max-h-7 max-w-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                        {study.clientShort || study.client}
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate">{study.period}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {study.isFlagship && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
                        Flagship
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        study.isActive !== false
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400"
                      }`}
                    >
                      {study.isActive !== false ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {study.title}
                </h3>

                <span className="inline-block mt-1.5 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                  {study.sector}
                </span>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {study.tagline || study.solution}
                </p>

                {/* KPI Highlight Snippet */}
                {study.measurableImpact?.highlightValue && (
                  <div className="mt-3 p-2.5 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 flex items-center justify-between">
                    <div className="min-w-0">
                      <span className="block font-black text-sm text-orange-600 dark:text-orange-400 leading-tight">
                        {study.measurableImpact.highlightValue}
                      </span>
                      <span className="block text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate">
                        {study.measurableImpact.highlightLabel}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50 shrink-0">
                      Teruji
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={() => handleToggleStatus(study.id)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    study.isActive !== false
                      ? "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                      : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  }`}
                >
                  {study.isActive !== false ? "Nonaktifkan" : "Aktifkan"}
                </button>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`/portfolio/${encodeURIComponent(study.id)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Lihat detail ${study.title}`}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                  >
                    Detail <ExternalLink className="size-3" />
                  </a>
                  <button
                    type="button"
                    disabled={!canEdit}
                    onClick={() => openEditModal(study)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors cursor-pointer"
                    title="Edit Studi Kasus"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={!canDelete}
                    onClick={() => handleDelete(study.id, study.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Hapus Studi Kasus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredStudies.length === 0 && (
            <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 text-slate-400 space-y-2">
              <Briefcase className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-xs font-semibold">Tidak ada studi kasus yang cocok dengan kriteria pencarian.</p>
            </div>
          )}
        </div>

        {/* Modal Add / Edit Case Study */}
        <PortfolioEditorDialog editor={editor} />
      </PortfolioEditor>
    </div>
  );
}
