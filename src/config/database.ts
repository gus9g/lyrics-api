import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const dbPath = process.env.DATABASE_PATH || path.resolve(process.cwd(), 'data', 'lyrics.sqlite');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

// Melhora concorrência e integridade referencial no SQLite
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS lyrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      album TEXT,
      release_year INTEGER,
      genre TEXT,
      language TEXT NOT NULL DEFAULT 'pt',
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_lyrics_artist ON lyrics(artist);
    CREATE INDEX IF NOT EXISTS idx_lyrics_title ON lyrics(title);
  `);
}