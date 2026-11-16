import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  fieldSize?: "sm" | "md";
}

export default function FieldLabel({ required, fieldSize = "md", children, className, ...rest }: FieldLabelProps) {
  return (
    <label
      {...rest}
      className={cn(
        "mb-1.5 block font-semibold leading-relaxed text-slate-800 dark:text-slate-200",
        fieldSize === "sm" ? "text-xs" : "text-sm",
        className
      )}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-1 text-rose-700 dark:text-rose-300">
          *
        </span>
      )}
    </label>
  );
}
