import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(db: SQLiteDatabase) {
  try {
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
     id TEXT NOT NULL,
     github_id INTEGER,
     name TEXT NOT NULL,
     email TEXT,
     profile_picture TEXT,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     updated_at DATETIME
    )
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
