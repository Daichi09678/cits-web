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
  ExternalLink,
  MessageSquare,
  CheckCheck,
  Eye,
  X,
  Volume2,
  Sparkles,
  Calendar,
  Copy,
  Reply,
  Check,
  FileText,
  AlertTriangle,
} from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useCitsStore } from "@/database/store";
import { ContactMessage } from "@/database/schema";
import { playNewMessageSound } from "@/lib/audio";

export default function AdminContactPage() {
  const { contactInfo, messages, isLiveConnected, actions } = useCitsStore();

  const [activeTab, setActiveTab] = useState<"inbox" | "info">("inbox");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Delete Confirmation Modal State
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Email Reply Modal State
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyingMessage, setReplyingMessage] = useState<ContactMessage | null>(null);
  const [replyTo, setReplyTo] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<"diskusi" | "penawaran" | "spesifikasi">("diskusi");
  const [copiedText, setCopiedText] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState("");

  // Contact Info Form State
  const [address, setAddress] = useState(contactInfo.address);
  const [phone, setPhone] = useState(contactInfo.phone);
  const [email, setEmail] = useState(contactInfo.email);
  const [workingHours, setWorkingHours] = useState(contactInfo.workingHours);
  const [emergencyPhone, setEmergencyPhone] = useState(contactInfo.emergencyPhone || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Confirm delete message handler
  const handleConfirmDelete = async () => {
    if (!deletingMessage) return;
    setIsDeleting(true);
    try {
      actions.deleteMessage(deletingMessage.id);
      if (selectedMessage && selectedMessage.id === deletingMessage.id) {
        setSelectedMessage(null);
      }
      setReplyFeedback(`Pesan konsultasi dari "${deletingMessage.name}" berhasil dihapus.`);
      setDeletingMessage(null);
    } catch (err) {
      console.error("Gagal menghapus pesan:", err);
    } finally {
      setIsDeleting(false);
      setTimeout(() => setReplyFeedback(""), 3500);
    }
  };

  // Email Draft Generator with Professional Templates
  const generateEmailDraft = (msg: ContactMessage, templateType: "diskusi" | "penawaran" | "spesifikasi" = "diskusi") => {
    const greeting = `Yth. Bapak/Ibu ${msg.name},\n${msg.company ? `${msg.company}\n` : ""}`;
    const closing = `\n\nSalam hormat,\nTim Konsultasi & Solusi TI\nPT Cipta Integrasi Teknologi Solusi (CITS)\nWebsite: https://cits.co.id\nEmail: contact@cits.co.id | Telepon: (021) 5082-0000`;

    if (templateType === "penawaran") {
      return `${greeting}
Terima kasih atas ketertarikan Anda terhadap portofolio dan layanan CITS Indonesia terkait kebutuhan "${msg.serviceRequested || "Solusi TI"}".

Menindaklanjuti pesan konsultasi Anda:
"${msg.message}"

Bersama ini kami informasikan bahwa tim konsultan dan engineer CITS memiliki pengalaman serta kapabilitas menyeluruh untuk mengimplementasikan arsitektur sistem tersebut sesuai standar tata kelola instansi Anda.

Kami telah menyiapkan ringkasan solusi serta estimasi tahapan implementasi. Jika Bapak/Ibu berkenan, kami siap mengirimkan dokumen proposal resmi dan presentasi teknis secara lebih komprehensif.

Mohon konfirmasi kesediaan waktu Anda untuk dapat kami hubungi lebih lanjut.${closing}`;
    }

    if (templateType === "spesifikasi") {
      return `${greeting}
Terima kasih telah menghubungi PT Cipta Integrasi Teknologi Solusi (CITS).

Terkait permohonan konsultasi:
"${msg.message}"

Agar tim kami dapat menyusun Kerangka Acuan Kerja (KAK) dan estimasi anggaran (RAB) yang presisi sesuai kebutuhan Bapak/Ibu, mohon bantuan untuk melengkapi beberapa informasi awal berikut:
1. Ruang lingkup utama dan target waktu penyelesaian sistem.
2. Lingkungan infrastruktur saat ini (Cloud / On-Premise Data Center).
3. Apakah terdapat integrasi data dengan sistem pihak ketiga atau SPBE / Satu Data Indonesia.

Kami siap mendiskusikan hal ini lebih lanjut melalui pertemuan daring (Google Meet / Zoom).${closing}`;
    }

    // Default template: Undangan Diskusi & Konfirmasi
    return `${greeting}
Terima kasih telah menghubungi PT Cipta Integrasi Teknologi Solusi (CITS). Kami telah menerima permohonan konsultasi Anda mengenai "${msg.serviceRequested || "Solusi & Layanan TI"}".

Pesan Anda:
"${msg.message}"

Kami menyambut baik inisiatif kerja sama ini dan ingin mengundang Bapak/Ibu dalam sesi diskusi / eksplorasi teknis secara singkat (sekitar 20–30 menit) via Google Meet atau Zoom untuk membahas kebutuhan tersebut secara lebih mendalam.

Mohon informasikan jadwal ketersediaan waktu Anda, atau Anda dapat langsung membalas email ini dengan usulan tanggal dan jam yang sesuai.

Terima kasih atas kepercayaan Anda kepada CITS Indonesia.${closing}`;
  };

  const openReplyModal = (msg: ContactMessage, templateType: "diskusi" | "penawaran" | "spesifikasi" = "diskusi") => {
    setReplyingMessage(msg);
    setReplyTo(msg.email);
    setReplySubject(`Tanggapan Konsultasi CITS Indonesia - ${msg.company || msg.name}`);
    setActiveTemplate(templateType);
    setReplyBody(generateEmailDraft(msg, templateType));
    setReplyModalOpen(true);
    if (msg.status === "unread") {
      actions.updateMessageStatus(msg.id, "read");
    }
  };

  const applyTemplate = (type: "diskusi" | "penawaran" | "spesifikasi") => {
    if (!replyingMessage) return;
    setActiveTemplate(type);
    setReplyBody(generateEmailDraft(replyingMessage, type));
  };

  const handleLaunchEmail = (provider: "gmail" | "outlook" | "default") => {
    if (!replyingMessage) return;

    // Automatically update message status to replied
    actions.updateMessageStatus(replyingMessage.id, "replied");
    if (selectedMessage && selectedMessage.id === replyingMessage.id) {
      setSelectedMessage({ ...selectedMessage, status: "replied" });
    }

    let url = "";
    if (provider === "gmail") {
      url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(replyTo)}&su=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;
      window.open(url, "_blank");
    } else if (provider === "outlook") {
      url = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(replyTo)}&subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;
      window.open(url, "_blank");
    } else {
      url = `mailto:${encodeURIComponent(replyTo)}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;
      window.location.href = url;
    }

    setReplyFeedback(`Membuka halaman compose via ${provider === "gmail" ? "Gmail" : provider === "outlook" ? "Outlook Web" : "Email Bawaan"} dan status pesan otomatis ditandai "Sudah Dibalas"!`);
    setTimeout(() => setReplyFeedback(""), 4500);
  };

  const handleCopyReplyDraft = () => {
    navigator.clipboard.writeText(`To: ${replyTo}\nSubject: ${replySubject}\n\n${replyBody}`);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleMarkAsRepliedOnly = () => {
    if (!replyingMessage) return;
    actions.updateMessageStatus(replyingMessage.id, "replied");
    if (selectedMessage && selectedMessage.id === replyingMessage.id) {
      setSelectedMessage({ ...selectedMessage, status: "replied" });
    }
    setReplyFeedback(`Status pesan berhasil ditandai sebagai "Sudah Dibalas"!`);
    setReplyModalOpen(false);
    setTimeout(() => setReplyFeedback(""), 3500);
  };

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
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase()) ||
      (m.serviceRequested && m.serviceRequested.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "All" || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  // Open Message Detail & mark as read if unread
  const handleOpenDetail = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      actions.updateMessageStatus(msg.id, "read");
    }
  };

  // Format clean phone for WhatsApp link
  const getCleanPhone = (rawPhone: string) => {
    let cleaned = rawPhone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.slice(1);
    }
    return cleaned;
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Kotak Masuk Pesan & Konsultasi"
        description="Pantau pesan masuk dan formulir konsultasi secara realtime dari front office website"
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">

        {/* Reply Action Feedback Alert */}
        {replyFeedback && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{replyFeedback}</span>
          </div>
        )}

        {/* Tab Navigation & Realtime Status Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "inbox"
                  ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                  : "bg-white dark:bg-[#151528] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100"
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Inbox Konsultasi Masuk</span>
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "info"
                  ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                  : "bg-white dark:bg-[#151528] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Info Kontak Front Office</span>
            </button>
          </div>

          {/* Realtime Live Indicator & Audio Test Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => playNewMessageSound()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-all cursor-pointer"
              title="Uji coba nada notifikasi"
            >
              <Volume2 className="w-3.5 h-3.5 text-orange-600" />
              <span>Tes Nada Notifikasi</span>
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>Live Stream Realtime Aktif</span>
            </div>
          </div>
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
                  placeholder="Cari pengirim, instansi, email, atau isi pesan..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filter:</span>
                {[
                  { key: "All", label: "Semua" },
                  { key: "unread", label: "Belum Dibaca" },
                  { key: "read", label: "Sudah Dibaca" },
                  { key: "replied", label: "Sudah Dibalas" },
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setFilterStatus(st.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterStatus === st.key
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages List Container */}
            <div className="space-y-3">
              {filteredMessages.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#151528] border border-slate-200 dark:border-white/10">
                  <Mail className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-semibold">
                    Tidak ada pesan konsultasi yang sesuai dengan filter.
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isUnread = msg.status === "unread";
                  return (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-2xl bg-white dark:bg-[#151528] border transition-all hover:border-orange-500/50 ${
                        isUnread
                          ? "border-orange-500/80 shadow-md shadow-orange-500/10 bg-gradient-to-r from-orange-50/30 to-transparent dark:from-orange-950/20"
                          : "border-slate-200/90 dark:border-white/10 shadow-xs"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs ${
                              isUnread
                                ? "bg-orange-600 text-white"
                                : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {msg.name.slice(0, 2).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                                {msg.name}
                              </span>
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/15 text-orange-800 dark:text-orange-300">
                                {msg.company}
                              </span>
                              {isUnread && (
                                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-orange-500 text-white uppercase tracking-wider animate-pulse">
                                  Baru
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              <span className="truncate">{msg.email}</span>
                              <span>•</span>
                              <span>{msg.phone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status selector & Quick Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={msg.status}
                            onChange={(e) => actions.updateMessageStatus(msg.id, e.target.value as any)}
                            className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                          >
                            <option value="unread" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Belum Dibaca</option>
                            <option value="read" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Sudah Dibaca</option>
                            <option value="replied" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Sudah Dibalas</option>
                          </select>

                          <button
                            onClick={() => openReplyModal(msg)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                            title="Balas pesan ini via email"
                          >
                            <Reply className="w-3.5 h-3.5" />
                            <span>Balas Email</span>
                          </button>

                          <button
                            onClick={() => handleOpenDetail(msg)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30 text-xs font-bold hover:bg-orange-100 transition-all cursor-pointer"
                            title="Buka detail pesan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Buka</span>
                          </button>

                          <button
                            onClick={() => setDeletingMessage(msg)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                            title="Hapus Pesan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Message Preview */}
                      <div className="mt-3 cursor-pointer" onClick={() => handleOpenDetail(msg)}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-bold text-orange-700 dark:text-orange-400">
                            Kebutuhan Konsultasi: {msg.serviceRequested || "Umum / Konsultasi TI"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/60 dark:bg-white/5 p-3.5 rounded-xl border border-slate-100 dark:border-white/5 line-clamp-2">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  );
                })
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
                Perubahan pada formulir ini langsung tersimpan ke PostgreSQL backend dan terhubung ke halaman /contact
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
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/25 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan & Sinkronkan ke Website</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL DETAIL PESAN & BALAS LANGSUNG */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-2xl bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                    {selectedMessage.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {selectedMessage.name}
                    </h3>
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                      {selectedMessage.company}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                {/* Meta details cards */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Email Pengirim
                    </span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="font-bold text-orange-600 dark:text-orange-400 hover:underline break-all"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Nomor Telepon / WhatsApp
                    </span>
                    <a
                      href={`https://wa.me/${getCleanPhone(selectedMessage.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                </div>

                {/* Kebutuhan */}
                <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200/80 dark:border-orange-500/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300 block mb-0.5">
                    Kebutuhan Solusi / Pilar Konsultasi:
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {selectedMessage.serviceRequested || "Umum / Konsultasi TI"}
                  </span>
                </div>

                {/* Full Message */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Uraian Pesan / Kerangka Kebutuhan:
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-sm">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Status Switcher in Modal */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Status Penanganan:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(["unread", "read", "replied"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          actions.updateMessageStatus(selectedMessage.id, st);
                          setSelectedMessage({ ...selectedMessage, status: st });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedMessage.status === st
                            ? "bg-orange-600 text-white shadow-xs"
                            : "bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                        }`}
                      >
                        {st === "unread" ? "Belum Dibaca" : st === "read" ? "Dibaca" : "Dibalas"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fast Response Action Buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setDeletingMessage(selectedMessage)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Pesan</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Balas via WhatsApp */}
                    <a
                      href={`https://wa.me/${getCleanPhone(selectedMessage.phone)}?text=Halo%20${encodeURIComponent(
                        selectedMessage.name
                      )},%20terima%20kasih%20telah%20menghubungi%20CITS%20Indonesia%20terkait%20konsultasi%20${encodeURIComponent(
                        selectedMessage.serviceRequested || "TI"
                      )}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Balas via WhatsApp</span>
                    </a>

                    {/* Balas via Email */}
                    <button
                      type="button"
                      onClick={() => openReplyModal(selectedMessage)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Kirim Email Balasan (Otomatis)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL BALAS EMAIL OTOMATIS & REDIRECT KE WEBMAIL */}
        {replyModalOpen && replyingMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-2xl bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20 shrink-0">
                    <Reply className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Kirim Balasan Email Konsultasi</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                        Otomatis
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Balasan untuk <strong className="text-slate-700 dark:text-slate-200">{replyingMessage.name}</strong> ({replyingMessage.company || "Umum"})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Form */}
              <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
                {/* Recipient & Subject */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Email Tujuan (To)
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={replyTo}
                        onChange={(e) => setReplyTo(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Subjek Email
                    </label>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Template Selector Pills */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Pilih Template Balasan Cepat:
                    </label>
                    <span className="text-[10px] text-slate-400">Klik untuk mengganti draft otomatis</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: "diskusi", title: "Undangan Diskusi / Meeting", icon: Calendar, desc: "Ajak meeting daring via GMeet/Zoom" },
                      { id: "penawaran", title: "Penawaran & Portofolio", icon: FileText, desc: "Kirim proposal & estimasi tahapan" },
                      { id: "spesifikasi", title: "Klarifikasi KAK / Teknis", icon: Sparkles, desc: "Minta detail spek & ruang lingkup" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => applyTemplate(t.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          activeTemplate === t.id
                            ? "bg-orange-50 dark:bg-orange-950/40 border-orange-500 shadow-xs ring-1 ring-orange-500/20"
                            : "bg-slate-50/70 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-orange-400"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <t.icon className={`w-3.5 h-3.5 ${activeTemplate === t.id ? "text-orange-600" : "text-slate-400"}`} />
                          <span className={`text-[11px] font-bold ${activeTemplate === t.id ? "text-orange-700 dark:text-orange-300" : "text-slate-700 dark:text-slate-300"}`}>
                            {t.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {t.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Body Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Isi Pesan Balasan Email
                    </label>
                    <button
                      type="button"
                      onClick={handleCopyReplyDraft}
                      className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Draf Berhasil Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Seluruh Draf</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    rows={11}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-100 font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-orange-500 font-sans"
                  />
                </div>
              </div>

              {/* Footer Actions: Automatic redirect to webmail / client */}
              <div className="p-4 px-6 border-t border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleMarkAsRepliedOnly}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
                  title="Tandai status pesan sudah dibalas tanpa membuka browser email"
                >
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tandai Saja Sebagai Dibalas</span>
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Default Client */}
                  <button
                    type="button"
                    onClick={() => handleLaunchEmail("default")}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#1A1A2E] text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Buka di aplikasi email bawaan Windows"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Bawaan</span>
                  </button>

                  {/* Outlook Web */}
                  <button
                    type="button"
                    onClick={() => handleLaunchEmail("outlook")}
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Buka halaman compose Outlook Web di tab baru"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Outlook Web</span>
                  </button>

                  {/* Gmail Web (Primary Action) */}
                  <button
                    type="button"
                    onClick={() => handleLaunchEmail("gmail")}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Buka halaman compose Gmail langsung terisi di tab baru"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim via Gmail (Otomatis)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL KONFIRMASI HAPUS PESAN KONSULTASI (PROFESIONAL & CLEAN) */}
        {deletingMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-[#16162a] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Hapus Pesan Konsultasi?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Pesan ini akan dihapus secara permanen dari basis data dan tidak dapat dipulihkan.
                    </p>
                  </div>
                </div>

                {/* Ringkasan Konteks Pesan yang Akan Dihapus */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Pengirim:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                      {deletingMessage.name}
                    </span>
                  </div>

                  {deletingMessage.company && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Perusahaan / Instansi:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                        {deletingMessage.company}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Email:</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300 truncate max-w-[220px]">
                      {deletingMessage.email}
                    </span>
                  </div>

                  {deletingMessage.serviceRequested && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Kebutuhan:</span>
                      <span className="font-medium text-orange-600 dark:text-orange-400 truncate max-w-[220px]">
                        {deletingMessage.serviceRequested}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/5">
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 italic bg-white dark:bg-black/20 p-2.5 rounded-lg border border-slate-200/50 dark:border-white/5">
                      "{deletingMessage.message}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-slate-50/80 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeletingMessage(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? "Menghapus..." : "Hapus Pesan"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
