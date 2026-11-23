"use client";

import { useRef, MouseEvent, ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
  disableSpotlight?: boolean;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(242, 101, 34, 0.15)",
  borderColor = "rgba(242, 101, 34, 0.45)",
  disableSpotlight = false,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseEnter = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={disableSpotlight ? undefined : handleMouseMove}
      onMouseEnter={disableSpotlight ? undefined : handleMouseEnter}
      onMouseLeave={disableSpotlight ? undefined : handleMouseLeave}
      className={`relative rounded-2xl overflow-hidden p-[1px] ${disableSpotlight ? "" : "transition-transform duration-200 hover:-translate-y-1 will-change-transform"} group ${className}`}
      style={
        disableSpotlight
          ? undefined
          : {
              background: `radial-gradient(400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), ${borderColor}, transparent 65%)`,
            }
      }
    >
      {/* Background radial spotlight on inner surface */}
      {!disableSpotlight && (
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(350px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), ${spotlightColor}, transparent 80%)`,
          }}
        />
      )}

      {/* Main card body with backdrop & border fallback */}
      <div
        className={`relative z-0 h-full w-full rounded-2xl bg-white dark:bg-[#16162c] border border-gray-100 dark:border-white/10 overflow-hidden ${
          disableSpotlight ? "" : "group-hover:border-transparent transition-colors"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
