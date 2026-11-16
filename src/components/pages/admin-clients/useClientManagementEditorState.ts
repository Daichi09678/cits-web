"use client";

import { useState, useRef } from "react";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";
import { useAdminDialog } from "@/components/pages/admin/AdminDialogProvider";
import { useCitsStore } from "@/stores/citsStore";
import { ClientPartner } from "@/types/schema";

export default function useClientManagementEditorState() {
  const { session } = useAdminAuth();

  const canEdit = canPerformAction(session?.user, "clients", "edit");

  const canDelete = canPerformAction(session?.user, "clients", "delete");

  const canCreate = canPerformAction(session?.user, "clients", "create");

  const { clients, actions } = useCitsStore();

  const dialog = useAdminDialog();

  const [modalOpen, setModalOpen] = useState(false);

  const [editingClient, setEditingClient] = useState<ClientPartner | null>(null);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);

  const [readingLogo, setReadingLogo] = useState(false);

  const [mutationError, setMutationError] = useState("");

  const [formName, setFormName] = useState("");

  const [formLogo, setFormLogo] = useState("/clients/kemenhub.webp");

  const [formCategory, setFormCategory] = useState<ClientPartner["category"]>("Kementerian");

  const [formIsActive, setFormIsActive] = useState(true);

  const [formShowOnHome, setFormShowOnHome] = useState(true);

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

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase())
  );

  const pageSize = 9;

  const paginatedClients = filteredClients.slice((page - 1) * pageSize, page * pageSize);
  return {
    session,
    canEdit,
    canDelete,
    canCreate,
    clients,
    actions,
    dialog,
    modalOpen,
    setModalOpen,
    editingClient,
    setEditingClient,
    search,
    setSearch,
    page,
    setPage,
    savedSuccess,
    setSavedSuccess,
    fileInputRef,
    saving,
    setSaving,
    readingLogo,
    setReadingLogo,
    mutationError,
    setMutationError,
    formName,
    setFormName,
    formLogo,
    setFormLogo,
    formCategory,
    setFormCategory,
    formIsActive,
    setFormIsActive,
    formShowOnHome,
    setFormShowOnHome,
    PRESET_CLIENT_LOGOS,
    filteredClients,
    pageSize,
    paginatedClients,
  };
}

export type ClientManagementEditorContext = ReturnType<typeof useClientManagementEditorState>;
