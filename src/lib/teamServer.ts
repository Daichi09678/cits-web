import { randomUUID } from "node:crypto";
import { ensureDbReady, getSql } from "@/lib/db";
import { sortTeamMembers, type TeamMember, type TeamMemberInput } from "@/lib/team";
import { demoTeamMembers } from "@/data/teamMembers";

async function database() {
  const sql = getSql();
  if (!sql) throw new Error("Database belum dikonfigurasi. Data tim belum dapat dimuat atau disimpan.");
  await ensureDbReady();
  return sql;
}

function readMember(row: { id: string; data: unknown }): TeamMember {
  const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
  return { ...data, id: row.id };
}

export const TeamRepo = {
  async seedExamples(): Promise<TeamMember[] | null> {
    const sql = await database();
    return sql.begin(async (transaction) => {
      await transaction`LOCK TABLE team_members IN SHARE ROW EXCLUSIVE MODE;`;
      const existing = await transaction`SELECT id FROM team_members LIMIT 1;`;
      if (existing.length) return null;
      for (const member of demoTeamMembers) {
        const { id, ...input } = member;
        await transaction`INSERT INTO team_members (id, data) VALUES (${id}, ${transaction.json(input as never)});`;
      }
      return [...demoTeamMembers];
    });
  },
  async list(): Promise<TeamMember[]> {
    const sql = await database();
    const rows = await sql<{ id: string; data: unknown }[]>`SELECT id, data FROM team_members;`;
    return sortTeamMembers(rows.map(readMember));
  },
  async create(input: TeamMemberInput): Promise<TeamMember> {
    const sql = await database();
    const id = "team-" + randomUUID();
    const [row] = await sql<{ id: string; data: unknown }[]>`
      INSERT INTO team_members (id, data) VALUES (${id}, ${sql.json(input as never)}) RETURNING id, data;
    `;
    if (!row) throw new Error("Anggota tim belum tersimpan.");
    return readMember(row);
  },
  async update(id: string, input: TeamMemberInput): Promise<TeamMember | null> {
    const sql = await database();
    const [row] = await sql<{ id: string; data: unknown }[]>`
      UPDATE team_members SET data = ${sql.json(input as never)}, updated_at = NOW() WHERE id = ${id} RETURNING id, data;
    `;
    return row ? readMember(row) : null;
  },
  async remove(id: string): Promise<boolean> {
    const sql = await database();
    const rows = await sql`DELETE FROM team_members WHERE id = ${id} RETURNING id;`;
    return rows.length > 0;
  },
};
