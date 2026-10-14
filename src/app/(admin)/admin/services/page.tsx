"use client";

import { useState } from "react";
import {
  Cpu,
  Code2,
  Server,
  ShieldCheck,
  CheckCircle2,
  Save,
  Edit,
  Plus,
  Trash2,
  X,
  Sparkles,
} from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useCitsStore } from "@/database/store";
import { ServicePillar } from "@/database/schema";

export default function AdminServicesPage() {
  const { services, actions } = useCitsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<ServicePillar | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formIcon, setFormIcon] = useState("Code2");
  const [formDesc, setFormDesc] = useState("");
  const [formSla, setFormSla] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const openEditModal = (pillar: ServicePillar) => {
    setEditingPillar(pillar);
    setFormTitle(pillar.title);
    setFormBadge(pillar.badge);
    setFormIcon(pillar.icon);
    setFormDesc(pillar.desc);
    setFormSla(pillar.sla);
    setFormFeatures(pillar.features ? pillar.features.join(", ") : "");
    setFormIsActive(pillar.isActive !== false);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingPillar(null);
    setFormTitle("");
    setFormBadge(`Pilar 0${services.length + 1}`);
    setFormIcon("Cpu");
    setFormDesc("");
    setFormSla("SLA Terjamin & Bergaransi");
    setFormFeatures("Arsitektur Andal, Pengujian Ketat, Dukungan 24/7");
    setFormIsActive(true);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const featArr = formFeatures.split(",").map((s) => s.trim()).filter(Boolean);

    if (editingPillar) {
      actions.updateService(editingPillar.id, {
        title: formTitle,
        badge: formBadge,
        icon: formIcon,
        desc: formDesc,
        sla: formSla,
        features: featArr,
        isActive: formIsActive,
      });
    } else {
      const newPillar: ServicePillar = {
        id: "pillar-" + Date.now(),
        title: formTitle,
        badge: formBadge,
        icon: formIcon,
        desc: formDesc,
        sla: formSla,
        features: featArr,
        isActive: formIsActive,
      };
      actions.saveServices([...services, newPillar]);
    }

    setSavedSuccess(true);
    setModalOpen(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeletePillar = (id: string, title: string) => {
    if (confirm(`Hapus pilar layanan "${title}"?`)) {
      actions.saveServices(services.filter((s) => s.id !== id));
    }
  };

  const getIconComponent = (name: string) => {
    switch (name) {
      case "Code2":
        return Code2;
      case "Server":
        return Server;
      default:
        return Cpu;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Layanan CITS"
        description="Kelola 3 pilar layanan utama, target SLA, dan ruang lingkup rekayasa teknologi CITS Indonesia"
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Pengaturan layanan berhasil disimpan dan disinkronkan ke Front Office!</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Klik tombol Edit pada kartu layanan untuk mengubah judul, deskripsi, atau SLA yang tampil di website.
          </p>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pilar Layanan</span>
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((p) => {
            const Icon = getIconComponent(p.icon);
            return (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4 hover:border-orange-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-600/25">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => actions.updateService(p.id, { isActive: p.isActive === false ? true : false })}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          p.isActive !== false
                            ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                            : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/15 opacity-70"
                        }`}
                        title="Klik untuk mengubah status aktif/non-aktif"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.isActive !== false ? "bg-emerald-500" : "bg-slate-400"}`} />
                        <span>{p.isActive !== false ? "Aktif" : "Non-aktif"}</span>
                      </button>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30">
                        {p.badge}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {p.desc}
                  </p>

                  {p.features && p.features.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 space-y-1">
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[150px]">{p.sla}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors cursor-pointer"
                      title="Edit Layanan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {services.length > 3 && (
                      <button
                        onClick={() => handleDeletePillar(p.id, p.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                        title="Hapus Layanan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Edit / Add Pillar */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {editingPillar ? "Edit Pilar Layanan CITS" : "Tambah Pilar Layanan Baru"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perubahan akan langsung tampil di halaman /services dan beranda
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Nama Layanan
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="cth. Software House"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Label Badge
                    </label>
                    <input
                      type="text"
                      required
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="cth. Pilar 01"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Deskripsi Ringkas
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Jelaskan ruang lingkup dan spesialisasi layanan ini..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Jaminan SLA / Metodologi
                  </label>
                  <input
                    type="text"
                    required
                    value={formSla}
                    onChange={(e) => setFormSla(e.target.value)}
                    placeholder="cth. Target Ketersediaan 99.9% / TOGAF & LKPP"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Poin Fitur Unggulan (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    placeholder="cth. Microservices, Clean Code, Dukungan SLA 24/7"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-800 dark:text-white">Status Tayang Layanan</span>
                    <span className="block text-[11px] text-slate-500">Tampilkan layanan ini di website utama</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-white/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 cursor-pointer"
                  >
                    {editingPillar ? "Simpan Perubahan" : "Tambahkan Layanan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
