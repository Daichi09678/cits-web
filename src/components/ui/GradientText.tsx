import { ReactNode } from "react";
import accentStyles from "@/components/pages/public/PublicAccent.module.css";

export default function GradientText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`${accentStyles.gradientText} ${className}`}>
      {children}
    </span>
  );
}
