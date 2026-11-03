"use client";

import TeamSection from "@/components/ui/TeamSection";
import { useTeamMembers } from "@/lib/teamClient";

export default function ManagedTeamSection() {
  const { members, loading, error, reload } = useTeamMembers();
  if (loading || (error && !members.length)) {
    return (
      <section
        id="team"
        aria-labelledby="team-heading"
        className="scroll-mt-24 bg-white py-12 sm:py-16 dark:bg-[#1A1A2E]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="team-heading" className="text-3xl font-bold text-slate-900 dark:text-white">
            Tim Kami
          </h2>
          <p role="status" aria-busy={loading} className="mt-5 text-sm text-slate-600 dark:text-slate-300">
            {loading ? "Memuat informasi tim..." : "Informasi tim belum dapat dimuat."}
          </p>
          {!loading && (
            <button
              type="button"
              onClick={() => void reload()}
              className="mt-3 inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-orange-800 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:border-white/20 dark:text-orange-300 dark:hover:bg-white/10"
            >
              Coba lagi
            </button>
          )}
        </div>
      </section>
    );
  }
  return <TeamSection members={members} />;
}
