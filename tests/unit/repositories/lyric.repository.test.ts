import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LyricRepository } from '../../../src/repositories/lyric.repository';

describe('LyricRepository (unit)', () => {
  let memoryDb: Database.Database;
  let repository: LyricRepository;

  beforeEach(() => {
    memoryDb = new Database(':memory:');
    memoryDb.exec(`
      CREATE TABLE lyrics (
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
    `);
    repository = new LyricRepository(memoryDb);
  });

  afterEach(() => {
    memoryDb.close();
  });

  it('deve filtrar por artist e language no findAll', () => {
    repository.create({
      title: 'Aquarela',
      artist: 'Toquinho',
      language: 'pt',
      content: 'Numa folha qualquer...',
    });
    repository.create({
      title: 'Imagine',
      artist: 'John Lennon',
      language: 'en',
      content: 'Imagine all the people...',
    });

    const byArtist = repository.findAll({ artist: 'toquinho', page: 1, limit: 10 });
    expect(byArtist.data).toHaveLength(1);
    expect(byArtist.data[0].title).toBe('Aquarela');

    const byLanguage = repository.findAll({ language: 'EN', page: 1, limit: 10 });
    expect(byLanguage.data).toHaveLength(1);
    expect(byLanguage.data[0].title).toBe('Imagine');
  });

  it('deve atualizar todos os campos no update e retornar o registro existente se nenhum campo for enviado', () => {
    const created = repository.create({
      title: 'Original',
      artist: 'Artista A',
      album: 'Álbum A',
      releaseYear: 2000,
      genre: 'Rock',
      language: 'pt',
      content: 'Letra original',
    });

    const unchanged = repository.update(created.id, {});
    expect(unchanged).toEqual(created);

    const updated = repository.update(created.id, {
      title: 'Atualizado',
      artist: 'Artista B',
      album: null,
      releaseYear: 2020,
      genre: 'Pop',
      language: 'en',
      content: 'Letra atualizada',
    });

    expect(updated).toMatchObject({
      id: created.id,
      title: 'Atualizado',
      artist: 'Artista B',
      album: null,
      releaseYear: 2020,
      genre: 'Pop',
      language: 'en',
      content: 'Letra atualizada',
    });
  });

  it('deve retornar null no update quando o ID não existir', () => {
    const result = repository.update(999, { title: 'Inexistente' });
    expect(result).toBeNull();
  });
});