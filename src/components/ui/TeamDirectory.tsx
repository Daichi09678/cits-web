"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import TeamDirectoryCard from "@/components/ui/TeamDirectoryCard";
import TeamProfileDialog from "@/components/pages/team/TeamProfileDialog";
import { useTeamMembers } from "@/lib/teamClient";
import { groupTeamMembers, publicTeamMembers } from "@/lib/teamDirectory";
import type { TeamMember } from "@/lib/team";

interface TeamDirectoryProps {
  members: readonly TeamMember[];
  loading: boolean;
  error: string;
  onRetry: () => void;
}

export function TeamDirectory({ members, loading, error, onRetry }: TeamDirectoryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const published = publicTeamMembers(members);
  const selectedMember = published.find((member) => member.id === selectedId);
  const teamNames = [
    ...new Set(published.map((member) => member.teamName).filter((name): name is string => Boolean(name))),
  ];
  const groups = groupTeamMembers(published);
  const unavailable = Boolean(error && published.length === 0);

  return (
    <section
      id="anggota-tim"
      aria-labelledby="team-directory-heading"
      className="scroll-mt-24 bg-white pt-2 pb-2 sm:pt-3 dark:bg-[#1A1A2E]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="sr-only">
          <div className="sr-only">
            <h2
              id="team-directory-heading"
              className="text-[28px] font-bold leading-tight tracking-tight text-dark md:text-[32px] dark:text-white"
            >
              Kenali tim kami
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Temukan anggota tim beserta jabatan dan perannya dalam organisasi.
            </p>
          </div>
          {!loading && !unavailable && published.length > 0 && (
            <p className="shrink-0 text-sm text-slate-500 dark:text-slate-400">
              {teamNames.length > 0 && <>{teamNames.length} tim · </>}
              {published.length} anggota ditampilkan
            </p>
          )}
        </div>
        {error && published.length > 0 && (
          <div
            role="status"
            className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300"
          >
            <p>Pembaruan data belum berhasil. Daftar terakhir tetap ditampilkan.</p>
            <button
              type="button"
              onClick={onRetry}
              className="min-h-11 rounded-lg px-2 font-semibold text-orange-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 dark:text-orange-400"
            >
              Coba lagi
            </button>
          </div>
        )}

        {loading && !published.length ? (
          <div
            role="status"
            aria-busy="true"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-[#151528] dark:text-slate-300"
          >
            Memuat informasi tim...
          </div>
        ) : unavailable ? (
          <div
            role="alert"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center dark:border-white/10 dark:bg-[#151528]"
          >
            <p className="text-base font-semibold text-dark dark:text-white">Informasi tim belum dapat dimuat.</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Silakan coba kembali untuk melihat daftar anggota.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-5 min-h-11 cursor-pointer rounded-xl border border-orange-600 px-5 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 dark:text-orange-400 dark:hover:bg-orange-500/10"
            >
              Coba lagi
            </button>
          </div>
        ) : !published.length ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center dark:border-white/10 dark:bg-[#151528]">
            <Users aria-hidden="true" className="mx-auto mb-4 size-8 text-orange-600 dark:text-orange-400" />
            <p className="text-base font-semibold text-dark dark:text-white">Profil anggota tim belum tersedia.</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Anda tetap dapat menghubungi CITS melalui halaman kontak.
            </p>
          </div>
        ) : (
          <>
            <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              Menampilkan {published.length} dari {published.length} anggota
            </p>
            <div className="space-y-7 sm:space-y-8">
              {groups.map((group, index) => (
                <section key={group.name} aria-labelledby={`team-group-heading-${index}`}>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h3
                      id={`team-group-heading-${index}`}
                      className="min-w-0 scroll-mt-24 border-l-[5px] border-orange-500 pl-3 text-xl leading-snug font-bold tracking-tight text-[#0F172A] sm:text-2xl dark:text-white"
                    >
                      {group.name}
                    </h3>
                    <p className="shrink-0 pt-1 text-sm text-slate-500 dark:text-slate-400">
                      {group.members.length} anggota
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.members.map((member) => (
                      <TeamDirectoryCard key={member.id} member={member} onSelect={() => setSelectedId(member.id)} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
      {selectedMember && <TeamProfileDialog member={selectedMember} onClose={() => setSelectedId(null)} />}
    </section>
  );
}

export default function ManagedTeamDirectory() {
  const { members, loading, error, reload } = useTeamMembers();
  return <TeamDirectory members={members} loading={loading} error={error} onRetry={() => void reload()} />;
}
