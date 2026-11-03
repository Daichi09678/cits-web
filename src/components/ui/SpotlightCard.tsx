"use client";

import { useRef, MouseEvent, ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(242, 101, 34, 0.15)",
  borderColor = "rgba(242, 101, 34, 0.45)",
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
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl overflow-hidden p-[1px] transition-transform duration-200 hover:-translate-y-1 group will-change-transform ${className}`}
      style={{
        background: `radial-gradient(400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), ${borderColor}, transparent 65%)`,
      }}
    >
      {/* Background radial spotlight on inner surface */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 rounded-2xl"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* Main card body with backdrop & border fallback */}
      <div className="relative z-0 h-full w-full rounded-2xl bg-white dark:bg-[#16162c] border border-gray-100 dark:border-white/10 group-hover:border-transparent transition-colors overflow-hidden">
        {children}
      </div>
    </div>
  );
}
