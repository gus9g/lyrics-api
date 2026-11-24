export interface LyricRow {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  release_year: number | null;
  genre: string | null;
  language: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Lyric {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  releaseYear: number | null;
  genre: string | null;
  language: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function mapRowToLyric(row: LyricRow): Lyric {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    album: row.album,
    releaseYear: row.release_year,
    genre: row.genre,
    language: row.language,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}