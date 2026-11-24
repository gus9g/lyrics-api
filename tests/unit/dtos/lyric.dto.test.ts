import { describe, expect, it } from 'vitest';
import { createLyricSchema, listLyricsQuerySchema, updateLyricSchema } from '../../../src/dtos/lyric.dto';

describe('Lyric DTOs (unit)', () => {
  it('deve aplicar language padrão "pt" e aparar espaços em createLyricSchema', () => {
    const parsed = createLyricSchema.parse({
      title: '  Detalhes  ',
      artist: '  Roberto Carlos  ',
      content: '  Não precisa se preocupar...  ',
    });

    expect(parsed.title).toBe('Detalhes');
    expect(parsed.artist).toBe('Roberto Carlos');
    expect(parsed.language).toBe('pt');
  });

  it('deve rejeitar criação sem título ou letra', () => {
    const result = createLyricSchema.safeParse({
      title: '',
      artist: 'Artista',
      content: '',
    });

    expect(result.success).toBe(false);
  });

  it('deve rejeitar update vazio', () => {
    const result = updateLyricSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('deve converter page e limit para número na query', () => {
    const parsed = listLyricsQuerySchema.parse({ page: '2', limit: '5' });
    expect(parsed.page).toBe(2);
    expect(parsed.limit).toBe(5);
  });
});