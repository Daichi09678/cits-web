"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import Button from "@/components/ui/Button";
import accentStyles from "./PublicAccent.module.css";

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
    return <span aria-hidden="true" className={`inline-block size-11 shrink-0 ${className}`} />;
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
      title={isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
      className={className}
    >
      {isDark ? (
        <Sun aria-hidden="true" className={`size-4 ${accentStyles.accent}`} />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}
    </Button>
  );
}
