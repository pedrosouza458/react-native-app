import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(db: SQLiteDatabase) {
  try {
    // await db.execAsync(`DROP TABLE IF EXISTS favorite_repositories;`);
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS favorite_repositories (
     id INTEGER PRIMARY KEY NOT NULL,
     name TEXT NOT NULL,
     full_name TEXT NOT NULL,
     description TEXT,
     login TEXT NOT NULL,
     avatar_url TEXT,
     stargazers_count INTEGER NOT NULL DEFAULT 0,
     language TEXT,
     html_url TEXT NOT NULL,
     deleted INTEGER NOT NULL DEFAULT 0,
     synced INTEGER NOT NULL DEFAULT 0
    );
    `);
    console.log("database initialized successfully");
  } catch (error) {
    console.log("error initlizaing database: ", error);
  }
}
