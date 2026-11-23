"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

const directionOffset = {
  up: { y: 12, x: 0 },
  down: { y: -12, x: 0 },
  left: { x: 12, y: 0 },
  right: { x: -12, y: 0 },
};

export default function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) {
  const offset = directionOffset[direction];

  return (
    <motion.div
      initial={offset}
      whileInView={{ x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.28,
        delay: Math.min(delay, 0.15),
        ease: "easeOut",
      }}
      className={`motion-reduce:transform-none! ${className}`}
    >
      {children}
    </motion.div>
  );
}
