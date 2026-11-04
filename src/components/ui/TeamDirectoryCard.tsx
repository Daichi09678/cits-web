import Image from "next/image";
import { UserRound } from "lucide-react";
import type { TeamMember } from "@/lib/team";

export default function TeamDirectoryCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition-colors duration-150 hover:border-orange-300 hover:bg-orange-50/20 dark:border-white/10 dark:bg-transparent dark:hover:border-orange-400/40">
      <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#FFF0E5] text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={`Foto ${member.name}`}
            fill
            unoptimized
            sizes="44px"
            className="object-cover object-top"
          />
        ) : (
          <UserRound aria-hidden="true" className="size-7" strokeWidth={1.5} />
        )}
      </div>
      <div className="min-w-0 py-0.5">
        <h4 className="break-words text-sm font-bold leading-snug text-[#0F172A] sm:text-base dark:text-white">
          {member.name}
        </h4>
        <p className="mt-0.5 break-words text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
          {member.position}
        </p>
      </div>
    </article>
  );
}
