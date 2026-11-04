import { sortTeamMembers, type TeamMember } from "@/lib/team";

export function publicTeamMembers(members: readonly TeamMember[]): TeamMember[] {
  return sortTeamMembers(members.filter((member) => member.isActive !== false && member.showOnHomepage !== false));
}

export function searchTeamMembers(
  members: readonly TeamMember[],
  query: string,
  position = "",
  teamName = ""
): TeamMember[] {
  const search = query.trim().toLocaleLowerCase("id");
  return publicTeamMembers(members).filter(
    (member) =>
      (!position || member.position === position) &&
      (!teamName || member.teamName === teamName) &&
      (!search || `${member.name} ${member.position} ${member.teamName ?? ""}`.toLocaleLowerCase("id").includes(search))
  );
}

export function groupTeamMembers(members: readonly TeamMember[]): { name: string; members: TeamMember[] }[] {
  const groups = new Map<string, TeamMember[]>();
  for (const member of publicTeamMembers(members)) {
    const name = member.teamName?.trim() || "Anggota tim lainnya";
    const group = groups.get(name) ?? [];
    group.push(member);
    groups.set(name, group);
  }
  return [...groups].map(([name, members]) => ({ name, members }));
}
