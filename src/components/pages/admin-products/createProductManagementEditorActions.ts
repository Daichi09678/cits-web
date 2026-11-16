"use client";

import { ProductItem } from "@/types/schema";
import type { ProductManagementEditorContext } from "./useProductManagementEditorState";

export default function createProductManagementEditorActions(state: ProductManagementEditorContext) {
  const {
    dialog,
    setReadingImage,
    setFormImage,
    setMutationError,
    fileInputRef,
    setEditingProduct,
    setFormName,
    setFormCategory,
    setFormDescription,
    setFormDetails,
    setFormSpecifications,
    setFormFeatures,
    setFormTags,
    setFormIcon,
    setFormIsActive,
    setFormShowOnHome,
    setModalOpen,
    saving,
    readingImage,
    setSaving,
    formFeatures,
    formTags,
    editingProduct,
    actions,
    formName,
    formCategory,
    formDescription,
    formDetails,
    formSpecifications,
    formIcon,
    formImage,
    formIsActive,
    formShowOnHome,
    canEdit,
    categoryPending,
    categorySaving,
    setCategorySaving,
    products,
    productFilters,
    setProductFilters,
  } = state;
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 3 * 1024 * 1024) {
      void dialog.alert({
        title: "Ukuran foto terlalu besar",
        description: "Gunakan PNG, JPG, atau WebP maksimal 3 MB.",
        variant: "warning",
      });
      return;
    }

    setReadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormImage(event.target.result as string);
      }
      setReadingImage(false);
    };
    reader.onerror = () => {
      setReadingImage(false);
      setMutationError("Foto gagal dibaca. Silakan pilih ulang.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openAddModal = () => {
    setMutationError("");
    setEditingProduct(null);
    setFormName("");
    setFormCategory("Enterprise");
    setFormDescription("");
    setFormDetails("");
    setFormSpecifications([]);
    setFormFeatures("Integrasi API, Laporan Real-Time, Multi-User");
    setFormTags("Enterprise, Cloud, Secure");
    setFormIcon("Package");
    setFormImage("");
    setFormIsActive(true);
    setFormShowOnHome(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  };

  const openEditModal = (prod: ProductItem) => {
    setMutationError("");
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormDescription(prod.description);
    setFormDetails(prod.details || "");
    setFormSpecifications((prod.specifications || []).map((row) => ({ ...row })));
    setFormFeatures(prod.features.join(", "));
    setFormTags(prod.tags.join(", "));
    setFormIcon(prod.icon || "Package");
    setFormImage(prod.image || "");
    setFormIsActive(prod.isActive);
    setFormShowOnHome(prod.showOnHome !== false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || readingImage) return;
    setSaving(true);
    setMutationError("");
    try {
      const featuresArr = formFeatures
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const tagsArr = formTags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (editingProduct) {
        await actions.updateProduct(editingProduct.id, {
          name: formName,
          category: formCategory,
          description: formDescription,
          details: formDetails,
          specifications: formSpecifications,
          features: featuresArr,
          tags: tagsArr,
          icon: formIcon,
          image: formImage.trim(),
          isActive: formIsActive,
          showOnHome: formShowOnHome,
        });
      } else {
        await actions.addProduct({
          name: formName,
          category: formCategory,
          description: formDescription,
          details: formDetails,
          specifications: formSpecifications,
          features: featuresArr,
          tags: tagsArr,
          icon: formIcon,
          image: formImage.trim(),
          isActive: formIsActive,
          showOnHome: formShowOnHome,
        });
      }

      setModalOpen(false);
      void dialog.alert({
        title: editingProduct ? "Produk diperbarui" : "Produk ditambahkan",
        description: editingProduct
          ? `Perubahan produk "${formName}" berhasil disimpan.`
          : `Produk "${formName}" berhasil ditambahkan ke katalog.`,
        variant: "success",
      });
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Perubahan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (category: string) => {
    if (!canEdit || categoryPending.current || categorySaving) return;
    categoryPending.current = true;
    try {
      const confirmed = await dialog.confirm({
        title: "Hapus kategori filter?",
        description: `Kategori "${category}" dihapus dari filter. Produk di dalamnya tetap disimpan dan dipindahkan ke General.`,
        confirmLabel: "Hapus Kategori",
        variant: "danger",
      });
      if (!confirmed) return;
      setCategorySaving(true);
      for (const product of products.filter((item) => item.category === category))
        await actions.updateProduct(product.id, { category: "General" });
      if (productFilters.category === category) setProductFilters({ ...productFilters, category: "" });
      await dialog.alert({
        title: "Kategori dihapus",
        description: "Kategori filter berhasil dihapus. Seluruh produk tetap tersimpan.",
        variant: "success",
      });
    } catch (cause) {
      await dialog.alert({
        title: "Kategori belum selesai dihapus",
        description: cause instanceof Error ? cause.message : "Coba kembali untuk menyelesaikan pemindahan kategori.",
        variant: "danger",
      });
    } finally {
      categoryPending.current = false;
      setCategorySaving(false);
    }
  };

  const handleCloseModal = () => {
    if (saving || readingImage) return;
    setModalOpen(false);
  };
  return {
    handleImageFileChange,
    handleRemoveImage,
    openAddModal,
    openEditModal,
    handleSave,
    deleteCategory,
    handleCloseModal,
  };
}
