"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const activeDark = stored === "dark" || (!stored && prefersDark);

    if (activeDark) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return <div className={`w-9 h-9 rounded-xl border border-gray-200 bg-gray-50 ${className}`} />;
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      aria-label={isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
      title={isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
      className={`relative w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400 hover:border-orange-500/40 dark:hover:border-orange-400/40 flex items-center justify-center transition-colors shadow-sm ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0" />
      ) : (
        <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform" />
      )}
    </motion.button>
  );
}
