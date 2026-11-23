import accentStyles from "@/components/pages/public/PublicAccent.module.css";
import Link from "next/link";

export default function CaseStudyNotFound() {
  return (
    <main id="main-content" className="min-h-[62vh] bg-white px-4 py-24 text-center dark:bg-[#1a1a2e]">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Studi kasus tidak ditemukan</h1>
      <p className="mx-auto mt-3 max-w-lg text-slate-600 dark:text-slate-300">
        Studi kasus ini tidak tersedia atau sudah tidak dipublikasikan.
      </p>
      <Link
        href="/portfolio"
        className={`mt-7 inline-flex min-h-11 items-center rounded-xl px-5 py-2.5 text-sm font-bold ${accentStyles.action}`}
      >
        Kembali ke Portofolio
      </Link>
    </main>
  );
}
