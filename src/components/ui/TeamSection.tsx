import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TeamMemberCard, { type TeamMember } from "./TeamMemberCard";

interface TeamSectionProps {
  members?: readonly TeamMember[];
  isDemo?: boolean;
}

export default function TeamSection({ members = [], isDemo = false }: TeamSectionProps) {
  const featuredMembers = members
    .filter((member) => member.isActive !== false && member.showOnHomepage !== false)
    .sort((a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER))
    .slice(0, 4);

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="scroll-mt-24 bg-white py-12 sm:py-16 dark:bg-[#1A1A2E]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="min-w-0">
            <h2
              id="team-heading"
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-[32px] dark:text-white"
            >
              Tim Kami
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
              Didukung oleh profesional berpengalaman di bidang teknologi informasi, rekayasa sistem, dan tata kelola
              digital.
            </p>
          </div>
          <Link
            href="/#team"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm text-sm font-semibold text-orange-700 transition-colors duration-200 hover:text-orange-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
          >
            Lihat Seluruh Team
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        {isDemo && (
          <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Data contoh untuk preview. Nama dan jabatan berikut bukan data resmi CITS Indonesia.
          </p>
        )}
        {featuredMembers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 px-6 py-8 text-sm leading-relaxed text-slate-500 dark:border-white/15 dark:text-slate-400">
            Informasi anggota tim belum tersedia.
          </p>
        )}
      </div>
    </section>
  );
}
