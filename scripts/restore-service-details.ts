// Run with Bun from frontend; --apply restores missing legacy fields after backing up the catalog.
import postgres from "postgres";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defaultServicePresentations } from "../src/data/serviceDetails";
import { parseServiceCatalog, serviceAnchor } from "../src/lib/serviceCatalog";
import type { ServicePillar } from "../src/types/schema";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL belum dikonfigurasi.");
  const apply = process.argv.includes("--apply");
  const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
  try {
    await sql.begin(async (transaction) => {
      const rows = await transaction<{ data: ServicePillar[] }[]>`
        SELECT data FROM services_data WHERE id = 'default' FOR UPDATE
      `;
      const current = rows[0]?.data;
      if (!Array.isArray(current)) throw new Error("Katalog tersimpan tidak ditemukan.");
      const changes: { id: string; fields: string[] }[] = [];
      const updated = current.map((service) => {
        const original = defaultServicePresentations.find((item) => item.id === serviceAnchor(service.id));
        if (!original) return service;
        const next = { ...service };
        const fields: string[] = [];
        const originalFields = {
          details: original.description,
          image: original.image,
          techStack: original.techStack,
          caseStudies: original.caseStudies,
          deliverables: original.deliverables,
        };
        for (const field of Object.keys(originalFields) as (keyof typeof originalFields)[]) {
          // An explicit empty string or list is an admin choice and must stay empty.
          if (service[field] !== undefined && service[field] !== null) continue;
          Object.assign(next, { [field]: originalFields[field] });
          fields.push(field);
        }
        if (fields.length) changes.push({ id: service.id, fields });
        return next;
      });
      if (!parseServiceCatalog(updated).ok) throw new Error("Validasi katalog hasil pemulihan gagal.");
      console.log(JSON.stringify({ apply, changes }));
      if (!apply || !changes.length) return;
      const backup = join(tmpdir(), `cits-services-before-restore-${Date.now()}.json`);
      await writeFile(backup, JSON.stringify(current, null, 2), { flag: "wx" });
      await transaction`
        UPDATE services_data SET data = ${JSON.stringify(updated)}::jsonb, updated_at = NOW()
        WHERE id = 'default'
      `;
      console.log(`Backup: ${backup}`);
    });
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Pemulihan gagal.");
  process.exitCode = 1;
});
