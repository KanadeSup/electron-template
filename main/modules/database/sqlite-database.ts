import { readdirSync, readFileSync } from "node:original-fs";
import { dirname, join } from "node:path";
import { databaseName } from "@main/config";
import { FileSystemService } from "@main/modules/filesystem/services/filesystem.service";
import sqlite3, { type Database } from "better-sqlite3";
import Logger from "electron-log";

class SqliteDatabase {
  private db: Database;
  private filesystemService: FileSystemService = new FileSystemService();

  constructor() {
    const appDataPath = this.filesystemService.getOrCreateDataDirPath();
    const databasePath = join(appDataPath, databaseName);
    this.db = new sqlite3(databasePath);
    this.db.pragma("journal_mode = WAL");

    this.initMigrationsTable();
    this.runMigrations();
  }

  public getDb(): Database {
    return this.db;
  }

  private initMigrationsTable(): void {
    const hasMigrationsTable =
      this.db
        .prepare(`
          SELECT name
          FROM sqlite_master
          WHERE type = 'table'
            AND name = 'migrations'
        `)
        .get() !== undefined;

    if (!hasMigrationsTable) {
      Logger.info("Migrations table not found, creating...");
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        )
      `);
      Logger.info("Migrations table created");
    }
  }

  private runMigrations(): void {
    const migrationFiles = this.getMigrationFiles();

    const appliedMigrations = this.db
      .prepare(`
        SELECT name
        FROM migrations
        ORDER BY id ASC
      `)
      .all() as { name: string }[];

    const migrationsToRun = migrationFiles.filter(
      (migrationFile) =>
        !appliedMigrations.some((appliedMigration) => appliedMigration.name === migrationFile.name),
    );
    if (migrationsToRun.length === 0) {
      Logger.info("No migrations to run");
      return;
    }
    Logger.info(`Found ${migrationsToRun.length} migrations to run...`);
    for (const migration of migrationsToRun) {
      this.runMigration(migration.name, migration.filePath);
    }
  }

  private getMigrationFiles() {
    const modulePath = dirname(__dirname);
    const files = readdirSync(join(modulePath, "migrations"));
    return files
      .filter((file) => file.endsWith(".sql"))
      .map((file) => ({
        name: file.replace(".sql", ""),
        filePath: join(modulePath, "migrations", file),
      }));
  }

  private runMigration(migrationName: string, filePath: string): void {
    Logger.info(`Running migration ${migrationName}...`);
    const migration = readFileSync(filePath, "utf8");
    this.db.exec(migration);
    this.db
      .prepare(`
      INSERT INTO migrations (name) VALUES (?)
    `)
      .run(migrationName);
    Logger.info(`Migration ${migrationName} completed`);
  }
}

const sqliteDatabase = new SqliteDatabase();
export const db = sqliteDatabase.getDb();
