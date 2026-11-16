import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type FeedbackTone = "error" | "success" | "info";
interface FormFeedbackProps extends HTMLAttributes<HTMLDivElement> {
  tone?: FeedbackTone;
}

const TONES: Record<FeedbackTone, string> = {
  error: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-200",
  info: "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200",
};

export default function FormFeedback({ tone = "error", className, children, ...rest }: FormFeedbackProps) {
  return (
    <div
      {...rest}
      role={tone === "error" ? "alert" : "status"}
      aria-atomic="true"
      className={cn("rounded-xl border px-4 py-3 text-sm leading-relaxed", TONES[tone], className)}
    >
      {children}
    </div>
  );
}
