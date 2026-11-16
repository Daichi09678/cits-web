"use client";

import { useState, useEffect, useRef } from "react";
import { useCitsStore } from "@/stores/citsStore";
import { LandingPageData, ClientPartner } from "@/types/schema";
import { initialLandingPageData, defaultSectionVisibility } from "@/data/initialData";
import { useAdminDialog } from "@/components/pages/admin/AdminDialogProvider";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";

export default function useLandingEditorState() {
  const { landingData, clients, aboutData, actions } = useCitsStore();

  const dialog = useAdminDialog();

  const { session } = useAdminAuth();

  const canCreateClients = canPerformAction(session?.user, "clients", "create");

  const canEditClients = canPerformAction(session?.user, "clients", "edit");

  const canDeleteClients = canPerformAction(session?.user, "clients", "delete");

  const [clientSearch, setClientSearch] = useState("");

  const [clientFilter, setClientFilter] = useState<string>("Semua");

  const [clientModalOpen, setClientModalOpen] = useState(false);

  const [editingClient, setEditingClient] = useState<ClientPartner | null>(null);

  const [clientFormName, setClientFormName] = useState("");

  const [clientFormCategory, setClientFormCategory] = useState<ClientPartner["category"]>("Kementerian");

  const [clientFormLogo, setClientFormLogo] = useState("/clients/kemenhub.webp");

  const [clientFormIsActive, setClientFormIsActive] = useState(true);

  const [clientSuccessMsg, setClientSuccessMsg] = useState("");

  const [clientError, setClientError] = useState("");

  const [clientMutation, setClientMutation] = useState<string | null>(null);

  const clientBusy = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const PRESET_CLIENT_LOGOS = [
    { name: "Kementerian Perhubungan RI", logo: "/clients/kemenhub.webp" },
    { name: "Kementerian ESDM", logo: "/clients/esdm.webp" },
    { name: "Kementerian Ketenagakerjaan RI", logo: "/clients/kemnaker.webp" },
    { name: "Kementerian Investasi / BKPM", logo: "/clients/bkpm.webp" },
    { name: "Kementerian Kesehatan RI", logo: "/clients/kemenkes.webp" },
    { name: "Kementerian Dalam Negeri RI", logo: "/clients/kemendagri.svg" },
    { name: "Kementerian Kominfo RI", logo: "/clients/kominfo.webp" },
    { name: "Kementerian Perdagangan RI", logo: "/clients/perdagangan.webp" },
    { name: "Kementerian Koperasi dan UKM RI", logo: "/clients/kemenkop.webp" },
    { name: "Kementerian ATR/BPN", logo: "/clients/atr-bpn.webp" },
    { name: "PT Indonesia Power", logo: "/clients/indonesia-power.webp" },
    { name: "Mahkamah Agung RI", logo: "/clients/makamah-agung.webp" },
    { name: "BPPT", logo: "/clients/bppt.webp" },
    { name: "BRIN", logo: "/clients/brin.webp" },
  ];

  const [activeTab, setActiveTab] = useState<"hero" | "stats" | "services" | "products" | "clients" | "cta">("hero");

  const [formData, setFormData] = useState<LandingPageData>(() => {
    const base = landingData || initialLandingPageData;
    return {
      ...initialLandingPageData,
      ...base,
      sectionVisibility: {
        ...defaultSectionVisibility,
        ...(base.sectionVisibility || {}),
      },
      hero: { ...initialLandingPageData.hero, ...(base.hero || {}) },
      highlights: base.highlights || initialLandingPageData.highlights,
      servicesIntro: { ...initialLandingPageData.servicesIntro, ...(base.servicesIntro || {}) },
      productsIntro: { ...initialLandingPageData.productsIntro, ...(base.productsIntro || {}) },
      clientsIntro: { ...initialLandingPageData.clientsIntro, ...(base.clientsIntro || {}) },
      cta: { ...initialLandingPageData.cta, ...(base.cta || {}) },
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const contentBusy = useRef(false);

  const lastSyncedLandingRef = useRef<string>("");

  // Store refreshes can replace object identities without changing content; preserve unsaved edits.
  useEffect(() => {
    if (!landingData) return;
    const incoming = JSON.stringify(landingData);
    if (incoming === lastSyncedLandingRef.current) return;
    lastSyncedLandingRef.current = incoming;
    setFormData({
      ...initialLandingPageData,
      ...landingData,
      sectionVisibility: {
        ...defaultSectionVisibility,
        ...(landingData.sectionVisibility || {}),
      },
      hero: { ...initialLandingPageData.hero, ...(landingData.hero || {}) },
      highlights: landingData.highlights || initialLandingPageData.highlights,
      servicesIntro: { ...initialLandingPageData.servicesIntro, ...(landingData.servicesIntro || {}) },
      productsIntro: { ...initialLandingPageData.productsIntro, ...(landingData.productsIntro || {}) },
      clientsIntro: { ...initialLandingPageData.clientsIntro, ...(landingData.clientsIntro || {}) },
      cta: { ...initialLandingPageData.cta, ...(landingData.cta || {}) },
    });
  }, [landingData]);

  const vis = formData.sectionVisibility || defaultSectionVisibility;
  return {
    landingData,
    clients,
    aboutData,
    actions,
    dialog,
    session,
    canCreateClients,
    canEditClients,
    canDeleteClients,
    clientSearch,
    setClientSearch,
    clientFilter,
    setClientFilter,
    clientModalOpen,
    setClientModalOpen,
    editingClient,
    setEditingClient,
    clientFormName,
    setClientFormName,
    clientFormCategory,
    setClientFormCategory,
    clientFormLogo,
    setClientFormLogo,
    clientFormIsActive,
    setClientFormIsActive,
    clientSuccessMsg,
    setClientSuccessMsg,
    clientError,
    setClientError,
    clientMutation,
    setClientMutation,
    clientBusy,
    fileInputRef,
    PRESET_CLIENT_LOGOS,
    activeTab,
    setActiveTab,
    formData,
    setFormData,
    savedSuccess,
    setSavedSuccess,
    isSaving,
    setIsSaving,
    saveError,
    setSaveError,
    contentBusy,
    lastSyncedLandingRef,
    vis,
  };
}

export type LandingEditorContext = ReturnType<typeof useLandingEditorState>;
