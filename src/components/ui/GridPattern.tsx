import { useId } from "react";

export default function GridPattern({ className = "" }: { className?: string }) {
  // ID unik per instance: komponen ini dipakai di banyak section sekaligus,
  // sehingga id statis "grid" menghasilkan duplikat id di DOM.
  const patternId = `grid-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F26522" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
