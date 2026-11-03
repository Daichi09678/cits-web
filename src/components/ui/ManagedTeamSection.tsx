"use client";

import TeamSection from "@/components/ui/TeamSection";
import { useTeamMembers } from "@/lib/teamClient";

export default function ManagedTeamSection({ showAll = false }: { showAll?: boolean }) {
  const { members, loading, error, reload } = useTeamMembers();
  return (
    <TeamSection members={members} showAll={showAll} loading={loading} error={error} onRetry={() => void reload()} />
  );
}
