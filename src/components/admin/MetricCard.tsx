import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  iconColor = "bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400",
}: MetricCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>

        {change && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
              isPositive
                ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "text-rose-700 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400"
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </span>
        )}
      </div>

      {subtitle && (
        <span className="block text-[11px] text-slate-600 dark:text-slate-400 mt-2">
          {subtitle}
        </span>
      )}
    </div>
  );
}
