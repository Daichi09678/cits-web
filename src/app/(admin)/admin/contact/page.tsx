"use client";
import MessageConsultationDetails from "@/components/admin/MessageConsultationDetails";
import { consultationSummary } from "@/lib/consultation";

import { useEffect, useState } from "react";
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
  CheckSquare,
  Square,
  MinusSquare,
  HelpCircle,
  Plus,
  Edit3,
  Tag,
  Briefcase,
  ChevronDown,
  Megaphone,
} from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useAdminDialog } from "@/components/admin/AdminDialogProvider";
import { useCitsStore } from "@/stores/citsStore";
import { ContactMessage, DealStage, ContactFaqItem } from "@/types/schema";
import { playNewMessageSound } from "@/lib/audio";
import { formatMessageDate, formatMessageRelative, formatMessageTime } from "@/lib/date";
import { getMessageRetentionDays } from "@/config/inbox";

const DEAL_STAGES: {
  key: DealStage;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotBg: string;
  icon: any;
  desc: string;
}[] = [
  {
    key: "baru",
    label: "Baru Masuk",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-200 dark:border-blue-800/60",
    dotBg: "bg-blue-500",
    icon: Sparkles,
    desc: "Pesan baru masuk dari website",
  },
  {
    key: "diskusi",
    label: "Diskusi",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeText: "text-amber-800 dark:text-amber-300",
    badgeBorder: "border-amber-200 dark:border-amber-800/60",
    dotBg: "bg-amber-500",
    icon: Calendar,
    desc: "Konsultasi teknis dan pertemuan awal",
  },
  {
    key: "proses",
    label: "Penawaran",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    badgeBorder: "border-indigo-200 dark:border-indigo-800/60",
    dotBg: "bg-indigo-500",
    icon: FileText,
    desc: "Penyusunan KAK, proposal dan estimasi RAB",
  },
  {
    key: "kesepakatan",
    label: "Kesepakatan",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeText: "text-emerald-800 dark:text-emerald-300",
    badgeBorder: "border-emerald-200 dark:border-emerald-800/60",
    dotBg: "bg-emerald-500",
    icon: CheckCircle2,
    desc: "Lingkup dan anggaran telah disetujui",
  },
  {
    key: "selesai",
    label: "Selesai",
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/40",
    badgeText: "text-cyan-800 dark:text-cyan-300",
    badgeBorder: "border-cyan-200 dark:border-cyan-800/60",
    dotBg: "bg-cyan-600",
    icon: CheckCheck,
    desc: "Proyek resmi berjalan",
  },
  {
    key: "batal",
    label: "Dibatalkan",
    badgeBg: "bg-slate-100 dark:bg-slate-800/50",
    badgeText: "text-slate-600 dark:text-slate-400",
    badgeBorder: "border-slate-200 dark:border-white/10",
    dotBg: "bg-slate-400",
    icon: AlertTriangle,
    desc: "Tidak berlanjut atau ditunda",
  },
];

export default function AdminContactPage() {
  const { contactInfo, messages, isLiveConnected, actions } = useCitsStore();
  const dialog = useAdminDialog();

  // Pesan yang lebih tua dari ini dihapus otomatis oleh server (lihat /api/messages).
  const retentionDays = getMessageRetentionDays();

  const [activeTab, setActiveTab] = useState<"inbox" | "info" | "faqs">("inbox");
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  // Jam berjalan untuk label relatif ("2 menit lalu") selama detail pesan terbuka.
  const [clock, setClock] = useState(() => Date.now());

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeletingOpen, setBulkDeletingOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Custom stage dropdown menu open state per message
  const [openStageMenuId, setOpenStageMenuId] = useState<string | null>(null);

  // Delete Confirmation Modal State (Single)
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

  // Deal Notes Editing State in Modal
  const [dealNotesInput, setDealNotesInput] = useState("");

  // Perbarui label relatif tiap 30 detik saat modal detail pesan dibuka.
  useEffect(() => {
    if (!selectedMessage) return;
    const timer = setInterval(() => setClock(Date.now()), 30000);
    return () => clearInterval(timer);
  }, [selectedMessage]);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Contact Info Form State (Tab 2)
  const [address, setAddress] = useState(contactInfo.address);
  const [phone, setPhone] = useState(contactInfo.phone);
  const [email, setEmail] = useState(contactInfo.email);
  const [workingHours, setWorkingHours] = useState(contactInfo.workingHours);
  const [emergencyPhone, setEmergencyPhone] = useState(contactInfo.emergencyPhone || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // FAQ & Customization States (Tab 3)
  const [faqsList, setFaqsList] = useState<ContactFaqItem[]>(() => contactInfo.faqs || []);
  const [servicesList, setServicesList] = useState<string[]>(() => contactInfo.customServices || []);
  const [newServiceText, setNewServiceText] = useState("");
  const [editingFaq, setEditingFaq] = useState<ContactFaqItem | null>(null);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqIsActive, setFaqIsActive] = useState(true);

  // Announcement Banner States
  const [announcementActive, setAnnouncementActive] = useState(contactInfo.announcement?.isActive || false);
  const [announcementText, setAnnouncementText] = useState(contactInfo.announcement?.text || "");
  const [announcementLinkText, setAnnouncementLinkText] = useState(contactInfo.announcement?.linkText || "");
  const [announcementLinkUrl, setAnnouncementLinkUrl] = useState(contactInfo.announcement?.linkUrl || "");
  const [faqSuccessMsg, setFaqSuccessMsg] = useState("");

  // Filter messages logic
  const filteredMessages = messages.filter((m) => {
    const s = search.toLowerCase();
    const matchSearch =
      (m.name || "").toLowerCase().includes(s) ||
      (m.company || "").toLowerCase().includes(s) ||
      (m.email || "").toLowerCase().includes(s) ||
      (m.message || "").toLowerCase().includes(s) ||
      consultationSummary(m).toLowerCase().includes(s) ||
      [
        m.consultation?.expectedOutcome,
        m.consultation?.currentSystem,
        ...(m.consultation?.requestedFeatures || []),
      ].some((value) => value?.toLowerCase().includes(s));
    const matchStatus = filterStatus === "All" || m.status === filterStatus;
    const stageKey = m.dealStage || "baru";
    const matchStage = filterStage === "All" || stageKey === filterStage;
    return matchSearch && matchStatus && matchStage;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  // Multi-Select Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length && filteredMessages.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map((m) => m.id));
    }
  };

  const handleToggleSelectOne = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      await actions.deleteMessages(selectedIds);
      if (selectedMessage && selectedIds.includes(selectedMessage.id)) {
        setSelectedMessage(null);
      }
      setReplyFeedback(`${selectedIds.length} pesan konsultasi terpilih berhasil dihapus.`);
      setSelectedIds([]);
      setBulkDeletingOpen(false);
    } catch (err) {
      console.error("Gagal menghapus pesan masal:", err);
    } finally {
      setIsBulkDeleting(false);
      setTimeout(() => setReplyFeedback(""), 3500);
    }
  };

  const handleBulkMarkAsRead = () => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      actions.updateMessageStatus(id, "read");
    }
    setReplyFeedback(`${selectedIds.length} pesan ditandai sebagai sudah dibaca.`);
    setSelectedIds([]);
    setTimeout(() => setReplyFeedback(""), 3500);
  };

  // Single Delete Handler
  const handleConfirmDelete = async () => {
    if (!deletingMessage) return;
    setIsDeleting(true);
    try {
      await actions.deleteMessage(deletingMessage.id);
      setSelectedIds((prev) => prev.filter((id) => id !== deletingMessage.id));
      if (selectedMessage && selectedMessage.id === deletingMessage.id) {
        setSelectedMessage(null);
      }
      setReplyFeedback(`Pesan dari "${deletingMessage.name}" berhasil dihapus.`);
      setDeletingMessage(null);
    } catch (err) {
      console.error("Gagal menghapus pesan:", err);
    } finally {
      setIsDeleting(false);
      setTimeout(() => setReplyFeedback(""), 3500);
    }
  };

  // Update Deal Stage
  const handleUpdateStage = (msgId: string, stage: DealStage) => {
    actions.updateMessageStage(msgId, stage);
    if (selectedMessage && selectedMessage.id === msgId) {
      setSelectedMessage({ ...selectedMessage, dealStage: stage });
    }
    const stageInfo = DEAL_STAGES.find((s) => s.key === stage);
    setReplyFeedback(`Tahapan diperbarui ke "${stageInfo?.label || stage}".`);
    setTimeout(() => setReplyFeedback(""), 3000);
  };

  // Save Deal Notes
  const handleSaveDealNotes = () => {
    if (!selectedMessage) return;
    setIsSavingNotes(true);
    try {
      const currentStage = selectedMessage.dealStage || "baru";
      actions.updateMessageStage(selectedMessage.id, currentStage, dealNotesInput);
      setSelectedMessage({ ...selectedMessage, dealNotes: dealNotesInput });
      setReplyFeedback("Catatan kesepakatan berhasil disimpan.");
    } catch (err) {
      console.error("Gagal menyimpan catatan:", err);
    } finally {
      setIsSavingNotes(false);
      setTimeout(() => setReplyFeedback(""), 3000);
    }
  };

  // Email Draft Generator with Professional Templates
  const generateEmailDraft = (
    msg: ContactMessage,
    templateType: "diskusi" | "penawaran" | "spesifikasi" = "diskusi"
  ) => {
    const greeting = `Yth. Bapak/Ibu ${msg.name},\n${msg.company ? `${msg.company}\n` : ""}`;
    const closing = `\n\nSalam hormat,\nTim Konsultasi & Solusi TI\nPT Cipta Integrasi Teknologi Solusi (CITS)\nWebsite: https://cits.co.id\nEmail: contact@cits.co.id | Telepon: (021) 5082-0000`;

    if (templateType === "penawaran") {
      return `${greeting}
Terima kasih atas ketertarikan Anda terhadap portofolio dan layanan CITS Indonesia terkait kebutuhan "${consultationSummary(msg)}".

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

    return `${greeting}
Terima kasih telah menghubungi PT Cipta Integrasi Teknologi Solusi (CITS). Kami telah menerima permohonan konsultasi Anda mengenai "${consultationSummary(msg)}".

Pesan Anda:
"${msg.message}"

Kami menyambut baik inisiatif kerja sama ini dan ingin mengundang Bapak/Ibu dalam sesi diskusi eksplorasi teknis secara singkat (sekitar 20–30 menit) via Google Meet atau Zoom untuk membahas kebutuhan tersebut secara lebih mendalam.

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

    setReplyFeedback(
      `Membuka compose via ${provider === "gmail" ? "Gmail" : provider === "outlook" ? "Outlook Web" : "Email Bawaan"} dan status otomatis ditandai "Sudah Dibalas".`
    );
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
    setReplyFeedback(`Status pesan berhasil ditandai sebagai "Sudah Dibalas".`);
    setReplyModalOpen(false);
    setTimeout(() => setReplyFeedback(""), 3500);
  };

  // Save Contact Info (Tab 2)
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    actions.saveContactInfo({
      ...contactInfo,
      address,
      phone,
      email,
      workingHours,
      emergencyPhone,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    void dialog.alert({
      title: "Informasi kontak disimpan",
      description: "Perubahan informasi kontak berhasil disinkronkan ke halaman Hubungi Kami.",
      variant: "success",
    });
  };

  // Save FAQ & Services Settings (Tab 3)
  const handleSaveFaqSettings = () => {
    actions.saveContactInfo({
      ...contactInfo,
      faqs: faqsList,
      customServices: servicesList,
      announcement: {
        isActive: announcementActive,
        text: announcementText,
        linkText: announcementLinkText,
        linkUrl: announcementLinkUrl,
        type: "info",
      },
    });
    setFaqSuccessMsg("Pengaturan FAQ dan layanan berhasil disimpan.");
    setTimeout(() => setFaqSuccessMsg(""), 3500);
    void dialog.alert({
      title: "Pengaturan FAQ disimpan",
      description: "Daftar FAQ dan opsi layanan berhasil diperbarui.",
      variant: "success",
    });
  };

  const openAddFaqModal = () => {
    setEditingFaq(null);
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqIsActive(true);
    setFaqModalOpen(true);
  };

  const openEditFaqModal = (faq: ContactFaqItem) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqIsActive(faq.isActive);
    setFaqModalOpen(true);
  };

  const handleSaveFaqItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    if (editingFaq) {
      const updated = faqsList.map((f) =>
        f.id === editingFaq.id ? { ...f, question: faqQuestion, answer: faqAnswer, isActive: faqIsActive } : f
      );
      setFaqsList(updated);
    } else {
      const newFaq: ContactFaqItem = {
        id: "faq-" + Date.now(),
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        isActive: faqIsActive,
      };
      setFaqsList([...faqsList, newFaq]);
    }
    setFaqModalOpen(false);
    void dialog.alert({
      title: editingFaq ? "FAQ diperbarui" : "FAQ ditambahkan",
      description: editingFaq
        ? "Perubahan pertanyaan FAQ berhasil disimpan."
        : "Pertanyaan FAQ baru berhasil ditambahkan.",
      variant: "success",
    });
  };

  const handleDeleteFaqItem = (id: string) => {
    setFaqsList(faqsList.filter((f) => f.id !== id));
  };

  const handleToggleFaqActive = (id: string) => {
    setFaqsList(faqsList.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)));
  };

  const handleAddServiceOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceText.trim()) return;
    if (servicesList.includes(newServiceText.trim())) return;
    setServicesList([...servicesList, newServiceText.trim()]);
    setNewServiceText("");
  };

  const handleDeleteServiceOption = (index: number) => {
    setServicesList(servicesList.filter((_, i) => i !== index));
  };

  // Open Message Detail & mark as read if unread
  const handleOpenDetail = (msg: ContactMessage) => {
    const readMsg: ContactMessage = msg.status === "unread" ? { ...msg, status: "read" } : msg;
    setSelectedMessage(readMsg);
    setDealNotesInput(readMsg.dealNotes || "");
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
        description="Kelola pesan masuk dari formulir website, pantau tahapan calon klien, dan kelola FAQ"
      />
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Action Feedback Alert */}
        {replyFeedback && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{replyFeedback}</span>
          </div>
        )}

        {/* Tab Navigation & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "inbox"
                  ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                  : "bg-white dark:bg-[#151528] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100"
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Inbox Konsultasi</span>
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
              <span>Info Kontak</span>
            </button>

            <button
              onClick={() => setActiveTab("faqs")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "faqs"
                  ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                  : "bg-white dark:bg-[#151528] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Kelola FAQ & Layanan</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => playNewMessageSound()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-all cursor-pointer"
              title="Uji coba nada notifikasi"
            >
              <Volume2 className="w-3.5 h-3.5 text-orange-600" />
              <span>Tes Nada Notifikasi</span>
            </button>

            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-400"
              title={`Pesan konsultasi yang lebih tua dari ${retentionDays} hari dihapus otomatis dari database.`}
            >
              <Trash2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>Auto-hapus {retentionDays} hari</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>Live Realtime</span>
            </div>
          </div>
        </div>

        {/* TAB 1: INBOX PESAN MASUK */}
        {activeTab === "inbox" && (
          <div className="space-y-4">
            {/* UNIFIED CONTROLS & FILTER (Clean, modern SaaS dashboard style, no robotic AI box) */}
            <div className="rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 p-3.5 shadow-xs space-y-3">
              {/* Row 1: Clean Segmented Stage Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 dark:border-white/5">
                <button
                  onClick={() => setFilterStage("All")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    filterStage === "All"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span>Semua</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterStage === "All" ? "bg-white/20 dark:bg-black/15 text-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10"}`}
                  >
                    {messages.length}
                  </span>
                </button>

                {DEAL_STAGES.map((st) => {
                  const count = messages.filter((m) => (m.dealStage || "baru") === st.key).length;
                  const isActive = filterStage === st.key;
                  return (
                    <button
                      key={st.key}
                      onClick={() => setFilterStage(st.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${st.dotBg}`} />
                      <span>{st.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 dark:bg-black/15 text-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Row 2: Search Input, Status Filter, and Select Mode Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
                  <div className="relative w-full sm:flex-1 sm:min-w-40 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari nama, instansi, atau pesan..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Keterbacaan filter pill */}
                  <div className="flex flex-wrap items-center gap-1 bg-slate-50 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
                    {[
                      { key: "All", label: "Semua" },
                      { key: "unread", label: "Belum Dibaca" },
                      { key: "read", label: "Sudah Dibaca" },
                      { key: "replied", label: "Dibalas" },
                    ].map((st) => (
                      <button
                        key={st.key}
                        onClick={() => setFilterStatus(st.key)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                          filterStatus === st.key
                            ? "bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white shadow-xs font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selection Action Bar — selalu tampil */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-t border-slate-100 bg-orange-50/50 p-3 pt-2 dark:border-white/5 dark:bg-orange-950/20">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredMessages.length ? (
                      <CheckSquare className="w-4 h-4 text-orange-600" />
                    ) : selectedIds.length > 0 ? (
                      <MinusSquare className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    <span>Pilih Semua ({filteredMessages.length})</span>
                  </button>

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    <strong>{selectedIds.length}</strong> pesan dipilih
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBulkMarkAsRead}
                    disabled={selectedIds.length === 0}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    Tandai Dibaca
                  </button>

                  <button
                    type="button"
                    onClick={() => setBulkDeletingOpen(true)}
                    disabled={selectedIds.length === 0}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Terpilih ({selectedIds.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages List Container */}
            <div className="space-y-3">
              {filteredMessages.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#151528] border border-slate-200 dark:border-white/10">
                  <Mail className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-semibold">
                    Tidak ada pesan konsultasi yang sesuai dengan filter.
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isUnread = msg.status === "unread";
                  const isSelected = selectedIds.includes(msg.id);
                  const currentStageKey = msg.dealStage || "baru";
                  const currentStage = DEAL_STAGES.find((s) => s.key === currentStageKey) || DEAL_STAGES[0];
                  const isMenuOpen = openStageMenuId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-2xl bg-white dark:bg-[#151528] border transition-all ${
                        isSelected
                          ? "border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/10 dark:bg-orange-950/15"
                          : isUnread
                            ? "border-orange-500/80 shadow-md shadow-orange-500/10 bg-gradient-to-r from-orange-50/30 to-transparent dark:from-orange-950/20"
                            : "border-slate-200/90 dark:border-white/10 shadow-xs"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Item Checkbox */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleSelectOne(msg.id, e)}
                            className="p-1 text-slate-400 hover:text-orange-600 cursor-pointer shrink-0"
                            title={isSelected ? "Batalkan pilihan" : "Pilih pesan ini"}
                          >
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-orange-600" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                            )}
                          </button>

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

                        {/* Custom Modern Stage Selector & Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          {/* Custom Styled Dropdown for Stage (Gantikan OS select biru) */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenStageMenuId(isMenuOpen ? null : msg.id);
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold cursor-pointer transition-all ${currentStage.badgeBg} ${currentStage.badgeText} ${currentStage.badgeBorder} hover:shadow-xs`}
                              title="Klik untuk mengubah tahapan"
                            >
                              <span className={`w-2 h-2 rounded-full ${currentStage.dotBg}`} />
                              <span>{currentStage.label}</span>
                              <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                            </button>

                            {/* Floating Custom Menu */}
                            {isMenuOpen && (
                              <>
                                <div className="fixed inset-0 z-20" onClick={() => setOpenStageMenuId(null)} />
                                <div className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl bg-white dark:bg-[#1A1A2E] border border-slate-200 dark:border-white/10 shadow-xl z-30 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5 mb-1">
                                    Ubah Tahapan
                                  </div>
                                  {DEAL_STAGES.map((st) => {
                                    const isCurrent = currentStageKey === st.key;
                                    return (
                                      <button
                                        key={st.key}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateStage(msg.id, st.key);
                                          setOpenStageMenuId(null);
                                        }}
                                        className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer ${
                                          isCurrent
                                            ? "text-orange-600 dark:text-orange-400 font-bold bg-orange-50/50 dark:bg-orange-950/20"
                                            : "text-slate-700 dark:text-slate-300"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className={`w-2 h-2 rounded-full ${st.dotBg}`} />
                                          <span>{st.label}</span>
                                        </div>
                                        {isCurrent && (
                                          <Check className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>

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
                            title="Buka detail pesan & catatan"
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
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-bold text-orange-700 dark:text-orange-400">
                            Kebutuhan Konsultasi: {consultationSummary(msg)}
                          </span>
                          {msg.dealNotes && (
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 italic flex items-center gap-1">
                              <Edit3 className="w-3 h-3 text-amber-500" />
                              <span className="line-clamp-1 max-w-[280px]">Catatan: {msg.dealNotes}</span>
                            </span>
                          )}
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

        {/* TAB 2: INFORMASI KONTAK RESMI FRONT OFFICE */}
        {activeTab === "info" && (
          <div className="max-w-3xl rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 p-6 md:p-8 shadow-xs">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pengaturan Informasi Kontak</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Data kontak ini otomatis disinkronkan ke footer dan halaman kontak publik.
              </p>
            </div>

            {savedSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">Informasi kontak berhasil disimpan.</span>
              </div>
            )}

            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Alamat Kantor Pusat
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Resmi
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
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
                    Jam Operasional Layanan
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Nomor Darurat WhatsApp
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
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: KELOLA FAQ & LAYANAN PUBLIK */}
        {activeTab === "faqs" && (
          <div className="space-y-6">
            {faqSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">{faqSuccessMsg}</span>
              </div>
            )}

            {/* Sub-Section 1: Banner Pengumuman Halaman Kontak */}
            <div className="rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 p-6 md:p-8 shadow-xs">
              <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                      Banner Pengumuman Khusus
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Tampilkan bar informasi penting di bagian atas halaman Hubungi Kami
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {announcementActive ? "Aktif" : "Nonaktif"}
                  </span>
                  <input
                    type="checkbox"
                    checked={announcementActive}
                    onChange={(e) => setAnnouncementActive(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Isi Pesan Pengumuman
                  </label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Contoh: Konsultasi tatap muka dapat dijadwalkan via WhatsApp Hotline 24/7."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teks Tautan Aksi (Opsional)
                    </label>
                    <input
                      type="text"
                      value={announcementLinkText}
                      onChange={(e) => setAnnouncementLinkText(e.target.value)}
                      placeholder="Contoh: Hubungi via WhatsApp"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      URL Tautan Tujuan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={announcementLinkUrl}
                      onChange={(e) => setAnnouncementLinkUrl(e.target.value)}
                      placeholder="Contoh: https://wa.me/6281119719677"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Section 2: Opsi Pilihan Layanan */}
            <div className="rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                    Pilihan Jenis Layanan pada Formulir
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Opsi yang dapat dipilih pengunjung saat mengirim permohonan konsultasi
                  </p>
                </div>
              </div>

              {/* Add Service Option Form */}
              <form onSubmit={handleAddServiceOption} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newServiceText}
                  onChange={(e) => setNewServiceText(e.target.value)}
                  placeholder="Ketik opsi layanan baru..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </form>

              {/* Badges List */}
              <div className="flex flex-wrap gap-2">
                {servicesList.map((srv, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10"
                  >
                    <span>{srv}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteServiceOption(idx)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Hapus opsi ini"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-Section 3: FAQ Dinamis */}
            <div className="rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 p-6 md:p-8 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Tanya Jawab (FAQ)</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kelola daftar pertanyaan umum di halaman Hubungi Kami
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openAddFaqModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah FAQ</span>
                </button>
              </div>

              {/* FAQ List */}
              <div className="space-y-3">
                {faqsList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Belum ada FAQ. Klik tombol &quot;Tambah FAQ&quot; untuk membuat pertanyaan baru.
                  </div>
                ) : (
                  faqsList.map((faq) => (
                    <div
                      key={faq.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        faq.isActive
                          ? "bg-slate-50/70 dark:bg-white/5 border-slate-200/80 dark:border-white/10"
                          : "bg-slate-100/50 dark:bg-black/20 border-dashed border-slate-300 dark:border-white/10 opacity-70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white">{faq.question}</h4>
                            {!faq.isActive && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                Nonaktif
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleFaqActive(faq.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                              faq.isActive
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {faq.isActive ? "Aktif" : "Nonaktif"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditFaqModal(faq)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 cursor-pointer"
                            title="Edit FAQ"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteFaqItem(faq.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                            title="Hapus FAQ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Save All Tab 3 Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveFaqSettings}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/25 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL TAMBAH / EDIT FAQ */}
        {faqModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                  {editingFaq ? "Edit Pertanyaan FAQ" : "Tambah Pertanyaan FAQ Baru"}
                </h3>
                <button
                  onClick={() => setFaqModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFaqItem} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Pertanyaan FAQ
                  </label>
                  <input
                    type="text"
                    required
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    placeholder="Contoh: Berapa lama waktu respon untuk konsultasi?"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Jawaban FAQ
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    placeholder="Tuliskan jawaban yang jelas dan tepat..."
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="faq-status"
                    checked={faqIsActive}
                    onChange={(e) => setFaqIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
                  />
                  <label
                    htmlFor="faq-status"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Aktifkan pertanyaan ini di halaman Hubungi Kami
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setFaqModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs"
                  >
                    {editingFaq ? "Perbarui" : "Tambahkan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DETAIL PESAN & DEAL STAGE PIPELINE */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="consultation-detail-title"
              className="w-full min-w-0 max-w-2xl max-h-[92dvh] flex flex-col bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
            >
              <div className="shrink-0 px-4 sm:px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                <div className="min-w-0 flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                    {selectedMessage.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 break-words">
                    <h3
                      id="consultation-detail-title"
                      className="font-extrabold text-base text-slate-900 dark:text-white"
                    >
                      {selectedMessage.name}
                    </h3>
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                      {selectedMessage.company}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMessage(null)}
                  aria-label="Tutup detail konsultasi"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="min-h-0 p-4 sm:p-6 space-y-4 overflow-y-auto text-xs">
                {/* Meta details */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Email</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="font-bold text-orange-600 dark:text-orange-400 hover:underline break-all"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Telepon WhatsApp</span>
                    <a
                      href={`https://wa.me/${getCleanPhone(selectedMessage.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>

                  {/* Waktu pesan dikirim — zona waktu WIB, sinkron dengan database */}
                  <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Dikirim</span>
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatMessageRelative(selectedMessage.createdAt, new Date(clock))}
                      </span>
                    </div>
                    <p className="mt-1 font-bold text-slate-800 dark:text-slate-100">
                      {formatMessageDate(selectedMessage.createdAt)}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Pukul {formatMessageTime(selectedMessage.createdAt)}
                    </p>
                  </div>
                </div>

                <MessageConsultationDetails message={selectedMessage} />

                {/* DEAL STAGE PIPELINE (Tanpa slash) */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2.5">
                    Tahapan Calon Klien:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DEAL_STAGES.map((st) => {
                      const isCurrent = (selectedMessage.dealStage || "baru") === st.key;
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => handleUpdateStage(selectedMessage.id, st.key)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isCurrent
                              ? `${st.badgeBg} ${st.badgeText} ${st.badgeBorder} ring-2 ring-orange-500/30 shadow-xs font-bold`
                              : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`w-2 h-2 rounded-full ${st.dotBg}`} />
                            <span className="text-[11px]">{st.label}</span>
                          </div>
                          <p className="text-[9px] text-slate-400 line-clamp-1">{st.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DEAL NOTES TEXTAREA */}
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Catatan Perkembangan:</span>
                  </span>
                  <textarea
                    rows={2}
                    value={dealNotesInput}
                    onChange={(e) => setDealNotesInput(e.target.value)}
                    placeholder="Tuliskan catatan internal terkait klien atau jadwal pertemuan..."
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-black/30 border border-amber-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed resize-none"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={isSavingNotes}
                      onClick={handleSaveDealNotes}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                    >
                      {isSavingNotes ? "Menyimpan..." : "Simpan Catatan"}
                    </button>
                  </div>
                </div>

                {/* Status Switcher in Modal */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-wrap gap-3 items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Status Keterbacaan:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
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

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`https://wa.me/${getCleanPhone(selectedMessage.phone)}?text=Halo%20${encodeURIComponent(
                        selectedMessage.name
                      )},%20terima%20kasih%20telah%20menghubungi%20CITS%20Indonesia.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Balas via WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => openReplyModal(selectedMessage)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Kirim Balasan Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL BALAS EMAIL OTOMATIS */}
        {replyModalOpen && replyingMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-2xl bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20 shrink-0">
                    <Reply className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
                      Kirim Balasan Email
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Untuk <strong className="text-slate-700 dark:text-slate-200">{replyingMessage.name}</strong> (
                      {replyingMessage.company || "Umum"})
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

              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Kirim Ke
                    </label>
                    <input
                      type="email"
                      value={replyTo}
                      onChange={(e) => setReplyTo(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Subjek Email
                    </label>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Pilihan Draf Templat
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        id: "diskusi",
                        title: "Undangan Diskusi",
                        icon: Calendar,
                        desc: "Ajak pertemuan daring via GMeet/Zoom",
                      },
                      {
                        id: "penawaran",
                        title: "Penawaran Portofolio",
                        icon: FileText,
                        desc: "Kirim proposal & estimasi tahapan",
                      },
                      {
                        id: "spesifikasi",
                        title: "Klarifikasi KAK",
                        icon: Sparkles,
                        desc: "Minta rincian spesifikasi teknis",
                      },
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
                          <t.icon
                            className={`w-3.5 h-3.5 ${activeTemplate === t.id ? "text-orange-600" : "text-slate-400"}`}
                          />
                          <span
                            className={`text-[11px] font-bold ${activeTemplate === t.id ? "text-orange-700 dark:text-orange-300" : "text-slate-700 dark:text-slate-300"}`}
                          >
                            {t.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

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
                          <span className="text-emerald-600">Draf Berhasil Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Draf</span>
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

              <div className="p-4 px-6 border-t border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleMarkAsRepliedOnly}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tandai Sebagai Dibalas</span>
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleLaunchEmail("default")}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#1A1A2E] text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Bawaan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchEmail("outlook")}
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Outlook Web</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchEmail("gmail")}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim via Gmail</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL KONFIRMASI HAPUS MASAL */}
        {bulkDeletingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-[#16162a] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Hapus {selectedIds.length} Pesan Sekaligus?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Pesan-pesan terpilih akan dihapus secara permanen dari basis data dan tidak dapat dikembalikan.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs space-y-2 max-h-48 overflow-y-auto">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Daftar Pengirim ({selectedIds.length}):
                  </span>
                  {selectedIds.map((id) => {
                    const msg = messages.find((m) => m.id === id);
                    if (!msg) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 dark:border-white/5 last:border-none"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                          {msg.company || msg.email}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/80 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isBulkDeleting}
                  onClick={() => setBulkDeletingOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isBulkDeleting}
                  onClick={handleConfirmBulkDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isBulkDeleting ? "Menghapus..." : `Hapus ${selectedIds.length} Pesan`}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL KONFIRMASI HAPUS PESAN (SINGLE) */}
        {deletingMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-[#16162a] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Hapus Pesan Konsultasi?</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Pesan ini akan dihapus secara permanen dari basis data dan tidak dapat dikembalikan.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Pengirim:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                      {deletingMessage.name}
                    </span>
                  </div>

                  {deletingMessage.company && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Instansi:</span>
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

                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/5">
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 italic bg-white dark:bg-black/20 p-2.5 rounded-lg border border-slate-200/50 dark:border-white/5">
                      &quot;{deletingMessage.message}&quot;
                    </p>
                  </div>
                </div>
              </div>

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
