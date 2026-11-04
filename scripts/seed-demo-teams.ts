// Run from frontend with Bun. --apply writes the 24 demo profiles after saving a backup.
import postgres from "postgres";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { demoTeamMembers } from "../src/data/teamMembers";
import { parseTeamMember, type TeamMemberInput } from "../src/lib/team";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL belum dikonfigurasi.");
  const apply = process.argv.includes("--apply");
  const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
  try {
    await sql.begin(async (transaction) => {
      await transaction`LOCK TABLE team_members IN SHARE ROW EXCLUSIVE MODE`;
      const existing = await transaction<{ id: string; data: TeamMemberInput }[]>`SELECT id, data FROM team_members`;
      for (const member of demoTeamMembers) {
        const saved = existing.find((item) => item.id === member.id);
        if (saved && saved.data.isDemo !== true)
          throw new Error(`Profil resmi ${member.id} dipertahankan; ID contoh berbenturan.`);
        if (!parseTeamMember(member).ok) throw new Error(`Data contoh ${member.id} tidak valid.`);
      }
      console.log(
        JSON.stringify({
          apply,
          teams: [...new Set(demoTeamMembers.map((member) => member.teamName))],
          demoMembers: demoTeamMembers.length,
          preservedRealMembers: existing.filter((member) => !member.data.isDemo).length,
        })
      );
      if (!apply) return;
      const backup = join(tmpdir(), `cits-team-before-demo-${Date.now()}.json`);
      await writeFile(backup, JSON.stringify(existing, null, 2), { flag: "wx" });
      for (const { id, ...data } of demoTeamMembers) {
        await transaction`
          INSERT INTO team_members (id, data) VALUES (${id}, ${JSON.stringify(data)}::jsonb)
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
        `;
      }
      console.log(`Backup: ${backup}`);
    });
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Pengisian data contoh gagal.");
  process.exitCode = 1;
});
