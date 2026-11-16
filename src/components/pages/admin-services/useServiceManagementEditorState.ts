"use client";

import { useRef, useState } from "react";
import { type ServiceDetailsForm } from "@/components/admin/ServiceDetailsFields";
import { resolveServiceCatalog } from "@/lib/serviceCatalog";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";
import { useAdminDialog } from "@/components/pages/admin/AdminDialogProvider";
import { useCitsStore } from "@/stores/citsStore";
import { ServicePillar } from "@/types/schema";
import { PillarIconOption } from "@/lib/serviceIcons";
import { matchesCatalogQuery, serviceSearchFields } from "@/lib/catalogSearch";
import { SERVICE_TAG_PRESETS } from "./constants";

export default function useServiceManagementEditorState() {
  const { session } = useAdminAuth();

  const canCreate = canPerformAction(session?.user, "services", "create");

  const canDelete = canPerformAction(session?.user, "services", "delete");

  const canEdit = canPerformAction(session?.user, "services", "edit");

  const { services, caseStudies = [], actions } = useCitsStore();

  const dialog = useAdminDialog();

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false);

  const [categoryName, setCategoryName] = useState("");

  const [categoryServiceIds, setCategoryServiceIds] = useState<string[]>([]);

  const [categorySaving, setCategorySaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleting = useRef(false);

  const categoryOperation = useRef(false);

  const [categoryError, setCategoryError] = useState("");

  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingPillar, setEditingPillar] = useState<ServicePillar | null>(null);

  const [formTitle, setFormTitle] = useState("");

  const [formCategory, setFormCategory] = useState("Software House");

  const [formBadge, setFormBadge] = useState("");

  const [formIcon, setFormIcon] = useState("Code2");

  const [formDesc, setFormDesc] = useState("");

  const [formSla, setFormSla] = useState("");

  const [formFeatures, setFormFeatures] = useState("");

  const [formTags, setFormTags] = useState("");

  const [formCaseStudyIds, setFormCaseStudyIds] = useState<string[]>([]);

  const [formIsActive, setFormIsActive] = useState(true);

  const [formShowOnHome, setFormShowOnHome] = useState(true);

  const [formDetails, setFormDetails] = useState<ServiceDetailsForm>({
    image: "",
    details: "",
    techStack: "",
    caseStudies: "",
    deliverables: [],
  });

  const [isSaving, setIsSaving] = useState(false);

  const [saveError, setSaveError] = useState("");

  const fallbackImage = resolveServiceCatalog([
    {
      ...(editingPillar || { id: "new", title: "", badge: "", icon: "", desc: "", sla: "" }),
      image: undefined,
      isActive: true,
    },
  ])[0].image;

  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  const [iconCategoryFilter, setIconCategoryFilter] = useState("Semua");

  const [iconSearch, setIconSearch] = useState("");

  const [hoveredIconOption, setHoveredIconOption] = useState<PillarIconOption | null>(null);

  const catalog = services.map((service) => {
    const resolved = resolveServiceCatalog([{ ...service, isActive: true }])[0];
    return {
      ...service,
      category: resolved.category,
      features: resolved.features,
      image: resolved.image,
      source: service,
    };
  });

  const categories = [...new Set(catalog.map((service) => service.category))];

  const tags = [...new Set(catalog.flatMap((service) => service.tags || []))];

  const tagPresets = [...new Set([...tags, ...SERVICE_TAG_PRESETS])];

  const query = search.trim().toLowerCase();

  const filteredServices = catalog.filter(
    (service) =>
      matchesCatalogQuery(query, serviceSearchFields(service)) &&
      (categoryFilter === null || service.category === categoryFilter)
  );

  const hasFilters = !!search || categoryFilter !== null;

  const pageSize = 8;

  const currentPage = Math.min(page, Math.max(1, Math.ceil(filteredServices.length / pageSize)));

  const paginatedServices = filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return {
    session,
    canCreate,
    canDelete,
    canEdit,
    services,
    caseStudies,
    actions,
    dialog,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categoryEditorOpen,
    setCategoryEditorOpen,
    categoryName,
    setCategoryName,
    categoryServiceIds,
    setCategoryServiceIds,
    categorySaving,
    setCategorySaving,
    deletingId,
    setDeletingId,
    deleting,
    categoryOperation,
    categoryError,
    setCategoryError,
    page,
    setPage,
    modalOpen,
    setModalOpen,
    editingPillar,
    setEditingPillar,
    formTitle,
    setFormTitle,
    formCategory,
    setFormCategory,
    formBadge,
    setFormBadge,
    formIcon,
    setFormIcon,
    formDesc,
    setFormDesc,
    formSla,
    setFormSla,
    formFeatures,
    setFormFeatures,
    formTags,
    setFormTags,
    formCaseStudyIds,
    setFormCaseStudyIds,
    formIsActive,
    setFormIsActive,
    formShowOnHome,
    setFormShowOnHome,
    formDetails,
    setFormDetails,
    isSaving,
    setIsSaving,
    saveError,
    setSaveError,
    fallbackImage,
    isIconPickerOpen,
    setIsIconPickerOpen,
    iconCategoryFilter,
    setIconCategoryFilter,
    iconSearch,
    setIconSearch,
    hoveredIconOption,
    setHoveredIconOption,
    catalog,
    categories,
    tags,
    tagPresets,
    query,
    filteredServices,
    hasFilters,
    pageSize,
    currentPage,
    paginatedServices,
  };
}

export type ServiceManagementEditorContext = ReturnType<typeof useServiceManagementEditorState>;
