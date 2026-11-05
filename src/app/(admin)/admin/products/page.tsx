"use client";

import { useState, useRef } from "react";
import { Package, Plus, Search, Edit, Trash2, CheckCircle2, X, Image as ImageIcon, Upload } from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useAdminDialog } from "@/components/admin/AdminDialogProvider";
import { useCitsStore } from "@/stores/citsStore";
import { ProductItem } from "@/types/schema";
import Pagination from "@/components/admin/Pagination";
import ChipField from "@/components/admin/ChipField";
import ProductSpecificationFields from "@/components/pages/admin-products/ProductSpecificationFields";
import ProductDetailsDialog from "@/components/ui/ProductDetailsDialog";
import ProductCategoryEditor from "@/components/pages/admin-products/ProductCategoryEditor";
import { emptyProductFilters, filterProducts } from "@/lib/catalogSearch";

// Pilihan cepat fitur/kapabilitas — dicentang saja, tidak perlu ditulis manual.
const FEATURE_PRESETS = [
  "Laporan Real-Time",
  "Dashboard Analitik",
  "REST API",
  "Multi-User",
  "Role & Hak Akses",
  "Audit Log",
  "Enkripsi Data",
  "Single Sign-On (SSO)",
  "Notifikasi Email",
  "Tanda Tangan Digital",
  "Impor / Ekspor Excel",
  "Mobile Friendly",
  "Backup Otomatis",
];

const TAG_PRESETS = [
  "SPBE",
  "GovTech",
  "ISO 27001",
  "SaaS",
  "On-Premise",
  "Cloud",
  "Open Source",
  "Custom Development",
];

// State form menyimpan string berkoma (kompatibel dengan kode lama + API).
const csvToList = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
const listToCsv = (list: string[]): string => list.join(", ");
const defaultCategories = ["Enterprise", "Government", "Mobile", "Web", "Communication"];

export default function AdminProductsPage() {
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

  // Form State
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

  // Handle local file upload
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

  // Open Add Modal
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

  // Open Edit Modal
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

  // Handle Form Submit
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

  // Filtered Products
  const filteredProducts = filterProducts(products, productFilters);
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

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Produk Kami"
        description="Atur produk katalog CITS, tambah inovasi baru, atau switch aktif/non-aktif untuk Front Office"
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Controls & Action Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search & Filter */}
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:min-w-[240px] flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  aria-label="Cari produk"
                  value={productFilters.query}
                  onChange={(event) => {
                    setProductFilters({ ...productFilters, query: event.target.value });
                    setPage(1);
                  }}
                  placeholder="Cari nama atau deskripsi produk..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                {[null, ...categories].map((category) => (
                  <div
                    key={category === null ? "all" : `category:${category}`}
                    className="inline-flex shrink-0 items-center gap-0.5"
                  >
                    <button
                      aria-pressed={productFilters.category === (category ?? "")}
                      onClick={() => {
                        setProductFilters({ ...productFilters, category: category ?? "" });
                        setPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${productFilters.category === (category ?? "") ? "bg-orange-600 text-white shadow-xs" : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}
                    >
                      {category === null ? "All" : category}
                    </button>
                    {canEdit && category !== null && ![...defaultCategories, "General"].includes(category) && (
                      <button
                        type="button"
                        disabled={categorySaving}
                        aria-label={`Hapus kategori ${category}`}
                        title={`Hapus kategori ${category}`}
                        onClick={() => deleteCategory(category)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-red-500/10"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                ))}
                {canEdit && (
                  <button
                    type="button"
                    disabled={categorySaving}
                    aria-expanded={categoryEditorOpen}
                    aria-controls="product-category-editor"
                    onClick={() => setCategoryEditorOpen((open) => !open)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-orange-300 hover:text-orange-600 dark:border-white/10 dark:text-slate-300"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah kategori
                  </button>
                )}
              </div>
            </div>

            {/* Add Product Button */}
            <button
              disabled={!canCreate || categorySaving}
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>
          {categoryEditorOpen && canEdit && (
            <ProductCategoryEditor
              products={products}
              onSave={(id, category) => actions.updateProduct(id, { category })}
              onBusyChange={setCategorySaving}
              onClose={() => setCategoryEditorOpen(false)}
              onSaved={(category) => {
                setProductFilters({ ...productFilters, category });
                setPage(1);
              }}
            />
          )}
        </div>

        {/* Table Data Container */}
        <div className="rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-5">Nama Produk & Deskripsi</th>
                  <th className="py-4 px-4">Kategori</th>
                  <th className="py-4 px-4">Fitur Utama</th>
                  <th className="py-4 px-4 text-center">Status di Web</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      Tidak ada produk yang cocok dengan pencarian Anda.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors">
                      {/* Product Name & Description */}
                      <td className="py-4 px-5 max-w-sm">
                        <div className="flex items-center gap-3">
                          {prod.image ? (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 shadow-2xs">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-orange-700 dark:text-orange-400 shrink-0 shadow-2xs">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 dark:text-white text-sm mb-0.5 truncate">
                              {prod.name}
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {prod.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 shrink-0">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200/80 dark:border-orange-500/30 font-bold text-[11px]">
                          {prod.category}
                        </span>
                      </td>

                      {/* Features Tags */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {prod.features.slice(0, 3).map((feat, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                            >
                              {feat}
                            </span>
                          ))}
                          {prod.features.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-semibold">
                              +{prod.features.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                            prod.isActive
                              ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30"
                              : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/15 opacity-70"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${prod.isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                          ></span>
                          <span>{prod.isActive ? "Aktif" : "Non-Aktif"}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={!canEdit || categorySaving}
                            onClick={() => openEditModal(prod)}
                            title="Edit Produk"
                            className="p-2 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            disabled={!canDelete || categorySaving}
                            onClick={async () => {
                              const confirmed = await dialog.confirm({
                                title: "Hapus produk?",
                                description: `Produk "${prod.name}" akan dihapus permanen dari katalog dan tampilan front office.`,
                                confirmLabel: "Hapus Produk",
                                variant: "danger",
                              });
                              if (confirmed) {
                                const removed = await actions
                                  .deleteProduct(prod.id)
                                  .then(() => true)
                                  .catch((error) => {
                                    void dialog.alert({
                                      title: "Gagal menghapus",
                                      description: error instanceof Error ? error.message : "Data gagal dihapus.",
                                      variant: "danger",
                                    });
                                    return false;
                                  });
                                if (!removed) return;
                                await dialog.alert({
                                  title: "Produk dihapus",
                                  description: `"${prod.name}" berhasil dihapus dari katalog.`,
                                  variant: "success",
                                });
                              }
                            }}
                            title="Hapus Produk"
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={currentPage} pageSize={pageSize} total={filteredProducts.length} onPageChange={setPage} />
        </div>

        {/* Add / Edit Product Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-start justify-between gap-4 shrink-0">
                <div className="min-w-0 space-y-1.5">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {editingProduct ? "Edit Informasi Produk" : "Tambah Produk Baru"}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Data yang disimpan akan langsung tampil di halaman Front Office CITS
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!saving && !readingImage) setModalOpen(false);
                  }}
                  className="shrink-0 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="min-h-0 p-6 space-y-4 overflow-y-auto">
                {mutationError && (
                  <p role="alert" className="text-xs text-red-600">
                    {mutationError}
                  </p>
                )}
                <fieldset disabled={saving || readingImage} className="min-w-0 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
                    <div className="min-w-0">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Nama Produk
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Contoh: Portal Satu Data"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Kategori
                      </label>
                      <input
                        value={formCategory}
                        required
                        maxLength={100}
                        list="product-category-options"
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                      />
                      <datalist id="product-category-options">
                        {[...new Set([...categories, "General"])].map((category) => (
                          <option key={category} value={category} />
                        ))}
                      </datalist>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                        Pilih kategori atau tulis kategori baru. Kategori tersimpan akan tersedia sebagai filter.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Deskripsi Lengkap
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Jelaskan fungsi, keunggulan, dan manfaat produk untuk instansi..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    ></textarea>
                  </div>

                  {/* Foto / Gambar Produk */}
                  <ProductSpecificationFields
                    details={formDetails}
                    specifications={formSpecifications}
                    onDetails={setFormDetails}
                    onSpecifications={setFormSpecifications}
                  />
                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <ImageIcon className="w-4 h-4 shrink-0 text-orange-600 dark:text-orange-400" />
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                          Foto / Gambar Produk
                        </label>
                      </div>
                      {formImage && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus Foto
                        </button>
                      )}
                    </div>

                    {/* Preview jika sudah ada foto */}
                    {formImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121224] p-3 flex items-center gap-3.5 shadow-2xs">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 shrink-0">
                          <img src={formImage} alt="Preview Foto Produk" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Foto Produk Berhasil Dipilih</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                            {formImage.startsWith("data:") ? "Foto diunggah dari perangkat lokal (Base64)" : formImage}
                          </p>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-[11px] font-bold text-slate-700 dark:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Upload className="w-3 h-3" />
                            Ganti Foto
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Dropzone unggah file */
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-5 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-orange-500/60 dark:hover:border-orange-500/60 bg-white dark:bg-[#151528] transition-all text-center cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Klik untuk Pilih / Unggah Foto Produk
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Mendukung format PNG, JPG, atau WebP (Maksimal 3 MB)
                        </p>
                      </div>
                    )}

                    {/* Input File Tersembunyi */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />

                    {/* Opsi alternatif: Input URL / Path */}
                    <div className="pt-1">
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        Atau masukkan Path / URL Gambar:
                      </span>
                      <input
                        type="text"
                        value={formImage.startsWith("data:") ? "" : formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="cth: /services/software-house.webp atau https://..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#121224] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <ChipField
                      label="Fitur & Kapabilitas Produk"
                      hint="Centang kapabilitas yang tersedia, atau tulis sendiri lalu tekan Enter."
                      value={csvToList(formFeatures)}
                      onChange={(list) => setFormFeatures(listToCsv(list))}
                      presets={FEATURE_PRESETS}
                      placeholder="cth: Laporan Real-Time, REST API"
                    />
                  </div>

                  <div>
                    <ChipField
                      label="Tag / Kata Kunci"
                      hint="Dipakai untuk pencarian dan pengelompokan produk."
                      value={csvToList(formTags)}
                      onChange={(list) => setFormTags(listToCsv(list))}
                      presets={TAG_PRESETS}
                      placeholder="cth: SPBE, GovTech, ISO 27001"
                      accent="emerald"
                    />
                  </div>

                  {/* Status Aktif / Non-Aktif Checkbox */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1.5 leading-relaxed">
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">
                        Tampilkan di Website Front Office
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        Jika tidak dicentang, produk akan berstatus Non-Aktif (disembunyikan)
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="mt-0.5 w-5 h-5 shrink-0 accent-orange-600 rounded cursor-pointer"
                    />
                  </div>

                  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-orange-200/80 bg-orange-50/50 p-3.5 dark:border-orange-500/20 dark:bg-orange-500/10">
                    <span className="min-w-0 space-y-1.5 leading-relaxed">
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">
                        Tampilkan di Beranda Utama
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-300">
                        Centang agar produk muncul pada section produk unggulan di halaman utama.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={formShowOnHome}
                      onChange={(e) => setFormShowOnHome(e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-orange-600"
                    />
                  </label>

                  {/* Modal Buttons */}
                  <div className="pt-5 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setPreviewProduct(draftProduct)}
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/15 dark:text-slate-200"
                    >
                      Pratinjau Detail
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!saving && !readingImage) setModalOpen(false);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25"
                    >
                      {saving
                        ? "Menyimpan..."
                        : readingImage
                          ? "Membaca foto..."
                          : editingProduct
                            ? "Simpan Perubahan"
                            : "Tambahkan ke Katalog"}
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        )}
        {previewProduct && (
          <ProductDetailsDialog product={previewProduct} preview onClose={() => setPreviewProduct(null)} />
        )}
      </div>
    </div>
  );
}
