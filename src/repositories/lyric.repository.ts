import Database from 'better-sqlite3';
import { db } from '../config/database';
import { CreateLyricDTO, ListLyricsQueryDTO, UpdateLyricDTO } from '../dtos/lyric.dto';
import { Lyric, LyricRow, mapRowToLyric } from '../models/lyric.model';

export interface PaginatedLyrics {
  data: Lyric[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class LyricRepository {
  constructor(private readonly database: Database.Database = db) {}

  create(data: CreateLyricDTO): Lyric {
    const stmt = this.database.prepare(`
      INSERT INTO lyrics (title, artist, album, release_year, genre, language, content)
      VALUES (@title, @artist, @album, @releaseYear, @genre, @language, @content)
    `);

    const info = stmt.run({
      title: data.title,
      artist: data.artist,
      album: data.album ?? null,
      releaseYear: data.releaseYear ?? null,
      genre: data.genre ?? null,
      language: data.language,
      content: data.content,
    });

    return this.findById(Number(info.lastInsertRowid))!;
  }

  findById(id: number): Lyric | null {
    const stmt = this.database.prepare('SELECT * FROM lyrics WHERE id = ?');
    const row = stmt.get(id) as LyricRow | undefined;
    return row ? mapRowToLyric(row) : null;
  }

  findAll(query: ListLyricsQueryDTO): PaginatedLyrics {
    const conditions: string[] = [];
    const params: Record<string, unknown> = {};

    if (query.q) {
      conditions.push('(title LIKE @q OR artist LIKE @q OR content LIKE @q)');
      params.q = `%${query.q}%`;
    }

    if (query.artist) {
      conditions.push('LOWER(artist) LIKE LOWER(@artist)');
      params.artist = `%${query.artist}%`;
    }

    if (query.language) {
      conditions.push('LOWER(language) = LOWER(@language)');
      params.language = query.language;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countStmt = this.database.prepare(`SELECT COUNT(*) as total FROM lyrics ${whereClause}`);
    const { total } = countStmt.get(params) as { total: number };

    const offset = (query.page - 1) * query.limit;
    const dataStmt = this.database.prepare(`
      SELECT * FROM lyrics
      ${whereClause}
      ORDER BY created_at DESC, id DESC
      LIMIT @limit OFFSET @offset
    `);

    const rows = dataStmt.all({
      ...params,
      limit: query.limit,
      offset,
    }) as LyricRow[];

    return {
      data: rows.map(mapRowToLyric),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  }

  update(id: number, data: UpdateLyricDTO): Lyric | null {
    const fields: string[] = [];
    const params: Record<string, unknown> = { id };

    if (data.title !== undefined) {
      fields.push('title = @title');
      params.title = data.title;
    }
    if (data.artist !== undefined) {
      fields.push('artist = @artist');
      params.artist = data.artist;
    }
    if (data.album !== undefined) {
      fields.push('album = @album');
      params.album = data.album;
    }
    if (data.releaseYear !== undefined) {
      fields.push('release_year = @releaseYear');
      params.releaseYear = data.releaseYear;
    }
    if (data.genre !== undefined) {
      fields.push('genre = @genre');
      params.genre = data.genre;
    }
    if (data.language !== undefined) {
      fields.push('language = @language');
      params.language = data.language;
    }
    if (data.content !== undefined) {
      fields.push('content = @content');
      params.content = data.content;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push("updated_at = datetime('now')");

    const stmt = this.database.prepare(`
      UPDATE lyrics
      SET ${fields.join(', ')}
      WHERE id = @id
    `);

    const info = stmt.run(params);
    if (info.changes === 0) {
      return null;
    }

    return this.findById(id);
  }

  delete(id: number): boolean {
    const stmt = this.database.prepare('DELETE FROM lyrics WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
}