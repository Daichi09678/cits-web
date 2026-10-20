"use client";

import { useState, useRef } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  X,
  MessageSquare,
  Smartphone,
  FileText,
  Vote,
  Globe,
  Archive,
  Layers,
  Image as ImageIcon,
  Upload,
  Camera,
} from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useCitsStore } from "@/stores/citsStore";
import { ProductItem } from "@/types/schema";

export default function AdminProductsPage() {
  const { products, actions } = useCitsStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<ProductItem["category"]>("Enterprise");
  const [formDescription, setFormDescription] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formIcon, setFormIcon] = useState("Package");
  const [formImage, setFormImage] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Ukuran foto maksimal 3 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormImage(event.target.result as string);
      }
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
    setEditingProduct(null);
    setFormName("");
    setFormCategory("Enterprise");
    setFormDescription("");
    setFormFeatures("Integrasi API, Laporan Real-Time, Multi-User");
    setFormTags("Enterprise, Cloud, Secure");
    setFormIcon("Package");
    setFormImage("");
    setFormIsActive(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormDescription(prod.description);
    setFormFeatures(prod.features.join(", "));
    setFormTags(prod.tags.join(", "));
    setFormIcon(prod.icon || "Package");
    setFormImage(prod.image || "");
    setFormIsActive(prod.isActive);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  };

  // Handle Form Submit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresArr = formFeatures
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tagsArr = formTags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProduct) {
      actions.updateProduct(editingProduct.id, {
        name: formName,
        category: formCategory,
        description: formDescription,
        features: featuresArr,
        tags: tagsArr,
        icon: formIcon,
        image: formImage.trim() || undefined,
        isActive: formIsActive,
      });
    } else {
      actions.addProduct({
        name: formName,
        category: formCategory,
        description: formDescription,
        features: featuresArr,
        tags: tagsArr,
        icon: formIcon,
        image: formImage.trim() || undefined,
        isActive: formIsActive,
      });
    }

    setModalOpen(false);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const categories = ["All", "Enterprise", "Government", "Mobile", "Web", "Communication"];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Produk Kami"
        description="Atur produk katalog CITS, tambah inovasi baru, atau switch aktif/non-aktif untuk Front Office"
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Controls & Action Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative min-w-[240px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau deskripsi produk..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    categoryFilter === cat
                      ? "bg-orange-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Add Product Button */}
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
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
                  filteredProducts.map((prod) => (
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
                        <button
                          onClick={() => actions.toggleProductStatus(prod.id)}
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
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(prod)}
                            title="Edit Produk"
                            className="p-2 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus produk "${prod.name}"?`)) {
                                actions.deleteProduct(prod.id);
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
        </div>

        {/* Add / Edit Product Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-[#16162D] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {editingProduct ? "Edit Informasi Produk" : "Tambah Produk Baru"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Data yang disimpan akan langsung tampil di halaman Front Office CITS
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Kategori
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="Enterprise" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Enterprise
                      </option>
                      <option value="Government" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Government
                      </option>
                      <option value="Mobile" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Mobile
                      </option>
                      <option value="Web" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Web
                      </option>
                      <option
                        value="Communication"
                        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        Communication
                      </option>
                      <option value="General" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        General
                      </option>
                    </select>
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
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
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
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="cth: /services/software-house.webp atau https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#121224] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Fitur-Fitur Utama (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    placeholder="Contoh: Laporan Real-Time, REST API, Multi-User, Enkripsi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Tag Kata Kunci (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Contoh: SPBE, GovTech, Kemenhub, ISO 27001"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Status Aktif / Non-Aktif Checkbox */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                  <div>
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
                    className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25"
                  >
                    {editingProduct ? "Simpan Perubahan" : "Tambahkan ke Katalog"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
