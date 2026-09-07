import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const migrationsDir = join(process.cwd(), "public", "migrations");

const rawName = process.argv.slice(2).join(" ").trim();

if (!rawName) {
  console.error("Usage: pnpm create-migration <name>");
  console.error("Example: pnpm create-migration create ai models table");
  process.exit(1);
}

const slug = rawName
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "_")
  .replace(/^_|_$/g, "");

if (!slug) {
  console.error("Migration name must contain letters or numbers.");
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const fileName = `${timestamp}_${slug}.sql`;
const filePath = join(migrationsDir, fileName);

mkdirSync(migrationsDir, { recursive: true });
writeFileSync(filePath, `-- Migration: ${slug}\n\n`);

console.log(`Created ${filePath}`);
