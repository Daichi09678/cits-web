"use client";

import { useState } from "react";
import Image from "next/image";
import { Handshake, Plus, CheckCircle2, Trash2, Edit, X, Search, Building2 } from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useCitsStore } from "@/database/store";
import { ClientPartner } from "@/database/schema";

export default function AdminClientsPage() {
  const { clients, actions } = useCitsStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientPartner | null>(null);
  const [search, setSearch] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formLogo, setFormLogo] = useState("/clients/kemenhub.webp");
  const [formCategory, setFormCategory] = useState<ClientPartner["category"]>("Kementerian");
  const [formIsActive, setFormIsActive] = useState(true);

  const openAddModal = () => {
    setEditingClient(null);
    setFormName("");
    setFormLogo("/clients/kemendagri.svg");
    setFormCategory("Kementerian");
    setFormIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (client: ClientPartner) => {
    setEditingClient(client);
    setFormName(client.name);
    setFormLogo(client.logo);
    setFormCategory(client.category);
    setFormIsActive(client.isActive);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      actions.updateClient(editingClient.id, {
        name: formName,
        logo: formLogo,
        category: formCategory,
        isActive: formIsActive,
      });
    } else {
      actions.addClient({
        name: formName,
        logo: formLogo,
        category: formCategory,
        isActive: formIsActive,
      });
    }

    setSavedSuccess(true);
    setModalOpen(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Mitra Institusi & Klien"
        description="Kelola daftar logo kementerian, lembaga tinggi negara, dan BUMN yang tampil di beranda dan portofolio"
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Data mitra institusi berhasil disimpan dan disinkronkan ke Front Office!</span>
          </div>
        )}

        {/* Top Controls */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama kementerian / instansi..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mitra Baru</span>
          </button>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((c) => (
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
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs text-slate-900 dark:text-white truncate">
                    {c.name}
                  </span>
                  <span className="block text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
                    {c.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => actions.updateClient(c.id, { isActive: !c.isActive })}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                    c.isActive !== false
                      ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                      : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/15 opacity-70"
                  }`}
                  title={c.isActive !== false ? "Mitra Aktif (Klik untuk Sembunyikan)" : "Mitra Sembunyi (Klik untuk Tampilkan)"}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.isActive !== false ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                  <span>{c.isActive !== false ? "Aktif" : "Sembunyi"}</span>
                </button>
                <button
                  onClick={() => openEditModal(c)}
                  className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-lg cursor-pointer"
                  title="Edit Mitra"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus logo mitra "${c.name}"?`)) {
                      actions.deleteClient(c.id);
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

        {/* Modal Add / Edit Client */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {editingClient ? "Edit Mitra Institusi" : "Tambah Mitra Baru"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Logo akan langsung tampil di slider mitra beranda dan portofolio
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
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Nama Kementerian / Institusi
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="cth. Kementerian Perhubungan RI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Kategori Institusi
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Kementerian">Kementerian</option>
                    <option value="BUMN">BUMN</option>
                    <option value="Lembaga">Lembaga Tinggi Negara</option>
                    <option value="Swasta">Korporasi Swasta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Path File / URL Logo
                  </label>
                  <input
                    type="text"
                    required
                    value={formLogo}
                    onChange={(e) => setFormLogo(e.target.value)}
                    placeholder="/clients/kemenhub.webp"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
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
                    {editingClient ? "Simpan Perubahan" : "Tambahkan Mitra"}
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
