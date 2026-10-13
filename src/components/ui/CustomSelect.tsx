"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomSelectProps {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function CustomSelect({ options, placeholder = "Pilih opsi", value, onChange }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value || "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt: string) => {
    setSelected(opt);
    onChange?.(opt);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#1A1A2E] text-left outline-none transition-all relative ${
          open ? "border-orange-600 ring-2 ring-orange-600/20" : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
        }`}
      >
        <span className={selected ? "text-gray-900 dark:text-white font-medium" : "text-gray-700 dark:text-white/70"}>
          {selected || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-700 dark:text-white/70 transition-transform absolute right-4 top-1/2 -translate-y-1/2 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1A1A2E] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden"
          >
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  selected === opt
                    ? "bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-semibold"
                    : "text-gray-700 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
