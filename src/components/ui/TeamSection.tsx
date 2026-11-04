import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TeamMemberCard, { type TeamMember } from "./TeamMemberCard";

interface TeamSectionProps {
  members?: readonly TeamMember[];
  isDemo?: boolean;
  showAll?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export default function TeamSection({
  members = [],
  isDemo = false,
  showAll = false,
  loading = false,
  error = "",
  onRetry,
}: TeamSectionProps) {
  const eligibleMembers = members
    .filter((member) => member.isActive !== false && member.showOnHomepage !== false)
    .sort((a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER));
  const featuredMembers = showAll ? eligibleMembers : eligibleMembers.slice(0, 4);
  const Heading = showAll ? "h1" : "h2";

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="scroll-mt-24 bg-white py-16 text-dark sm:py-20 lg:py-24 dark:bg-transparent dark:text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 lg:mb-12 lg:flex-row lg:items-end lg:gap-8">
          <div className="min-w-0 max-w-3xl">
            <Heading
              id="team-heading"
              className="text-[28px] font-bold leading-tight tracking-tight text-dark md:text-[32px] dark:text-white"
            >
              Tim Profesional di Balik <span className="text-brand">Solusi CITS</span>
            </Heading>
            <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-slate-300">
              Didukung oleh para ahli di bidang teknologi informasi, manajemen proyek, dan pengembangan bisnis untuk
              menghadirkan solusi terbaik bagi kebutuhan Anda.
            </p>
          </div>
          <Link
            href={showAll ? "/#team" : "/team"}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-lg border border-brand px-5 py-3 text-sm font-semibold text-brand transition-colors duration-200 hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand lg:mb-1"
          >
            {showAll ? "Kembali ke Beranda" : "Lihat Seluruh Tim"}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        {(isDemo || featuredMembers.some((member) => member.isDemo)) && (
          <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            Data contoh untuk preview, bukan data resmi CITS Indonesia.
          </p>
        )}
        {loading || (error && !featuredMembers.length) ? (
          <div className="border-t border-gray-200 py-8 dark:border-[#303442]">
            <p
              role={error ? "alert" : "status"}
              aria-busy={loading}
              className="text-sm leading-relaxed text-gray-600 dark:text-slate-300"
            >
              {loading ? "Memuat informasi tim..." : "Informasi tim belum dapat dimuat."}
            </p>
            {!loading && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 min-h-11 cursor-pointer rounded-lg border border-brand px-5 text-sm font-semibold text-brand hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Coba lagi
              </button>
            )}
          </div>
        ) : featuredMembers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <p className="border-t border-gray-200 py-8 text-sm leading-relaxed text-gray-500 dark:border-[#303442] dark:text-slate-400">
            Informasi anggota tim belum tersedia.
          </p>
        )}
      </div>
    </section>
  );
}
