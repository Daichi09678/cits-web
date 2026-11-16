"use client";
import Input, { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FieldLabel from "@/components/ui/FieldLabel";
import FormFeedback from "@/components/ui/FormFeedback";

import { X } from "lucide-react";
import AdminDialogSurface from "@/components/pages/admin/AdminDialogSurface";
import type { PortfolioEditorState } from "./usePortfolioEditor";
import PortfolioClientLogoFields from "./PortfolioClientLogoFields";
import PortfolioAssignmentFields from "./PortfolioAssignmentFields";

export default function PortfolioEditorDialog({ editor }: { editor: PortfolioEditorState }) {
  const {
    modalOpen,
    setModalOpen,
    saving,
    readingLogo,
    editingStudy,
    handleSave,
    mutationError,
    formTitle,
    setFormTitle,
    formClient,
    setFormClient,
    formClientShort,
    setFormClientShort,
    formServicePillar,
    setFormServicePillar,
    formIsFlagship,
    setFormIsFlagship,
    formTagline,
    setFormTagline,
    formChallenge,
    setFormChallenge,
    formSolution,
    setFormSolution,
    formKpiValue,
    setFormKpiValue,
    formKpiLabel,
    setFormKpiLabel,
    formKpiDetail,
    setFormKpiDetail,
    formTechStack,
    setFormTechStack,
    formDeliverables,
    setFormDeliverables,
    formIsActive,
    setFormIsActive,
    formShowOnHome,
    setFormShowOnHome,
  } = editor;
  return (
    <>
      {modalOpen && (
        <AdminDialogSurface
          labelledBy="portfolio-editor-title"
          onClose={() => setModalOpen(false)}
          busy={saving || readingLogo}
          widthClassName="w-[min(672px,calc(100vw-32px))]"
        >
          <div className="flex min-h-0 flex-col">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h3 id="portfolio-editor-title" className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingStudy ? "Edit Studi Kasus Portofolio" : "Tambah Studi Kasus Baru"}
                </h3>
                <p className="text-xs text-slate-500">
                  Data akan langsung tersinkronkan ke tampilan kartu dan modal pada /portfolio
                </p>
              </div>
              <Button
                type="button"
                aria-label="Tutup editor portofolio"
                disabled={saving || readingLogo}
                onClick={() => {
                  if (!saving && !readingLogo) setModalOpen(false);
                }}
                variant="ghost"
                size="icon"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              {mutationError && <FormFeedback tone="error">{mutationError}</FormFeedback>}
              <fieldset disabled={saving || readingLogo} className="min-w-0 space-y-5">
                {/* Title */}
                <div>
                  <FieldLabel htmlFor="portfolio-editor-dialog-form-title" fieldSize="sm" required>
                    Judul Penugasan / Proyek
                  </FieldLabel>
                  <Input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="cth. Pemeliharaan & Rekayasa Arsitektur KTP Elektronik Nasional"
                    fieldSize="sm"
                    className="w-full"
                    id="portfolio-editor-dialog-form-title"
                  />
                </div>

                {/* Client Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="portfolio-editor-dialog-form-client" fieldSize="sm" required>
                      Nama Instansi Klien Lengkap
                    </FieldLabel>
                    <Input
                      type="text"
                      required
                      value={formClient}
                      onChange={(e) => setFormClient(e.target.value)}
                      placeholder="cth. Kementerian Dalam Negeri RI (Ditjen Dukcapil)"
                      fieldSize="sm"
                      className="w-full"
                      id="portfolio-editor-dialog-form-client"
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="portfolio-editor-dialog-form-client-short" fieldSize="sm" required>
                      Nama Singkat Klien
                    </FieldLabel>
                    <Input
                      type="text"
                      required
                      value={formClientShort}
                      onChange={(e) => setFormClientShort(e.target.value)}
                      placeholder="cth. Kemendagri RI"
                      fieldSize="sm"
                      className="w-full"
                      id="portfolio-editor-dialog-form-client-short"
                    />
                  </div>
                </div>

                {/* Logo Uploader & Preset */}
                <PortfolioClientLogoFields editor={editor} />

                {/* Sektor & Periode */}
                <PortfolioAssignmentFields editor={editor} />

                {/* Pilar & Flagship */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <FieldLabel htmlFor="portfolio-editor-dialog-form-service-pillar" fieldSize="sm">
                      Pilar Layanan CITS
                    </FieldLabel>
                    <Input
                      type="text"
                      value={formServicePillar}
                      onChange={(e) => setFormServicePillar(e.target.value)}
                      placeholder="cth. Software House & Pemeliharaan Mission-Critical"
                      fieldSize="sm"
                      className="w-full"
                      id="portfolio-editor-dialog-form-service-pillar"
                    />
                  </div>

                  <div className="pt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="formIsFlagship"
                      checked={formIsFlagship}
                      onChange={(e) => setFormIsFlagship(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="formIsFlagship"
                      className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Jadikan Studi Kasus Unggulan (Flagship)
                    </label>
                  </div>
                </div>

                {/* Tagline / Ringkasan */}
                <div>
                  <FieldLabel htmlFor="portfolio-editor-dialog-form-tagline" fieldSize="sm">
                    Ringkasan Singkat / Tagline
                  </FieldLabel>
                  <Textarea
                    rows={2}
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="Kalimat pengantar dampak sistem bagi publik atau kementerian..."
                    fieldSize="sm"
                    className="w-full"
                    id="portfolio-editor-dialog-form-tagline"
                  />
                </div>

                {/* Tantangan & Solusi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="portfolio-editor-dialog-form-challenge" fieldSize="sm">
                      Tantangan Inti Klien
                    </FieldLabel>
                    <Textarea
                      rows={3}
                      value={formChallenge}
                      onChange={(e) => setFormChallenge(e.target.value)}
                      placeholder="Kendala teknis, beban transaksi data, atau regulasi yang dihadapi..."
                      fieldSize="sm"
                      className="w-full"
                      id="portfolio-editor-dialog-form-challenge"
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="portfolio-editor-dialog-form-solution" fieldSize="sm">
                      Solusi Rekayasa CITS
                    </FieldLabel>
                    <Textarea
                      rows={3}
                      value={formSolution}
                      onChange={(e) => setFormSolution(e.target.value)}
                      placeholder="Solusi arsitektur, API, database, atau pengadaan yang diimplementasikan..."
                      fieldSize="sm"
                      className="w-full"
                      id="portfolio-editor-dialog-form-solution"
                    />
                  </div>
                </div>

                {/* Capaian Utama KPI */}
                <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 space-y-2">
                  <FieldLabel htmlFor="portfolio-editor-dialog-form-kpi-value" fieldSize="sm">
                    Capaian Terukur (KPI Highlight Badge)
                  </FieldLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      type="text"
                      placeholder="Nilai (cth. 100+ Juta / 99.98%)"
                      value={formKpiValue}
                      onChange={(e) => setFormKpiValue(e.target.value)}
                      fieldSize="sm"
                      id="portfolio-editor-dialog-form-kpi-value"
                    />
                    <Input
                      type="text"
                      placeholder="Label (cth. Transaksi Verifikasi / Tahun)"
                      value={formKpiLabel}
                      onChange={(e) => setFormKpiLabel(e.target.value)}
                      fieldSize="sm"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Detail dampak (cth. Menjamin latensi verifikasi < 1.5 detik)"
                    value={formKpiDetail}
                    onChange={(e) => setFormKpiDetail(e.target.value)}
                    fieldSize="sm"
                    className="w-full"
                  />
                </div>

                {/* Tech Stack & Scope */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="portfolio-editor-dialog-form-tech-stack" fieldSize="sm">
                      Teknologi yang Digunakan (Pisahkan dengan koma)
                    </FieldLabel>
                    <Input
                      type="text"
                      value={formTechStack}
                      onChange={(e) => setFormTechStack(e.target.value)}
                      placeholder="cth. Next.js, Oracle RAC, REST API, Docker"
                      fieldSize="sm"
                      className="w-full"
                      id="portfolio-editor-dialog-form-tech-stack"
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="portfolio-editor-dialog-form-deliverables" fieldSize="sm">
                      Deliverables / Hasil Kerja (Pisahkan dengan koma)
                    </FieldLabel>
                    <Input
                      type="text"
                      value={formDeliverables}
                      onChange={(e) => setFormDeliverables(e.target.value)}
                      placeholder="cth. API Gateway, Dasbor Eksekutif, SLA 24/7"
                      fieldSize="sm"
                      className="w-full"
                      id="portfolio-editor-dialog-form-deliverables"
                    />
                  </div>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="formIsActiveCheck"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="formIsActiveCheck"
                    className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Tampilkan studi kasus ini di Front Office (/portfolio)
                  </label>
                </div>

                {/* Footer Buttons */}
                <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-orange-200/80 bg-orange-50/50 p-3.5 dark:border-orange-500/20 dark:bg-orange-500/10">
                  <span>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">
                      Tampilkan di Beranda Utama
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-300">
                      Centang agar proyek masuk ke panel ilustrasi pembuka beranda. Maksimal 3 proyek terpilih
                      ditampilkan.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={formShowOnHome}
                    onChange={(event) => setFormShowOnHome(event.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-orange-600"
                  />
                </label>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
                  <Button
                    type="button"
                    onClick={() => {
                      if (!saving && !readingLogo) setModalOpen(false);
                    }}
                    variant="secondary"
                    size="md"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    busy={saving || readingLogo}
                    busyLabel={readingLogo ? "Membaca logo..." : "Menyimpan..."}
                  >
                    {saving
                      ? "Menyimpan..."
                      : readingLogo
                        ? "Membaca logo..."
                        : editingStudy
                          ? "Simpan Perubahan"
                          : "Tambahkan Studi Kasus"}
                  </Button>
                </div>
              </fieldset>
            </form>
          </div>
        </AdminDialogSurface>
      )}
    </>
  );
}
