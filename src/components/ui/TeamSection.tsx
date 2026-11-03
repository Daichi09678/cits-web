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
      className="scroll-mt-24 bg-[#1A1A2E] py-16 text-white sm:py-20 lg:py-24 dark:bg-transparent"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 lg:mb-12 lg:flex-row lg:items-end lg:gap-8">
          <div className="min-w-0 max-w-3xl">
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-wide text-brand sm:text-sm">
              <span aria-hidden="true" className="h-[3px] w-12 shrink-0 rounded-sm bg-brand" />
              TIM KAMI
            </p>
            <Heading
              id="team-heading"
              className="text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[32px] xl:text-[40px]"
            >
              Tim Profesional di Balik <span className="text-brand">Solusi CITS</span>
            </Heading>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base sm:leading-7">
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
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            Data contoh untuk preview, bukan data resmi CITS Indonesia.
          </p>
        )}
        {loading || (error && !featuredMembers.length) ? (
          <div className="border-t border-[#303442] py-8">
            <p role={error ? "alert" : "status"} aria-busy={loading} className="text-sm leading-relaxed text-slate-300">
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
          <p className="border-t border-[#303442] py-8 text-sm leading-relaxed text-slate-400">
            Informasi anggota tim belum tersedia.
          </p>
        )}
      </div>
    </section>
  );
}
