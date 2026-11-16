"use client";

import { useState, useRef } from "react";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";
import { useAdminDialog } from "@/components/pages/admin/AdminDialogProvider";
import { useCitsStore } from "@/stores/citsStore";
import { ProductItem } from "@/types/schema";
import { emptyProductFilters, filterProducts } from "@/lib/catalogSearch";
import { csvToList, defaultCategories } from "./constants";

export default function useProductManagementEditorState() {
  const { session } = useAdminAuth();

  const canEdit = canPerformAction(session?.user, "products", "edit");

  const canDelete = canPerformAction(session?.user, "products", "delete");

  const canCreate = canPerformAction(session?.user, "products", "create");

  const { products, actions } = useCitsStore();

  const dialog = useAdminDialog();

  const [productFilters, setProductFilters] = useState({ ...emptyProductFilters });

  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false);

  const [categorySaving, setCategorySaving] = useState(false);

  const categoryPending = useRef(false);

  const [previewProduct, setPreviewProduct] = useState<ProductItem | null>(null);

  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [saving, setSaving] = useState(false);

  const [readingImage, setReadingImage] = useState(false);

  const [mutationError, setMutationError] = useState("");

  const [formName, setFormName] = useState("");

  const [formCategory, setFormCategory] = useState<ProductItem["category"]>("Enterprise");

  const [formDescription, setFormDescription] = useState("");

  const [formDetails, setFormDetails] = useState("");

  const [formSpecifications, setFormSpecifications] = useState<NonNullable<ProductItem["specifications"]>>([]);

  const [formFeatures, setFormFeatures] = useState("");

  const [formTags, setFormTags] = useState("");

  const [formIcon, setFormIcon] = useState("Package");

  const [formImage, setFormImage] = useState("");

  const [formIsActive, setFormIsActive] = useState(true);

  const [formShowOnHome, setFormShowOnHome] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = filterProducts(products, productFilters);

  const categories = [...new Set([...defaultCategories, ...products.map((product) => product.category)])];

  const pageSize = 8;

  const currentPage = Math.min(page, Math.max(1, Math.ceil(filteredProducts.length / pageSize)));

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const draftProduct: ProductItem = {
    id: editingProduct?.id || "preview",
    name: formName || "Produk Baru",
    category: formCategory,
    description: formDescription,
    details: formDetails,
    specifications: formSpecifications,
    features: csvToList(formFeatures),
    tags: csvToList(formTags),
    icon: formIcon,
    image: formImage,
    isActive: formIsActive,
    showOnHome: formShowOnHome,
    updatedAt: editingProduct?.updatedAt || new Date().toISOString(),
  };
  return {
    session,
    canEdit,
    canDelete,
    canCreate,
    products,
    actions,
    dialog,
    productFilters,
    setProductFilters,
    categoryEditorOpen,
    setCategoryEditorOpen,
    categorySaving,
    setCategorySaving,
    categoryPending,
    previewProduct,
    setPreviewProduct,
    page,
    setPage,
    modalOpen,
    setModalOpen,
    editingProduct,
    setEditingProduct,
    saving,
    setSaving,
    readingImage,
    setReadingImage,
    mutationError,
    setMutationError,
    formName,
    setFormName,
    formCategory,
    setFormCategory,
    formDescription,
    setFormDescription,
    formDetails,
    setFormDetails,
    formSpecifications,
    setFormSpecifications,
    formFeatures,
    setFormFeatures,
    formTags,
    setFormTags,
    formIcon,
    setFormIcon,
    formImage,
    setFormImage,
    formIsActive,
    setFormIsActive,
    formShowOnHome,
    setFormShowOnHome,
    fileInputRef,
    filteredProducts,
    categories,
    pageSize,
    currentPage,
    paginatedProducts,
    draftProduct,
  };
}

export type ProductManagementEditorContext = ReturnType<typeof useProductManagementEditorState>;
