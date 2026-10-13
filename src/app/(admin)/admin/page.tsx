"use client";

import Link from "next/link";
import {
  Package,
  Mail,
  Building2,
  ShieldCheck,
  Plus,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import MetricCard from "@/components/admin/MetricCard";
import { useCitsStore } from "@/database/store";

export default function AdminDashboardPage() {
  const { products, messages, clients, actions } = useCitsStore();

  const activeProducts = products.filter((p) => p.isActive);
  const unreadMessages = messages.filter((m) => m.status === "unread");

  return (
    <div className="space-y-6">
      <AdminTopbar
        title="Ringkasan Back Office"
        description="Pantau dan kelola seluruh konten website Front Office CITS secara real-time"
      />

      {/* Shopeers-style Top KPI Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <MetricCard
          title="Produk Aktif"
          value={activeProducts.length}
          change={`+${products.length - activeProducts.length} draft`}
          subtitle={`Dari total ${products.length} produk katalog`}
          icon={Package}
          iconColor="bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <MetricCard
          title="Pesan Masuk Pengunjung"
          value={messages.length}
          change={unreadMessages.length > 0 ? `${unreadMessages.length} Baru` : "Terbaca"}
          isPositive={unreadMessages.length > 0}
          subtitle="Form Kirim Pesan Front Office"
          icon={Mail}
          iconColor="bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <MetricCard
          title="Mitra Institusi Resmi"
          value={clients.length}
          change="Aktif"
          subtitle="Logo kementerian & BUMN"
          icon={Building2}
          iconColor="bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        />

        <MetricCard
          title="Status Kesiapan Sistem"
          value="99.9%"
          change="Stabil"
          subtitle="High Availability SLA CITS"
          icon={ShieldCheck}
          iconColor="bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
        />
      </div>

      {/* Hero Quick Action Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white shadow-xl shadow-orange-600/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kontrol Dinamis Front Office</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Semua Konten Front Office Kini Dapat Diatur dari Sini
          </h2>
          <p className="text-xs text-orange-100 leading-relaxed">
            Non-aktifkan produk, tambah item baru, atau perbarui kontak kantor langsung dari Back Office tanpa perlu mengubah kodingan manual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Kelola Produk</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs transition-all border border-white/20"
          >
            <span>Cek Tampilan Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Two Column Grid: Recent Messages & Quick Product Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quick Product Management (Span 7) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Status Produk di Front Office
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Klik tombol toggle untuk mengaktifkan atau menyembunyikan produk di halaman depan
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {products.slice(0, 5).map((prod) => (
              <div
                key={prod.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-white/5 px-2 rounded-xl transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {prod.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      {prod.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                    {prod.description}
                  </p>
                </div>

                {/* Status Switch Toggle Button */}
                <button
                  onClick={() => actions.toggleProductStatus(prod.id)}
                  title={`Ubah status ${prod.name}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 border ${
                    prod.isActive
                      ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100"
                      : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      prod.isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  ></span>
                  <span>{prod.isActive ? "Aktif di Web" : "Non-Aktif"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Messages Inbox (Span 5) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pesan Masuk Terkini
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Pesan dari form kontak publik
              </p>
            </div>
            <Link
              href="/admin/contact"
              className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
            >
              <span>Buka Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Belum ada pesan masuk.
              </p>
            ) : (
              messages.slice(0, 4).map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {msg.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        msg.status === "unread"
                          ? "bg-orange-500 text-white"
                          : msg.status === "replied"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                      }`}
                    >
                      {msg.status === "unread" ? "Baru" : msg.status === "replied" ? "Dibalas" : "Dibaca"}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                    {msg.company} • Layanan: {msg.serviceRequested}
                  </span>

                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
