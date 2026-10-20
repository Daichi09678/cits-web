"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlowCard({ children, className = "" }: GlowCardProps) {
  return (
    <motion.div className={`relative group h-full ${className}`} whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand to-orange-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
      {/* Card content */}
      <div className="relative h-full bg-white dark:bg-[#16162c] rounded-2xl border border-gray-200 dark:border-white/10 group-hover:border-brand/30 dark:group-hover:border-orange-500/40 transition-colors">
        {children}
      </div>
    </motion.div>
  );
}
