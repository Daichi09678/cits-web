import Image from "next/image";
import { UserRound } from "lucide-react";
import type { TeamMember } from "@/lib/team";

export default function TeamDirectoryCard({ member, onSelect }: { member: TeamMember; onSelect: () => void }) {
  return (
    <article className="relative flex h-full min-h-32 min-w-0 items-stretch gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors duration-150 hover:border-orange-300 hover:bg-orange-50/20 dark:border-white/10 dark:bg-transparent dark:hover:border-orange-400/40">
      <div className="relative flex w-24 shrink-0 items-center justify-center overflow-hidden bg-[#FFF0E5] text-orange-600 sm:w-28 dark:bg-orange-500/10 dark:text-orange-400">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={`Foto ${member.name}`}
            fill
            unoptimized
            sizes="(min-width: 640px) 112px, 96px"
            className="object-cover object-top"
          />
        ) : (
          <UserRound aria-hidden="true" className="size-10" strokeWidth={1.5} />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center py-4 pr-4">
        <h4 className="break-words text-base font-bold leading-snug text-[#0F172A] sm:text-lg dark:text-white">
          {member.name}
        </h4>
        <p className="mt-1 break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300">{member.position}</p>
        <span className="mt-2 block text-sm font-medium text-orange-700 dark:text-orange-400">Lihat profil</span>
      </div>
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Lihat profil ${member.name}`}
        aria-haspopup="dialog"
        className="absolute inset-0 cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      />
    </article>
  );
}
