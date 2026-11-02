import Image from "next/image";

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photoUrl: string | null;
  displayOrder?: number;
  isActive?: boolean;
  showOnHomepage?: boolean;
}

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors duration-200 hover:border-slate-300 dark:border-white/15 dark:bg-[#151528] dark:hover:border-white/30">
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-white/5">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={`Foto ${member.name}`}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-sm text-slate-500 dark:text-slate-400">
            Foto belum tersedia
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="break-words text-base font-semibold leading-snug text-slate-900 dark:text-white">
          {member.name}
        </h3>
        <p className="mt-1 break-words text-sm leading-relaxed text-slate-500 dark:text-slate-400">{member.position}</p>
      </div>
    </article>
  );
}
