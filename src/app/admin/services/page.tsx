"use client";

import { useState } from "react";
import { Cpu, Code2, Server, ShieldCheck, CheckCircle2, Save } from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminServicesPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const pillars = [
    { id: "1", title: "Software House", badge: "Pilar 01", icon: Code2, desc: "Pengembangan Perangkat Lunak Kustom & Enterprise Web/Mobile", sla: "Target Ketersediaan 99.9%" },
    { id: "2", title: "IT Consultant", badge: "Pilar 02", icon: Cpu, desc: "Konsultasi Tata Kelola TI, Enterprise Architecture, & Penyelarasan SPBE", sla: "Metodologi TOGAF & LKPP" },
    { id: "3", title: "IT Supplier", badge: "Pilar 03", icon: Server, desc: "Pengadaan Perangkat Keras Enterprise, Server Data Center, & Jaringan", sla: "Faktur Resmi & SIKaP LKPP" },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <AdminTopbar
        title="Manajemen Layanan CITS"
        description="Kelola 3 pilar layanan utama, target SLA, dan ruang lingkup rekayasa teknologi"
      />

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Pengaturan layanan berhasil disimpan!</span>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-5">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-sm shadow-orange-600/20">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300">
                  {p.badge}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {p.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{p.sla}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
