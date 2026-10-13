"use client";

import { useState } from "react";
import Image from "next/image";
import { Handshake, Plus, CheckCircle2, Trash2 } from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useCitsStore } from "@/database/store";

export default function AdminClientsPage() {
  const { clients, actions } = useCitsStore();

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Mitra Institusi & Klien"
        description="Kelola daftar logo kementerian, lembaga negara, dan BUMN yang tampil di beranda dan portofolio"
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-2 flex items-center justify-center shrink-0">
                <Image
                  src={c.logo}
                  alt={c.name}
                  width={40}
                  height={40}
                  className="max-h-full w-auto object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-xs text-slate-900 dark:text-white truncate">
                  {c.name}
                </span>
                <span className="block text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
                  {c.category}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/20 shrink-0">
              Tampil
            </span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
