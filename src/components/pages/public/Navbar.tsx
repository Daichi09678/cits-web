"use client";
import Button from "@/components/ui/Button";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/pages/public/ThemeToggle";
import { CompanyLogo } from "@/components/pages/public/CompanyBrand";
import accentStyles from "@/components/pages/public/PublicAccent.module.css";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/portfolio", label: "Portofolio" },
  { href: "/services", label: "Layanan" },
  { href: "/products", label: "Produk" },
  { href: "/contact", label: "Hubungi Kami" },
];

const FLOAT_AT = 28;
const RESET_AT = 12;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let floating = false;
    const handleScroll = () => {
      const next = window.scrollY > (floating ? RESET_AT : FLOAT_AT);
      if (next === floating) return;
      floating = next;
      setScrolled(next);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !mobileOpen) return;
        event.preventDefault();
        setMobileOpen(false);
        menuTrigger.current?.focus();
      }}
      className={`sticky top-0 z-50 mx-auto shrink-0 overflow-hidden border bg-white/95 backdrop-blur-md dark:bg-[#1A1A2E]/95 motion-safe:transition-[width,translate,border-radius,box-shadow,border-color] motion-safe:duration-300 motion-safe:ease-out ${
        scrolled
          ? "w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] xl:w-6xl motion-safe:translate-y-3 rounded-2xl border-gray-200/80 dark:border-white/15 shadow-lg shadow-black/10"
          : "w-full rounded-none border-transparent"
      }`}
    >
      <nav aria-label="Navigasi utama" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Beranda CITS Indonesia">
          <CompanyLogo location="navbar" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-4 xl:gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative inline-flex min-h-10 items-center text-sm font-medium text-gray-700 transition-colors aria-[current=page]:font-semibold dark:text-white ${accentStyles.navLink}`}
              >
                {link.label}
                <span aria-hidden="true" className={accentStyles.navUnderline} />
              </Link>
            </li>
          ))}

          {/* Theme Toggle */}
          <li className="flex items-center pl-2">
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon"
            ref={menuTrigger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={reducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.16 }}
            className="lg:hidden bg-white/95 dark:bg-[#1A1A2E]/95 backdrop-blur-md border-t border-gray-100 dark:border-white/10 overflow-y-auto max-h-[calc(100dvh-6rem)]"
          >
            <ul className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors dark:text-white ${accentStyles.navLink} ${
                      isActive(link.href) ? "bg-orange-50 font-semibold dark:bg-orange-950/40" : "hover:bg-orange-50/50 dark:hover:bg-orange-950/20"
                    }`}
                    onClick={() => {
                      setMobileOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
