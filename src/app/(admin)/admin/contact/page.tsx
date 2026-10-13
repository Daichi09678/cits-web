"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  Trash2,
  Inbox,
  Send,
  Building2,
  Search,
  Filter,
} from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useCitsStore } from "@/database/store";

export default function AdminContactPage() {
  const { contactInfo, messages, actions } = useCitsStore();

  const [activeTab, setActiveTab] = useState<"inbox" | "info">("inbox");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Contact Info Form State
  const [address, setAddress] = useState(contactInfo.address);
  const [phone, setPhone] = useState(contactInfo.phone);
  const [email, setEmail] = useState(contactInfo.email);
  const [workingHours, setWorkingHours] = useState(contactInfo.workingHours);
  const [emergencyPhone, setEmergencyPhone] = useState(contactInfo.emergencyPhone || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Save Contact Info
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    actions.saveContactInfo({
      address,
      phone,
      email,
      workingHours,
      emergencyPhone,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.company.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Hubungi Kami & Pesan"
        description="Kelola informasi kontak resmi kantor serta pantau pesan masuk dari pengunjung website"
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">

      {/* Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "inbox"
              ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
              : "bg-white dark:bg-[#151528] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Inbox Pesan Masuk</span>
          {unreadCount > 0 && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === "inbox" ? "bg-white text-orange-600" : "bg-orange-500 text-white"
              }`}
            >
              {unreadCount} Baru
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "info"
              ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
              : "bg-white dark:bg-[#151528] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Pengaturan Info Kontak Kantor</span>
        </button>
      </div>

      {/* TAB 1: INBOX PESAN MASUK */}
      {activeTab === "inbox" && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pengirim, instansi, atau isi pesan..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              {["All", "unread", "read", "replied"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterStatus === st
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {st === "All" ? "Semua" : st === "unread" ? "Belum Dibaca" : st === "read" ? "Dibaca" : "Dibalas"}
                </button>
              ))}
            </div>
          </div>

          {/* Messages List Container */}
          <div className="space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#151528] border border-slate-200 dark:border-white/10">
                <Mail className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">
                  Tidak ada pesan yang ditemukan.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-5 rounded-2xl bg-white dark:bg-[#151528] border transition-all ${
                    msg.status === "unread"
                      ? "border-orange-400/80 shadow-md shadow-orange-500/5 bg-gradient-to-r from-orange-50/20 to-transparent"
                      : "border-slate-200/90 dark:border-white/10 shadow-xs"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {msg.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {msg.name}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300">
                            {msg.company}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {msg.email} • {msg.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={msg.status}
                        onChange={(e) => actions.updateMessageStatus(msg.id, e.target.value as any)}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="unread">Belum Dibaca</option>
                        <option value="read">Sudah Dibaca</option>
                        <option value="replied">Sudah Dibalas</option>
                      </select>

                      <button
                        onClick={() => {
                          if (confirm(`Hapus pesan dari ${msg.name}?`)) {
                            actions.deleteMessage(msg.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        title="Hapus Pesan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-[11px] font-semibold text-orange-700 dark:text-orange-400 mb-1">
                      Kebutuhan Layanan: {msg.serviceRequested}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PENGATURAN INFO KONTAK KANTOR */}
      {activeTab === "info" && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6 max-w-3xl">
          <div className="border-b border-slate-100 dark:border-white/5 pb-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Edit Informasi Kontak Publik
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Perubahan pada form ini akan langsung diperbarui pada halaman Hubungi Kami di Front Office
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Informasi kontak berhasil disimpan dan disinkronkan ke Front Office!</span>
            </div>
          )}

          <form onSubmit={handleSaveInfo} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Alamat Kantor Resmi
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nomor Telepon Kantor
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Resmi Layanan
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Jam Operasional Kantor
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nomor Darurat / WhatsApp SLA
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/25 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan & Sinkronkan ke Website</span>
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}
