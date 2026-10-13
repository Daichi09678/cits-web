import { ReactNode } from "react";

export default function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`backdrop-blur-md bg-white/70 border border-white/20 shadow-xl rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
