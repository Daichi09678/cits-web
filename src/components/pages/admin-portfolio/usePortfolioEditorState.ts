"use client";

import { useState, useRef } from "react";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";
import { useAdminDialog } from "@/components/pages/admin/AdminDialogProvider";
import { useCitsStore } from "@/stores/citsStore";
import { CaseStudyItem } from "@/types/schema";
import { SECTOR_OPTIONS } from "./constants";

export default function usePortfolioEditorState() {
  const { session } = useAdminAuth();

  const canCreate = canPerformAction(session?.user, "portfolio", "create");

  const canDelete = canPerformAction(session?.user, "portfolio", "delete");

  const canEdit = canPerformAction(session?.user, "portfolio", "edit");

  const { caseStudies, actions } = useCitsStore();

  const dialog = useAdminDialog();

  const [search, setSearch] = useState("");

  const [sectorFilter, setSectorFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "flagship">("all");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingStudy, setEditingStudy] = useState<CaseStudyItem | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);

  const [readingLogo, setReadingLogo] = useState(false);

  const [mutationError, setMutationError] = useState("");

  const [formTitle, setFormTitle] = useState("");

  const [formClient, setFormClient] = useState("");

  const [formClientShort, setFormClientShort] = useState("");

  const [formClientLogo, setFormClientLogo] = useState("/clients/kemendagri.svg");

  const [formSector, setFormSector] = useState(SECTOR_OPTIONS[0]);

  const [formCategoryTag, setFormCategoryTag] = useState("");

  const [formPeriod, setFormPeriod] = useState("2024 - Sekarang");

  const [formServicePillar, setFormServicePillar] = useState("Software House & Enterprise System");

  const [formIsFlagship, setFormIsFlagship] = useState(false);

  const [formTagline, setFormTagline] = useState("");

  const [formChallenge, setFormChallenge] = useState("");

  const [formSolution, setFormSolution] = useState("");

  const [formKpiValue, setFormKpiValue] = useState("99.9%");

  const [formKpiLabel, setFormKpiLabel] = useState("SLA Ketersediaan");

  const [formKpiDetail, setFormKpiDetail] = useState("");

  const [formScopeOfWork, setFormScopeOfWork] = useState("");

  const [formTechStack, setFormTechStack] = useState("");

  const [formDeliverables, setFormDeliverables] = useState("");

  const [formIsActive, setFormIsActive] = useState(true);

  const [formShowOnHome, setFormShowOnHome] = useState(true);

  const activeCount = caseStudies.filter((c) => c.isActive !== false).length;

  const flagshipCount = caseStudies.filter((c) => c.isFlagship && c.isActive !== false).length;

  const sectorsCount = new Set(caseStudies.map((c) => c.sector)).size;

  const filteredStudies = caseStudies.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.clientShort.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase());

    const matchesSector = sectorFilter === "All" || c.sector === sectorFilter;

    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = c.isActive !== false;
    if (statusFilter === "inactive") matchesStatus = c.isActive === false;
    if (statusFilter === "flagship") matchesStatus = !!c.isFlagship;

    return matchesSearch && matchesSector && matchesStatus;
  });
  return {
    session,
    canCreate,
    canDelete,
    canEdit,
    caseStudies,
    actions,
    dialog,
    search,
    setSearch,
    sectorFilter,
    setSectorFilter,
    statusFilter,
    setStatusFilter,
    modalOpen,
    setModalOpen,
    editingStudy,
    setEditingStudy,
    savedSuccess,
    setSavedSuccess,
    fileInputRef,
    saving,
    setSaving,
    readingLogo,
    setReadingLogo,
    mutationError,
    setMutationError,
    formTitle,
    setFormTitle,
    formClient,
    setFormClient,
    formClientShort,
    setFormClientShort,
    formClientLogo,
    setFormClientLogo,
    formSector,
    setFormSector,
    formCategoryTag,
    setFormCategoryTag,
    formPeriod,
    setFormPeriod,
    formServicePillar,
    setFormServicePillar,
    formIsFlagship,
    setFormIsFlagship,
    formTagline,
    setFormTagline,
    formChallenge,
    setFormChallenge,
    formSolution,
    setFormSolution,
    formKpiValue,
    setFormKpiValue,
    formKpiLabel,
    setFormKpiLabel,
    formKpiDetail,
    setFormKpiDetail,
    formScopeOfWork,
    setFormScopeOfWork,
    formTechStack,
    setFormTechStack,
    formDeliverables,
    setFormDeliverables,
    formIsActive,
    setFormIsActive,
    formShowOnHome,
    setFormShowOnHome,
    activeCount,
    flagshipCount,
    sectorsCount,
    filteredStudies,
  };
}

export type PortfolioEditorContext = ReturnType<typeof usePortfolioEditorState>;
