"use client";

import { motion } from "framer-motion";

export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Hexagon */}
      <motion.div
        className="absolute top-20 right-[10%] w-24 h-24 border border-brand/20 rotate-45"
        animate={{ rotate: [45, 90, 45], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
      />

      {/* Circuit nodes */}
      <motion.div
        className="absolute top-[40%] left-[5%] w-3 h-3 rounded-full bg-brand/30"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-[60%] right-[8%] w-2 h-2 rounded-full bg-brand/20"
        animate={{ scale: [1, 2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />

      {/* Floating squares */}
      <motion.div
        className="absolute bottom-[20%] left-[15%] w-16 h-16 border border-brand/10 rounded-lg"
        animate={{ rotate: [0, 180, 360], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />



      {/* Dashed circle */}
      <motion.div
        className="absolute bottom-[30%] right-[25%] w-20 h-20 rounded-full border border-dashed border-brand/15"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
