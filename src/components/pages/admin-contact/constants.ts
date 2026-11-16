import { CheckCircle2, CheckCheck, Sparkles, Calendar, FileText, AlertTriangle, type LucideIcon } from "lucide-react";
import { DealStage } from "@/types/schema";

export const DEAL_STAGES: {
  key: DealStage;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotBg: string;
  icon: LucideIcon;
  desc: string;
}[] = [
  {
    key: "baru",
    label: "Baru Masuk",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-200 dark:border-blue-800/60",
    dotBg: "bg-blue-500",
    icon: Sparkles,
    desc: "Pesan baru masuk dari website",
  },
  {
    key: "diskusi",
    label: "Diskusi",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeText: "text-amber-800 dark:text-amber-300",
    badgeBorder: "border-amber-200 dark:border-amber-800/60",
    dotBg: "bg-amber-500",
    icon: Calendar,
    desc: "Konsultasi teknis dan pertemuan awal",
  },
  {
    key: "proses",
    label: "Penawaran",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    badgeBorder: "border-indigo-200 dark:border-indigo-800/60",
    dotBg: "bg-indigo-500",
    icon: FileText,
    desc: "Penyusunan KAK, proposal dan estimasi RAB",
  },
  {
    key: "kesepakatan",
    label: "Kesepakatan",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeText: "text-emerald-800 dark:text-emerald-300",
    badgeBorder: "border-emerald-200 dark:border-emerald-800/60",
    dotBg: "bg-emerald-500",
    icon: CheckCircle2,
    desc: "Lingkup dan anggaran telah disetujui",
  },
  {
    key: "selesai",
    label: "Selesai",
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/40",
    badgeText: "text-cyan-800 dark:text-cyan-300",
    badgeBorder: "border-cyan-200 dark:border-cyan-800/60",
    dotBg: "bg-cyan-600",
    icon: CheckCheck,
    desc: "Proyek resmi berjalan",
  },
  {
    key: "batal",
    label: "Dibatalkan",
    badgeBg: "bg-slate-100 dark:bg-slate-800/50",
    badgeText: "text-slate-600 dark:text-slate-400",
    badgeBorder: "border-slate-200 dark:border-white/10",
    dotBg: "bg-slate-400",
    icon: AlertTriangle,
    desc: "Tidak berlanjut atau ditunda",
  },
];
