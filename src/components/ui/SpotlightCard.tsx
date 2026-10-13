"use client";

import { useRef, useState, MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`relative rounded-2xl overflow-hidden p-[1px] transition-all group ${className}`}
      style={{
        background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${borderColor}, transparent 65%)`,
      }}
    >
      {/* Background radial spotlight on inner surface */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 rounded-2xl"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* Main card body with backdrop & border fallback */}
      <div className="relative z-0 h-full w-full rounded-2xl bg-white dark:bg-[#16162c] border border-gray-100 dark:border-white/10 group-hover:border-transparent transition-colors overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}
