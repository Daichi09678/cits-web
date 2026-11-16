"use client";
import Input from "@/components/ui/Input";

import { Package, Plus, Search, Edit, Trash2, X } from "lucide-react";
import AdminTopbar from "@/components/pages/admin/AdminTopbar";
import CatalogDeleteDetails from "@/components/admin/CatalogDeleteDetails";
import Pagination from "@/components/admin/Pagination";
import ProductCategoryEditor from "@/components/pages/admin-products/ProductCategoryEditor";
import { defaultCategories } from "./constants";
import type { ProductManagementEditorState } from "./useProductManagementEditor";
import ProductManagementDialog from "./ProductManagementDialog";
import ProductManagementPreview from "./ProductManagementPreview";

export default function ProductManagementEditor({ editor }: { editor: ProductManagementEditorState }) {
  const {
    productFilters,
    setProductFilters,
    setPage,
    categories,
    canEdit,
    categorySaving,
    deleteCategory,
    categoryEditorOpen,
    setCategoryEditorOpen,
    canCreate,
    openAddModal,
    products,
    actions,
    setCategorySaving,
    filteredProducts,
    paginatedProducts,
    openEditModal,
    canDelete,
    dialog,
    currentPage,
    pageSize,
  } = editor;
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
                <Input
                  type="text"
                  aria-label="Cari produk"
                  value={productFilters.query}
                  onChange={(event) => {
                    setProductFilters({ ...productFilters, query: event.target.value });
                    setPage(1);
                  }}
                  placeholder="Cari nama atau deskripsi produk..."
                  fieldSize="sm"
                  className="w-full"
                  withIcon
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
                                description: "Periksa produk berikut sebelum menghapusnya dari katalog.",
                                details: (
                                  <CatalogDeleteDetails
                                    kind="produk"
                                    name={prod.name}
                                    category={prod.category}
                                    isActive={prod.isActive}
                                    showOnHome={prod.showOnHome !== false}
                                    featureCount={prod.features.length}
                                  />
                                ),
                                confirmLabel: "Hapus produk",
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
        <ProductManagementDialog editor={editor} />
        <ProductManagementPreview editor={editor} />
      </div>
    </div>
  );
}
