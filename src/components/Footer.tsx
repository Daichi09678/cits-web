import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-[#121222] text-gray-800 dark:text-white border-t border-gray-200 dark:border-white/10 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo.webp"
                alt="CITS Indonesia"
                width={140}
                height={40}
                className="h-8 w-auto block dark:hidden"
              />
              <Image
                src="/Logo 2.png"
                alt="CITS Indonesia"
                width={140}
                height={40}
                className="h-8 w-auto hidden dark:block"
              />
            </div>
            <p className="text-gray-700 dark:text-white/85 text-sm leading-relaxed">
              Cipta Integrasi Teknologi Solusi - Mitra bisnis terpercaya untuk solusi integral kesistemanan berbasis teknologi informasi.
            </p>
          </div>

          {/* Tautan Cepat */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-dark dark:text-white">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-white/85">
              <li><Link href="/services" className="hover:text-orange-700 dark:hover:text-orange-400 transition-colors">Layanan</Link></li>
              <li><Link href="/products" className="hover:text-orange-700 dark:hover:text-orange-400 transition-colors">Produk</Link></li>
              <li><Link href="/portfolio" className="hover:text-orange-700 dark:hover:text-orange-400 transition-colors">Portofolio</Link></li>
              <li><Link href="/about" className="hover:text-orange-700 dark:hover:text-orange-400 transition-colors">Tentang Kami</Link></li>
              <li><Link href="/contact" className="hover:text-orange-700 dark:hover:text-orange-400 transition-colors">Kontak</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-dark dark:text-white">Hubungi Kami</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-white/85">
              <li>Gedung Wisma Mampang, Lt. 5</li>
              <li>Jl. Mampang Prapatan No. 1</li>
              <li>Jakarta Selatan 12790</li>
              <li className="pt-2 font-medium text-dark dark:text-white">021 - 39719677</li>
              <li>info@citsindonesia.co.id</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-white/10 mt-8 pt-8 text-center text-sm text-gray-700 dark:text-white/85">
          <p>&copy; {new Date().getFullYear()} CITS Indonesia. Ciptakan Solusi Sepenuh Hati.</p>
        </div>
      </div>
    </footer>
  );
}
