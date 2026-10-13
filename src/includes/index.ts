/**
 * Shared Includes & Helpers
 * Menyediakan fungsi, komponen layout bersama, autentikasi, dan konfigurasi sistem.
 */

// Autentikasi Admin
export * from "@/lib/auth";

// Konfigurasi Sistem
export * from "@/config/siteConfig";

// Store & State Manajemen Terpusat
export * from "@/database/store";
export * from "@/database/schema";

// Komponen Bersama Back Office
export { default as AdminSidebar } from "@/components/admin/AdminSidebar";
export { default as AdminTopbar } from "@/components/admin/AdminTopbar";
export { default as MetricCard } from "@/components/admin/MetricCard";

// Komponen Bersama Front Office
export { default as Navbar } from "@/components/Navbar";
export { default as Footer } from "@/components/Footer";
