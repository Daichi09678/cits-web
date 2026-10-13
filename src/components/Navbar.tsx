"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/services", label: "Layanan" },
  { href: "/products", label: "Produk" },
  { href: "/portfolio", label: "Portofolio" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/contact", label: "Kontak" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-300 bg-white/95 dark:bg-[#1A1A2E]/95 backdrop-blur-md border-b border-transparent ${
        scrolled ? "shadow-md dark:border-white/10" : ""
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.webp"
            alt="CITS Indonesia"
            width={160}
            height={48}
            className="h-10 w-auto brightness-100 dark:brightness-110"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
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
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-[#1A1A2E]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 overflow-hidden"
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
                    className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 font-semibold"
                        : "text-gray-700 dark:text-white hover:text-orange-700 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-950/20"
                    }`}
                    onClick={() => setMobileOpen(false)}
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
