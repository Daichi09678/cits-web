import Image from "next/image";
import type { TeamMember } from "@/lib/team";

export type { TeamMember } from "@/lib/team";

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#303442] bg-[#141722] transition-colors duration-200 hover:border-[#626979]">
      <div className="relative aspect-[4/3] shrink-0 bg-[#191D29]">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={`Foto ${member.name}`}
            fill
            unoptimized
            sizes="(min-width: 1280px) 280px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-sm text-slate-400">Foto belum tersedia</div>
        )}
      </div>
      <div className="flex min-h-32 flex-1 flex-col p-5">
        <h3 className="break-words text-lg font-semibold leading-snug text-white xl:text-xl">{member.name}</h3>
        <p className="mt-1 break-words text-sm leading-relaxed text-slate-300">{member.position}</p>
        <div className="mt-auto pt-4" aria-hidden="true">
          <div className="h-[3px] w-16 rounded-sm bg-brand" />
        </div>
      </div>
    </article>
  );
}
