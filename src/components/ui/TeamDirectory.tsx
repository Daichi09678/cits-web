"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import TeamDirectoryCard from "@/components/ui/TeamDirectoryCard";
import TeamProfileDialog from "@/components/pages/team/TeamProfileDialog";
import { useTeamMembers } from "@/lib/teamClient";
import { groupTeamMembers, publicTeamMembers, searchTeamMembers } from "@/lib/teamDirectory";
import type { TeamMember } from "@/lib/team";

interface TeamDirectoryProps {
  members: readonly TeamMember[];
  loading: boolean;
  error: string;
  onRetry: () => void;
}

export function TeamDirectory({ members, loading, error, onRetry }: TeamDirectoryProps) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("");
  const [teamName, setTeamName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const published = publicTeamMembers(members);
  const selectedMember = published.find((member) => member.id === selectedId);
  const teamNames = [
    ...new Set(published.map((member) => member.teamName).filter((name): name is string => Boolean(name))),
  ];
  const selectedTeam = teamNames.includes(teamName) ? teamName : "";
  const positions = [
    ...new Set(
      published.filter((member) => !selectedTeam || member.teamName === selectedTeam).map((member) => member.position)
    ),
  ].sort((a, b) => a.localeCompare(b, "id"));
  const selectedPosition = positions.includes(position) ? position : "";
  const filtered = searchTeamMembers(published, query, selectedPosition, selectedTeam);
  const groups = groupTeamMembers(filtered);
  const unavailable = Boolean(error && published.length === 0);
  const resetFilters = () => {
    setQuery("");
    setPosition("");
    setTeamName("");
  };

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

        {published.length > 0 && (
          <details className="mb-5">
            <summary className="min-h-8 cursor-pointer text-sm font-medium text-slate-600 underline-offset-4 hover:text-orange-700 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 dark:text-slate-300 dark:hover:text-orange-400">
              Cari atau filter anggota tim
            </summary>
            <form
              role="search"
              aria-label="Pencarian anggota tim"
              onSubmit={(event) => event.preventDefault()}
              className={`mt-4 grid gap-3 ${teamNames.length ? "sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(180px,260px)_minmax(180px,260px)]" : "md:grid-cols-[minmax(0,1fr)_minmax(220px,320px)]"}`}
            >
              <div className={teamNames.length ? "min-w-0 sm:col-span-2 lg:col-span-1" : "min-w-0"}>
                <label
                  htmlFor="team-search"
                  className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Cari anggota tim
                </label>
                <div className="relative">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400"
                  />
                  <input
                    id="team-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari nama, jabatan, atau tim..."
                    className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-dark outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-white/15 dark:bg-[#1A1A2E] dark:text-white"
                  />
                </div>
              </div>
              {teamNames.length > 0 && (
                <div className="min-w-0">
                  <label
                    htmlFor="team-group"
                    className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Tim
                  </label>
                  <select
                    id="team-group"
                    value={selectedTeam}
                    onChange={(event) => {
                      setTeamName(event.target.value);
                      setPosition("");
                    }}
                    className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-dark outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-white/15 dark:bg-[#1A1A2E] dark:text-white"
                  >
                    <option value="">Semua tim</option>
                    {teamNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="min-w-0">
                <label
                  htmlFor="team-position"
                  className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Jabatan
                </label>
                <select
                  id="team-position"
                  value={selectedPosition}
                  onChange={(event) => setPosition(event.target.value)}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-dark outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-white/15 dark:bg-[#1A1A2E] dark:text-white"
                >
                  <option value="">Semua jabatan</option>
                  {positions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </details>
        )}

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
              Menampilkan {filtered.length} dari {published.length} anggota
            </p>
            {filtered.length ? (
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
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center dark:border-white/10 dark:bg-[#151528]">
                <p className="text-base font-semibold text-dark dark:text-white">Tidak ada anggota yang cocok.</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Coba nama lain atau pilih jabatan yang berbeda.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 min-h-11 rounded-xl border border-orange-600 px-5 text-sm font-semibold text-orange-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 dark:text-orange-400"
                >
                  Reset pencarian
                </button>
              </div>
            )}
          </>
        )}
        {published.some((member) => member.isDemo) && (
          <p className="mt-5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Data contoh untuk preview, bukan profil anggota resmi CITS Indonesia.
          </p>
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
