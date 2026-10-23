"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useCitsStore } from "@/stores/citsStore";
import { initialContactInfo } from "@/data/initialData";

export default function Footer() {
  const { contactInfo: storeContact } = useCitsStore();
  const contact = storeContact || initialContactInfo;

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const whatsappNumber = "6281239719677";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Halo%20Tim%20CITS,%20saya%20ingin%20berkonsultasi%20mengenai%20kebutuhan%20solusi%20TI.`;

  return (
    <footer className="bg-slate-50 dark:bg-[#121222] border-t border-slate-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Kolom 1: Profil & Identitas Perusahaan (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block" aria-label="CITS Indonesia">
              <Image
                src="/logo.webp"
                alt="PT Cipta Integrasi Teknologi Solusi"
                width={130}
                height={38}
                unoptimized
                className="h-8 w-auto block dark:hidden"
              />
              <Image
                src="/logo-dark.webp"
                alt="PT Cipta Integrasi Teknologi Solusi"
                width={130}
                height={38}
                unoptimized
                className="h-8 w-auto hidden dark:block"
              />
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pr-4">
              Mitra rekayasa perangkat lunak enterprise, konsultan SPBE, dan penyedia infrastruktur teknologi informasi
              terpercaya untuk instansi pemerintah serta korporasi di Indonesia.
            </p>

            <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              PT Cipta Integrasi Teknologi Solusi • NIB 0220205842886
            </div>
          </div>

          {/* Kolom 2: Layanan & Solusi (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Layanan Utama</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href="/services"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors block"
                >
                  Pengembangan Perangkat Lunak
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors block"
                >
                  Konsultasi TI & SPBE
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors block"
                >
                  Pengadaan & Infrastruktur TI
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors block"
                >
                  Solusi IoT & Telemetri
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors block"
                >
                  Sistem Informasi Geografis (SIG)
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors block"
                >
                  Pemeliharaan & Supervisi Sistem
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Tautan Cepat & Karier (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors block">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors block"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors block"
                >
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors block"
                >
                  Portofolio
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Karier</span>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-medium">
                    Hiring
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors block"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Hubungi Kami & WhatsApp (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Hubungi Kami</h4>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed text-xs sm:text-sm">
                {contact.address || "Gedung Wisma Mampang, Lantai 5, Jl. Mampang Prapatan No. 1, Jakarta Selatan 12790"}
              </p>
              <div>
                <a
                  href="https://maps.google.com/?q=CV+CITS+Indonesia+Wisma+Mampang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-orange-700 dark:text-orange-400 hover:underline"
                >
                  <span>Buka di Google Maps</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-1 space-y-1 text-xs sm:text-sm">
                <p>
                  <a
                    href={`tel:${(contact.phone || "02139719677").replace(/[^0-9]/g, "")}`}
                    className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    {contact.phone || "(021) 39719677"}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${contact.email || "info@citsindonesia.co.id"}`}
                    className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    {contact.email || "info@citsindonesia.co.id"}
                  </a>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                  {contact.workingHours || "Senin – Jumat (08.30 – 17.30 WIB)"}
                </p>
              </div>

              {/* Tombol WhatsApp Elegan */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-xs transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.25-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
                  </svg>
                  <span>Konsultasi Gratis</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legalitas */}
        <div className="border-t border-slate-200 dark:border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} CITS Indonesia. Seluruh hak cipta dilindungi.</p>

          <div className="flex items-center gap-5">
            <Link href="/about" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/about" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              Syarat & Ketentuan
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <span>Kembali ke atas</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
