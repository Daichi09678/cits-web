import { randomUUID } from "node:crypto";
import { ensureDbReady, getSql } from "@/lib/db";
import { sortTeamMembers, type TeamMember, type TeamMemberInput } from "@/lib/team";
import { demoTeamMembers } from "@/data/teamMembers";

function database() {
  const sql = getSql();
  if (!sql) throw new Error("Database belum dikonfigurasi. Data tim belum dapat dimuat atau disimpan.");
  return sql;
}

async function withTeamTable<T>(query: (sql: ReturnType<typeof database>) => Promise<T>): Promise<T> {
  const sql = database();
  try {
    return await query(sql);
  } catch (error) {
    if (!error || typeof error !== "object" || !("code" in error) || error.code !== "42P01") throw error;
    await ensureDbReady();
    return query(sql);
  }
}

function readMember(row: { id: string; data: unknown }): TeamMember {
  const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
  return { ...data, id: row.id };
}

export const TeamRepo = {
  async seedExamples(): Promise<TeamMember[] | null> {
    return withTeamTable((sql) =>
      sql.begin(async (transaction) => {
        await transaction`LOCK TABLE team_members IN SHARE ROW EXCLUSIVE MODE;`;
        const existing = await transaction`SELECT id FROM team_members LIMIT 1;`;
        if (existing.length) return null;
        for (const member of demoTeamMembers) {
          const { id, ...input } = member;
          await transaction`INSERT INTO team_members (id, data) VALUES (${id}, ${transaction.json(input as never)});`;
        }
        return [...demoTeamMembers];
      })
    );
  },
  async list(): Promise<TeamMember[]> {
    const rows = await withTeamTable(
      async (sql) => sql<{ id: string; data: unknown }[]>`SELECT id, data FROM team_members;`
    );
    return sortTeamMembers(rows.map(readMember));
  },
  async create(input: TeamMemberInput): Promise<TeamMember> {
    const id = "team-" + randomUUID();
    const [row] = await withTeamTable(
      async (sql) => sql<{ id: string; data: unknown }[]>`
      INSERT INTO team_members (id, data) VALUES (${id}, ${sql.json(input as never)}) RETURNING id, data;
    `
    );
    if (!row) throw new Error("Anggota tim belum tersimpan.");
    return readMember(row);
  },
  async update(id: string, input: TeamMemberInput): Promise<TeamMember | null> {
    const [row] = await withTeamTable(
      async (sql) => sql<{ id: string; data: unknown }[]>`
      UPDATE team_members SET data = ${sql.json(input as never)}, updated_at = NOW() WHERE id = ${id} RETURNING id, data;
    `
    );
    return row ? readMember(row) : null;
  },
  async remove(id: string): Promise<boolean> {
    const rows = await withTeamTable(async (sql) => sql`DELETE FROM team_members WHERE id = ${id} RETURNING id;`);
    return rows.length > 0;
  },
};
