"use client";

import { consultationSummary } from "@/lib/consultation";
import { useState, useRef } from "react";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";
import { useAdminDialog } from "@/components/pages/admin/AdminDialogProvider";
import { useCitsStore } from "@/stores/citsStore";
import { ContactMessage, ContactFaqItem } from "@/types/schema";
import { getMessageRetentionDays } from "@/config/inbox";

export default function useContactEditorState() {
  const { session } = useAdminAuth();

  const canEdit = canPerformAction(session?.user, "contact", "edit");
  const canCreate = canPerformAction(session?.user, "contact", "create");

  const canDelete = canPerformAction(session?.user, "contact", "delete");

  const { contactInfo, messages, isLiveConnected, actions } = useCitsStore();

  const dialog = useAdminDialog();

  // The messages API applies this retention period on the server.
  const retentionDays = getMessageRetentionDays();

  const [activeTab, setActiveTab] = useState<"inbox" | "info" | "faqs">("inbox");

  const [search, setSearch] = useState("");

  const [messagePage, setMessagePage] = useState(1);

  const [filterStage, setFilterStage] = useState<string>("All");

  const [filterStatus, setFilterStatus] = useState<string>("All");

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [bulkDeletingOpen, setBulkDeletingOpen] = useState(false);

  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const [replyModalOpen, setReplyModalOpen] = useState(false);

  const [replyingMessage, setReplyingMessage] = useState<ContactMessage | null>(null);

  const [replyTo, setReplyTo] = useState("");

  const [replySubject, setReplySubject] = useState("");

  const [replyBody, setReplyBody] = useState("");

  const [activeTemplate, setActiveTemplate] = useState<"diskusi" | "penawaran" | "spesifikasi">("diskusi");

  const [copiedText, setCopiedText] = useState(false);

  const [replyFeedback, setReplyFeedback] = useState("");

  const [addressDraft, setAddress] = useState<string>();
  const address = addressDraft ?? contactInfo.address;

  const [phoneDraft, setPhone] = useState<string>();
  const phone = phoneDraft ?? contactInfo.phone;

  const [emailDraft, setEmail] = useState<string>();
  const email = emailDraft ?? contactInfo.email;

  const [workingHoursDraft, setWorkingHours] = useState<string>();
  const workingHours = workingHoursDraft ?? contactInfo.workingHours;

  const [emergencyPhoneDraft, setEmergencyPhone] = useState<string>();
  const emergencyPhone = emergencyPhoneDraft ?? contactInfo.emergencyPhone ?? "";

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const settingsPending = useRef(false);

  const [faqsDraft, setFaqsList] = useState<ContactFaqItem[]>();
  const faqsList = faqsDraft ?? contactInfo.faqs ?? [];

  const [servicesDraft, setServicesList] = useState<string[]>();
  const servicesList = servicesDraft ?? contactInfo.customServices ?? [];

  const [newServiceText, setNewServiceText] = useState("");

  const [editingFaq, setEditingFaq] = useState<ContactFaqItem | null>(null);

  const [faqModalOpen, setFaqModalOpen] = useState(false);

  const [faqQuestion, setFaqQuestion] = useState("");

  const [faqAnswer, setFaqAnswer] = useState("");

  const [faqIsActive, setFaqIsActive] = useState(true);

  const [announcementActiveDraft, setAnnouncementActive] = useState<boolean>();
  const announcementActive = announcementActiveDraft ?? contactInfo.announcement?.isActive ?? false;

  const [announcementTextDraft, setAnnouncementText] = useState<string>();
  const announcementText = announcementTextDraft ?? contactInfo.announcement?.text ?? "";

  const [announcementLinkTextDraft, setAnnouncementLinkText] = useState<string>();
  const announcementLinkText = announcementLinkTextDraft ?? contactInfo.announcement?.linkText ?? "";

  const [announcementLinkUrlDraft, setAnnouncementLinkUrl] = useState<string>();
  const announcementLinkUrl = announcementLinkUrlDraft ?? contactInfo.announcement?.linkUrl ?? "";

  const [faqSuccessMsg, setFaqSuccessMsg] = useState("");

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
  return {
    session,
    canEdit,
    canCreate,
    canDelete,
    contactInfo,
    clearInfoDraft: () => {
      setAddress(undefined);
      setPhone(undefined);
      setEmail(undefined);
      setWorkingHours(undefined);
      setEmergencyPhone(undefined);
    },
    clearFaqDraft: () => {
      setFaqsList(undefined);
      setServicesList(undefined);
      setAnnouncementActive(undefined);
      setAnnouncementText(undefined);
      setAnnouncementLinkText(undefined);
      setAnnouncementLinkUrl(undefined);
    },
    messages,
    isLiveConnected,
    actions,
    dialog,
    retentionDays,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    messagePage,
    setMessagePage,
    filterStage,
    setFilterStage,
    filterStatus,
    setFilterStatus,
    selectedMessage,
    setSelectedMessage,
    selectedIds,
    setSelectedIds,
    bulkDeletingOpen,
    setBulkDeletingOpen,
    isBulkDeleting,
    setIsBulkDeleting,
    deletingMessage,
    setDeletingMessage,
    isDeleting,
    setIsDeleting,
    replyModalOpen,
    setReplyModalOpen,
    replyingMessage,
    setReplyingMessage,
    replyTo,
    setReplyTo,
    replySubject,
    setReplySubject,
    replyBody,
    setReplyBody,
    activeTemplate,
    setActiveTemplate,
    copiedText,
    setCopiedText,
    replyFeedback,
    setReplyFeedback,
    address,
    setAddress,
    phone,
    setPhone,
    email,
    setEmail,
    workingHours,
    setWorkingHours,
    emergencyPhone,
    setEmergencyPhone,
    savedSuccess,
    setSavedSuccess,
    settingsSaving,
    setSettingsSaving,
    settingsError,
    setSettingsError,
    settingsPending,
    faqsList,
    setFaqsList,
    servicesList,
    setServicesList,
    newServiceText,
    setNewServiceText,
    editingFaq,
    setEditingFaq,
    faqModalOpen,
    setFaqModalOpen,
    faqQuestion,
    setFaqQuestion,
    faqAnswer,
    setFaqAnswer,
    faqIsActive,
    setFaqIsActive,
    announcementActive,
    setAnnouncementActive,
    announcementText,
    setAnnouncementText,
    announcementLinkText,
    setAnnouncementLinkText,
    announcementLinkUrl,
    setAnnouncementLinkUrl,
    faqSuccessMsg,
    setFaqSuccessMsg,
    filteredMessages,
    messagePageSize,
    paginatedMessages,
  };
}

export type ContactEditorContext = ReturnType<typeof useContactEditorState>;
