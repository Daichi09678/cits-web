import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { groupTeamMembers } from "@/lib/teamDirectory";
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
  const featuredMembers = showAll ? eligibleMembers : eligibleMembers.slice(0, 8);
  const teamGroups = showAll ? groupTeamMembers(featuredMembers) : [];
  const Heading = showAll ? "h1" : "h2";

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="scroll-mt-24 bg-white py-16 text-dark transition-colors sm:py-20 lg:py-24 dark:bg-[#1A1A2E] dark:text-white"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
            <Users aria-hidden="true" className="h-3.5 w-3.5" />
            Tim Kami
          </span>
          <Heading
            id="team-heading"
            className="mt-4 text-[28px] font-bold leading-tight tracking-tight text-slate-900 md:text-[32px] dark:text-white"
          >
            Tim Profesional di Balik <span className="text-orange-600 dark:text-orange-400">Solusi CITS</span>
          </Heading>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Didukung oleh para ahli di bidang teknologi informasi, manajemen proyek, dan pengembangan bisnis untuk
            menghadirkan solusi terbaik bagi kebutuhan Anda.
          </p>
        </div>
        {(isDemo || featuredMembers.some((member) => member.isDemo)) && (
          <p className="mb-4 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Data contoh untuk preview, bukan data resmi CITS Indonesia.
          </p>
        )}
        {loading || (error && !featuredMembers.length) ? (
          <div className="rounded-xl border border-[#E2E8F0] bg-slate-50/60 py-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
            <p
              role={error ? "alert" : "status"}
              aria-busy={loading}
              className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
            >
              {loading ? "Memuat informasi tim..." : "Informasi tim belum dapat dimuat."}
            </p>
            {!loading && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 min-h-11 cursor-pointer rounded-lg bg-[#F4511E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#DC3F0C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
              >
                Coba lagi
              </button>
            )}
          </div>
        ) : featuredMembers.length > 0 && !showAll ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : featuredMembers.length > 0 ? (
          <div className="space-y-12">
            {teamGroups.map((group, index) => (
              <section key={group.name} aria-labelledby={`homepage-team-group-${index}`}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4 dark:border-white/10">
                  <h3
                    id={`homepage-team-group-${index}`}
                    className="text-xl font-semibold text-slate-900 dark:text-white"
                  >
                    {group.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{group.members.length} anggota</p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {group.members.map((member) => (
                    <TeamMemberCard key={member.id} member={member} headingLevel="h4" />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-[#E2E8F0] bg-slate-50/60 py-8 text-center text-sm leading-relaxed text-slate-500 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-400">
            Informasi anggota tim belum tersedia.
          </p>
        )}
        <div className="mt-10 text-center lg:mt-12">
          <Link
            href={showAll ? "/#team" : "/team"}
            className="group inline-flex min-h-11 items-center justify-center gap-2.5 rounded-lg bg-[#F4511E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#DC3F0C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
          >
            {showAll ? "Kembali ke Beranda" : "Lihat Seluruh Tim"}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
