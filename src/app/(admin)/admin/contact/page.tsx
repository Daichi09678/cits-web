"use client";
import ContactInboxRow from "@/components/admin/ContactInboxRow";
import ConsultationDetailModal from "@/components/admin/ConsultationDetailModal";
import AdminDialogSurface from "@/components/admin/AdminDialogSurface";
import { consultationSummary } from "@/lib/consultation";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Info,
  MoreVertical,
  Search,
  Clock,
  Save,
  CheckCircle2,
  Trash2,
  Send,
  ExternalLink,
  CheckCheck,
  X,
  Volume2,
  Sparkles,
  Calendar,
  Copy,
  Reply,
  Check,
  FileText,
  AlertTriangle,
  HelpCircle,
  Plus,
  Edit3,
  Tag,
  type LucideIcon,
  Megaphone,
} from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useAdminDialog } from "@/components/admin/AdminDialogProvider";
import { useCitsStore } from "@/stores/citsStore";
import { ContactMessage, DealStage, ContactFaqItem } from "@/types/schema";
import { playNewMessageSound } from "@/lib/audio";

import { getMessageRetentionDays } from "@/config/inbox";
import Pagination from "@/components/admin/Pagination";

const DEAL_STAGES: {
  key: DealStage;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotBg: string;
  icon: LucideIcon;
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
  const { session } = useAdminAuth();
  const canEdit = canPerformAction(session?.user, "contact", "edit");
  const canDelete = canPerformAction(session?.user, "contact", "delete");
  const { contactInfo, messages, isLiveConnected, actions } = useCitsStore();
  const dialog = useAdminDialog();

  // Pesan yang lebih tua dari ini dihapus otomatis oleh server (lihat /api/messages).
  const retentionDays = getMessageRetentionDays();

  const [activeTab, setActiveTab] = useState<"inbox" | "info" | "faqs">("inbox");
  const [search, setSearch] = useState("");
  const [messagePage, setMessagePage] = useState(1);
  const [filterStage, setFilterStage] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeletingOpen, setBulkDeletingOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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

  const messagePageSize = 8;
  const paginatedMessages = filteredMessages.slice((messagePage - 1) * messagePageSize, messagePage * messagePageSize);

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
    if (!canDelete) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
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
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
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
    if (!canDelete) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
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
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    actions.updateMessageStage(msgId, stage);
    if (selectedMessage && selectedMessage.id === msgId) {
      setSelectedMessage({ ...selectedMessage, dealStage: stage });
    }
    const stageInfo = DEAL_STAGES.find((s) => s.key === stage);
    setReplyFeedback(`Tahapan diperbarui ke "${stageInfo?.label || stage}".`);
    setTimeout(() => setReplyFeedback(""), 3000);
  };

  // Persist notes through the existing endpoint before reporting success.
  const handleSaveDealNotes = async (notes: string) => {
    if (!canEdit) throw new Error("Anda tidak memiliki izin untuk menyimpan catatan.");
    if (!selectedMessage) throw new Error("Pesan tidak tersedia.");
    const message = selectedMessage;
    await actions.saveMessageNotes(message.id, message.dealStage || "baru", notes);
    setSelectedMessage((current) => (current?.id === message.id ? { ...current, dealNotes: notes } : current));
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
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    setReplyingMessage(msg);
    setReplyTo(msg.email);
    setReplySubject(`Tanggapan Konsultasi CITS Indonesia - ${msg.company || msg.name}`);
    setActiveTemplate(templateType);
    setReplyBody(generateEmailDraft(msg, templateType));
    setReplyModalOpen(true);
    if (canEdit && msg.status === "unread") {
      actions.updateMessageStatus(msg.id, "read");
    }
  };

  const applyTemplate = (type: "diskusi" | "penawaran" | "spesifikasi") => {
    if (!replyingMessage) return;
    setActiveTemplate(type);
    setReplyBody(generateEmailDraft(replyingMessage, type));
  };

  const handleLaunchEmail = (provider: "gmail" | "outlook" | "default") => {
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
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
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
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
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
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
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
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
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
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
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    setFaqsList(faqsList.filter((f) => f.id !== id));
  };

  const handleToggleFaqActive = (id: string) => {
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    setFaqsList(faqsList.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)));
  };

  const handleAddServiceOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    if (!newServiceText.trim()) return;
    if (servicesList.includes(newServiceText.trim())) return;
    setServicesList([...servicesList, newServiceText.trim()]);
    setNewServiceText("");
  };

  const handleDeleteServiceOption = (index: number) => {
    if (!canEdit) {
      void dialog.alert({
        title: "Akses terbatas",
        description: "Anda tidak memiliki izin untuk tindakan ini.",
        variant: "warning",
      });
      return;
    }
    setServicesList(servicesList.filter((_, i) => i !== index));
  };

  // Open Message Detail & mark as read if unread
  const handleOpenDetail = (msg: ContactMessage) => {
    const readMsg: ContactMessage = canEdit && msg.status === "unread" ? { ...msg, status: "read" } : msg;
    setSelectedMessage(readMsg);

    if (canEdit && msg.status === "unread") {
      actions.updateMessageStatus(msg.id, "read");
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F8F9FB] dark:bg-[#0F0F1A]">
      <AdminTopbar
        title="Kotak Masuk Pesan & Konsultasi"
        description="Kelola pesan masuk dari formulir website, pantau tahapan calon klien, dan kelola FAQ"
      />
      <div className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
        {/* Action Feedback Alert */}
        {replyFeedback && (
          <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{replyFeedback}</span>
          </div>
        )}

        {/* Main navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-6 dark:border-white/10">
          <nav aria-label="Menu kontak" className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
            {[
              { key: "inbox", label: "Inbox Konsultasi", icon: Mail },
              { key: "info", label: "Info Kontak", icon: Info },
              { key: "faqs", label: "Kelola FAQ & Layanan", icon: HelpCircle },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                aria-current={activeTab === key ? "page" : undefined}
                onClick={() => setActiveTab(key as "inbox" | "info" | "faqs")}
                className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border px-4 text-[13px] font-medium ${
                  activeTab === key
                    ? "border-[#F45100] bg-[#F45100] text-white"
                    : "border-gray-200 bg-white text-gray-900 hover:bg-slate-50 dark:border-white/10 dark:bg-[#151528] dark:text-slate-200"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </button>
            ))}
          </nav>
          {activeTab === "inbox" && (
            <div className="relative order-3 w-full lg:order-none lg:w-60">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              />
              <input
                type="search"
                aria-label="Cari pesan konsultasi"
                placeholder="Cari nama, instansi, atau pesan..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setMessagePage(1);
                }}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-white/10 dark:bg-[#151528] dark:text-white"
              />
            </div>
          )}
          <details className="group relative ml-auto">
            <summary
              aria-label="Opsi inbox"
              title="Opsi inbox"
              className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 [&::-webkit-details-marker]:hidden dark:hover:bg-white/5"
            >
              <MoreVertical className="h-4 w-4" />
            </summary>
            <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-lg border border-gray-200 bg-white p-3 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-[#151528] dark:text-slate-300">
              <label className="block font-medium" htmlFor="inbox-read-filter">
                Status bacaan
              </label>
              <select
                id="inbox-read-filter"
                value={filterStatus}
                onChange={(event) => {
                  setFilterStatus(event.target.value);
                  setMessagePage(1);
                }}
                className="mt-2 h-9 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs dark:border-white/10 dark:bg-[#151528]"
              >
                <option value="All">Semua pesan</option>
                <option value="unread">Belum Dibaca</option>
                <option value="read">Sudah Dibaca</option>
                <option value="replied">Dibalas</option>
              </select>
              <button
                type="button"
                onClick={() => playNewMessageSound()}
                className="mt-3 flex items-center gap-2 py-2 text-left hover:text-[#F45100]"
              >
                <Volume2 className="h-4 w-4" />
                Tes Nada Notifikasi
              </button>
              <p className="mt-2 border-t border-gray-100 pt-3 leading-5 dark:border-white/10">
                Auto-hapus pesan setelah {retentionDays} hari.
              </p>
              <p className="mt-1">{isLiveConnected ? "Live Realtime terhubung" : "Menunggu koneksi realtime"}</p>
            </div>
          </details>
        </div>

        {/* TAB 1: INBOX PESAN MASUK */}
        {activeTab === "inbox" && (
          <div className="min-w-0 space-y-4">
            <nav
              aria-label="Tahapan konsultasi"
              className="flex min-w-0 overflow-x-auto border-b border-gray-200 dark:border-white/10"
            >
              <button
                type="button"
                aria-current={filterStage === "All" ? "page" : undefined}
                onClick={() => {
                  setFilterStage("All");
                  setMessagePage(1);
                }}
                className={`flex h-[52px] shrink-0 items-center justify-center gap-2 border-b-2 px-6 text-[13px] font-medium ${filterStage === "All" ? "border-[#F45100] text-gray-900 dark:text-white" : "border-transparent text-slate-600 hover:text-gray-900 dark:text-slate-400"}`}
              >
                Semua ({messages.length})
              </button>
              {DEAL_STAGES.map((stage) => (
                <button
                  key={stage.key}
                  type="button"
                  aria-current={filterStage === stage.key ? "page" : undefined}
                  onClick={() => {
                    setFilterStage(stage.key);
                    setMessagePage(1);
                  }}
                  className={`flex h-[52px] flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap border-b-2 px-6 text-[13px] font-medium ${filterStage === stage.key ? "border-[#F45100] text-gray-900 dark:text-white" : "border-transparent text-slate-600 hover:text-gray-900 dark:text-slate-400"}`}
                >
                  {stage.label}
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-gray-100 px-1.5 text-[11px] leading-4 text-slate-600 dark:bg-white/10 dark:text-slate-400">
                    {messages.filter((message) => (message.dealStage || "baru") === stage.key).length}
                  </span>
                </button>
              ))}
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-100/70 px-4 py-2 dark:bg-white/5">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex cursor-pointer items-center gap-4 text-[13px] text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredMessages.length}
                    ref={(element) => {
                      if (element)
                        element.indeterminate =
                          selectedIds.length > 0 && selectedIds.length !== filteredMessages.length;
                    }}
                    onChange={handleToggleSelectAll}
                    className="h-4 w-4 accent-[#F45100]"
                  />
                  Pilih semua ({filteredMessages.length})
                </label>
                {selectedIds.length > 0 && <span className="text-xs text-slate-500">{selectedIds.length} dipilih</span>}
                {filterStatus !== "All" && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilterStatus("All");
                      setMessagePage(1);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300"
                  >
                    {filterStatus === "unread" ? "Belum Dibaca" : filterStatus === "read" ? "Sudah Dibaca" : "Dibalas"}
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="ml-auto flex items-center gap-3">
                {canEdit && (
                  <button
                    type="button"
                    disabled={selectedIds.length === 0}
                    onClick={handleBulkMarkAsRead}
                    className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-transparent dark:text-slate-300"
                  >
                    Tandai Dibaca
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    disabled={selectedIds.length === 0}
                    onClick={() => setBulkDeletingOpen(true)}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:bg-transparent dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {filteredMessages.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-white/10 dark:bg-[#151528]">
                  <Mail className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                  <p className="text-sm text-slate-500">Tidak ada pesan konsultasi yang sesuai dengan filter.</p>
                </div>
              ) : (
                paginatedMessages.map((message) => (
                  <ContactInboxRow
                    key={message.id}
                    message={message}
                    stages={DEAL_STAGES}
                    selected={selectedIds.includes(message.id)}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onSelect={() => handleToggleSelectOne(message.id)}
                    onOpen={() => handleOpenDetail(message)}
                    onReply={() => openReplyModal(message)}
                    onDelete={() => setDeletingMessage(message)}
                    onStageChange={(stage) => handleUpdateStage(message.id, stage)}
                  />
                ))
              )}
            </div>
            <Pagination
              page={messagePage}
              pageSize={messagePageSize}
              total={filteredMessages.length}
              onPageChange={setMessagePage}
            />
          </div>
        )}

        {/* TAB 2: INFORMASI KONTAK RESMI FRONT OFFICE */}
        {activeTab === "info" && (
          <div className="mt-6 max-w-3xl rounded-xl bg-white dark:bg-[#151528] border border-gray-200 dark:border-white/10 p-6 md:p-8">
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
          <div className="mt-6 space-y-6">
            {faqSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">{faqSuccessMsg}</span>
              </div>
            )}

            {/* Sub-Section 1: Banner Pengumuman Halaman Kontak */}
            <div className="rounded-xl bg-white dark:bg-[#151528] border border-gray-200 dark:border-white/10 p-6 md:p-8">
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
            <div className="rounded-xl bg-white dark:bg-[#151528] border border-gray-200 dark:border-white/10 p-6 md:p-8">
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
            <div className="rounded-xl bg-white dark:bg-[#151528] border border-gray-200 dark:border-white/10 p-6 md:p-8">
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
                  disabled={!canEdit}
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
                  disabled={!canEdit}
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

        {selectedMessage && (
          <ConsultationDetailModal
            key={selectedMessage.id}
            message={selectedMessage}
            stages={DEAL_STAGES}
            canEdit={canEdit}
            canDelete={canDelete}
            onClose={() => setSelectedMessage(null)}
            onStageChange={(stage) => handleUpdateStage(selectedMessage.id, stage)}
            onReadStatusChange={(status) => {
              if (!canEdit) return;
              actions.updateMessageStatus(selectedMessage.id, status);
              setSelectedMessage((current) => (current ? { ...current, status } : current));
            }}
            onSaveNotes={handleSaveDealNotes}
            onReply={() => openReplyModal(selectedMessage)}
            onDelete={() => setDeletingMessage(selectedMessage)}
          />
        )}

        {/* MODAL BALAS EMAIL OTOMATIS */}
        {replyModalOpen && replyingMessage && (
          <AdminDialogSurface
            labelledBy="reply-dialog-title"
            onClose={() => setReplyModalOpen(false)}
            widthClassName="w-[min(672px,calc(100vw-48px))]"
          >
            <div className="w-full max-w-2xl bg-white dark:bg-[#16162D] min-h-0 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20 shrink-0">
                    <Reply className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      id="reply-dialog-title"
                      className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white"
                    >
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
                  aria-label="Tutup balasan email"
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
                  disabled={!canEdit}
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
          </AdminDialogSurface>
        )}

        {/* MODAL KONFIRMASI HAPUS MASAL */}
        {bulkDeletingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-[#16162a] min-h-0 overflow-y-auto">
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
          <AdminDialogSurface
            labelledBy="delete-message-title"
            onClose={() => {
              if (!isDeleting) setDeletingMessage(null);
            }}
            widthClassName="w-[min(448px,calc(100vw-48px))]"
          >
            <div className="w-full max-w-md bg-white dark:bg-[#16162a] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 id="delete-message-title" className="text-base font-bold text-slate-900 dark:text-white">
                      Hapus Pesan Konsultasi?
                    </h3>
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
          </AdminDialogSurface>
        )}
      </div>
    </div>
  );
}
