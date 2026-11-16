"use client";

import { consultationSummary } from "@/lib/consultation";
import { ContactMessage } from "@/types/schema";
import type { ContactEditorContext } from "./useContactEditorState";

export default function createContactReplyActions(state: ContactEditorContext) {
  const {
    canEdit,
    dialog,
    setReplyingMessage,
    setReplyTo,
    setReplySubject,
    setActiveTemplate,
    setReplyBody,
    setReplyModalOpen,
    actions,
    replyingMessage,
    selectedMessage,
    setSelectedMessage,
    replyTo,
    replySubject,
    replyBody,
    setReplyFeedback,
    setCopiedText,
  } = state;
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
  return {
    generateEmailDraft,
    openReplyModal,
    applyTemplate,
    handleLaunchEmail,
    handleCopyReplyDraft,
    handleMarkAsRepliedOnly,
  };
}
