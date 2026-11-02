import type { ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#16162c] ${className}`}
    >
      {children}
    </div>
  );
}
