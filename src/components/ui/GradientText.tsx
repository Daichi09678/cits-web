import { ReactNode } from "react";

export default function GradientText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`text-orange-700 dark:text-orange-400 bg-gradient-to-r from-orange-600 to-brand dark:from-brand dark:to-orange-400 bg-clip-text [-webkit-text-fill-color:transparent] ${className}`}
    >
      {children}
    </span>
  );
}
