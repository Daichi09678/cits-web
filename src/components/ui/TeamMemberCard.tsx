import Image from "next/image";
import type { TeamMember } from "@/lib/team";

export type { TeamMember } from "@/lib/team";

export default function TeamMemberCard({
  member,
  headingLevel = "h3",
}: {
  member: TeamMember;
  headingLevel?: "h3" | "h4";
}) {
  const Heading = headingLevel;
  const initials = member.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const teamName = member.teamName?.trim();

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-600/10 dark:border-white/10 dark:bg-[#1A1A2E] dark:hover:border-orange-500/40 dark:hover:shadow-black/30">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-slate-100 dark:bg-white/5">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={`Foto ${member.name}`}
            fill
            unoptimized
            sizes="(min-width: 1280px) 280px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-sm font-bold tracking-wide text-orange-700 dark:bg-orange-500/10 dark:text-orange-300"
            >
              {initials}
            </span>
            <span className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">Foto belum tersedia</span>
          </div>
        )}
        {teamName && (
          <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur dark:border-white/10 dark:bg-[#0F1320]/85 dark:text-slate-200">
            {teamName}
          </span>
        )}
      </div>
      <div className="flex min-h-[7.5rem] flex-1 flex-col p-5">
        <Heading className="break-words text-lg font-semibold leading-snug text-slate-900 dark:text-white">
          {member.name}
        </Heading>
        <p className="mt-1 break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300">{member.position}</p>
        <div className="mt-auto flex items-center pt-4" aria-hidden="true">
          <span className="h-[3px] w-10 rounded-sm bg-orange-600 transition-all duration-300 group-hover:w-16 dark:bg-orange-400" />
        </div>
      </div>
    </article>
  );
}
