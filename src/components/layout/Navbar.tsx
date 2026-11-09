"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { CompanyLogo } from "@/components/layout/CompanyBrand";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/portfolio", label: "Portofolio" },
  { href: "/services", label: "Layanan" },
  { href: "/products", label: "Produk" },
  { href: "/contact", label: "Hubungi Kami" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: scrolled ? 12 : 0 }}
      transition={{ duration: 0.35 }}
      className={`sticky top-0 z-50 w-full mx-auto shrink-0 overflow-hidden transition-[max-width,border-radius,box-shadow,border-color] duration-300 ease-out motion-reduce:transition-none bg-white/95 dark:bg-[#1A1A2E]/95 backdrop-blur-md border ${
        scrolled
          ? "max-w-[calc(100%_-_1.5rem)] sm:max-w-[calc(100%_-_3rem)] xl:max-w-6xl rounded-2xl border-gray-200/80 dark:border-white/15 shadow-lg shadow-black/10"
          : "max-w-full rounded-none border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
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
                className={`group relative text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-orange-700 dark:text-orange-400 font-semibold"
                    : "text-gray-700 dark:text-white hover:text-orange-700 dark:hover:text-orange-400"
                }`}
              >
                {link.label}
                {isActive(link.href) ? (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand group-hover:w-full transition-all duration-300" />
                )}
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
          <button
            className="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 dark:bg-[#1A1A2E]/95 backdrop-blur-md border-t border-gray-100 dark:border-white/10 overflow-y-auto max-h-[calc(100dvh-6rem)]"
          >
            <ul className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 font-semibold"
                        : "text-gray-700 dark:text-white hover:text-orange-700 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-950/20"
                    }`}
                    onClick={() => {
                      setMobileOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
