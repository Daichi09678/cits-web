"use client";

import { resolveServiceCatalog } from "@/lib/serviceCatalog";
import CatalogDeleteDetails from "@/components/admin/CatalogDeleteDetails";
import { ServicePillar } from "@/types/schema";
import type { ServiceManagementEditorContext } from "./useServiceManagementEditorState";

export default function createServiceManagementEditorActions(state: ServiceManagementEditorContext) {
  const {
    setEditingPillar,
    setFormTitle,
    setFormBadge,
    setFormIcon,
    setFormDesc,
    setFormSla,
    setFormFeatures,
    setFormCategory,
    setFormTags,
    setFormCaseStudyIds,
    setFormDetails,
    setSaveError,
    setFormIsActive,
    setFormShowOnHome,
    setIsIconPickerOpen,
    setIconCategoryFilter,
    setIconSearch,
    setHoveredIconOption,
    setModalOpen,
    services,
    isSaving,
    setIsSaving,
    editingPillar,
    formCategory,
    formTitle,
    formBadge,
    formIcon,
    formDesc,
    formSla,
    formFeatures,
    formTags,
    formIsActive,
    formShowOnHome,
    formDetails,
    formCaseStudyIds,
    actions,
    dialog,
    canDelete,
    deleting,
    categorySaving,
    setDeletingId,
    setSearch,
    setCategoryFilter,
    setPage,
    canEdit,
    categoryOperation,
    categoryName,
    categoryServiceIds,
    setCategoryError,
    setCategorySaving,
    setCategoryEditorOpen,
    setCategoryName,
    setCategoryServiceIds,
    categoryFilter,
  } = state;
  const lines = (text: string) => [
    ...new Set(
      text
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  ];

  const openEditModal = (pillar: ServicePillar) => {
    setEditingPillar(pillar);
    setFormTitle(pillar.title);
    setFormBadge(pillar.badge);
    setFormIcon(pillar.icon || "Code2");
    setFormDesc(pillar.desc);
    setFormSla(pillar.sla);
    const resolved = resolveServiceCatalog([{ ...pillar, isActive: true }])[0];
    setFormFeatures(resolved.features.join("\n"));
    setFormCategory(pillar.category || resolved.category || "Layanan CITS");
    setFormTags((pillar.tags || resolved.tags || []).join(", "));
    setFormCaseStudyIds(pillar.caseStudyIds || []);
    setFormDetails({
      image: pillar.image || "",
      details: resolved.details || "",
      techStack: resolved.techStack.join("\n"),
      caseStudies: resolved.caseStudies.join("\n"),
      deliverables: resolved.deliverables.map((item) => ({ ...item })),
    });
    setSaveError("");
    setFormIsActive(pillar.isActive !== false);
    setFormShowOnHome(pillar.showOnHome !== false);
    setIsIconPickerOpen(false);
    setIconCategoryFilter("Semua");
    setIconSearch("");
    setHoveredIconOption(null);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingPillar(null);
    setFormTitle("");
    setFormCategory("Software House");
    setFormBadge(`Pilar 0${services.length + 1}`);
    setFormIcon("Code2");
    setFormDesc("");
    setFormSla("");
    setFormFeatures("");
    setFormTags("");
    setFormCaseStudyIds([]);
    setFormDetails({ image: "", details: "", techStack: "", caseStudies: "", deliverables: [] });
    setSaveError("");
    setFormIsActive(true);
    setFormShowOnHome(true);
    setIsIconPickerOpen(false);
    setIconCategoryFilter("Semua");
    setIconSearch("");
    setHoveredIconOption(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setSaveError("");
    const next: ServicePillar = {
      ...editingPillar,
      id: editingPillar?.id || "pillar-" + crypto.randomUUID(),
      category: formCategory.trim(),
      title: formTitle.trim(),
      badge: formBadge.trim(),
      icon: formIcon,
      desc: formDesc.trim(),
      sla: formSla.trim(),
      features: lines(formFeatures),
      tags: formTags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      isActive: formIsActive,
      showOnHome: formShowOnHome,
      image: formDetails.image.trim() || undefined,
      details: formDetails.details.trim(),
      techStack: lines(formDetails.techStack),
      caseStudies: lines(formDetails.caseStudies),
      caseStudyIds: formCaseStudyIds,
      deliverables: formDetails.deliverables.map((item) => ({
        label: item.label.trim(),
        description: item.description.trim(),
      })),
    };
    try {
      await actions.saveServices(
        editingPillar ? services.map((item) => (item.id === editingPillar.id ? next : item)) : [...services, next]
      );
      setModalOpen(false);
      void dialog.alert({
        title: editingPillar ? "Layanan diperbarui" : "Layanan ditambahkan",
        description: "Foto dan rincian layanan berhasil disimpan.",
        variant: "success",
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Layanan gagal disimpan. Silakan coba kembali.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePillar = async (id: string, title: string) => {
    if (!canDelete || deleting.current || categorySaving || isSaving) return;
    deleting.current = true;
    try {
      const service = services.find((item) => item.id === id);
      if (!service) return;
      const confirmed = await dialog.confirm({
        title: "Hapus layanan?",
        description: "Periksa layanan berikut sebelum menghapusnya dari katalog.",
        details: (
          <CatalogDeleteDetails
            kind="layanan"
            name={service.title}
            category={service.category}
            isActive={service.isActive !== false}
            showOnHome={service.showOnHome !== false}
            featureCount={service.features?.length ?? 0}
          />
        ),
        confirmLabel: "Hapus layanan",
        variant: "danger",
      });
      if (confirmed) {
        setDeletingId(id);
        try {
          await actions.saveServices(services.filter((s) => s.id !== id));
        } catch (error) {
          await dialog.alert({
            title: "Layanan belum terhapus",
            description: error instanceof Error ? error.message : "Coba kembali.",
            variant: "danger",
          });
          return;
        }
        await dialog.alert({
          title: "Pilar layanan dihapus",
          description: `"${title}" berhasil dihapus dari daftar layanan.`,
          variant: "success",
        });
      }
    } finally {
      deleting.current = false;
      setDeletingId(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter(null);
    setPage(1);
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canEdit || categorySaving || categoryOperation.current || deleting.current) return;
    const name = categoryName.trim();
    if (!name || name.length > 100 || categoryServiceIds.length === 0) {
      setCategoryError("Isi nama kategori dan pilih minimal satu layanan.");
      return;
    }
    const ids = new Set(categoryServiceIds);
    if (!services.some((service) => ids.has(service.id))) {
      setCategoryError("Layanan yang dipilih sudah tidak tersedia. Pilih kembali layanan.");
      return;
    }
    setCategorySaving(true);
    setCategoryError("");
    try {
      await actions.saveServices(
        services.map((service) => (ids.has(service.id) ? { ...service, category: name } : service))
      );
      setCategoryEditorOpen(false);
      setCategoryName("");
      setCategoryServiceIds([]);
      resetFilters();
      setCategoryFilter(name);
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : "Kategori gagal disimpan. Silakan coba lagi.");
    } finally {
      setCategorySaving(false);
    }
  };

  const deleteCategory = async (category: string) => {
    if (!canEdit || categorySaving || categoryOperation.current || deleting.current) return;
    categoryOperation.current = true;
    try {
      const confirmed = await dialog.confirm({
        title: "Hapus kategori filter?",
        description: `Kategori "${category}" dihapus dari filter. Layanan di dalamnya tetap tersimpan dan dipindahkan ke Layanan CITS.`,
        confirmLabel: "Hapus Kategori",
        variant: "danger",
      });
      if (!confirmed) return;
      setCategorySaving(true);
      await actions.saveServices(
        services.map((service) =>
          (service.category || "Layanan CITS") === category ? { ...service, category: "Layanan CITS" } : service
        )
      );
      if (categoryFilter === category) setCategoryFilter(null);
      await dialog.alert({
        title: "Kategori dihapus",
        description: "Kategori filter dihapus. Seluruh layanan tetap tersimpan.",
        variant: "success",
      });
    } catch (cause) {
      await dialog.alert({
        title: "Kategori belum terhapus",
        description: cause instanceof Error ? cause.message : "Kategori gagal disimpan. Silakan coba kembali.",
        variant: "danger",
      });
    } finally {
      categoryOperation.current = false;
      setCategorySaving(false);
    }
  };
  return {
    lines,
    openEditModal,
    openAddModal,
    handleSave,
    handleDeletePillar,
    resetFilters,
    saveCategory,
    deleteCategory,
  };
}
