import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '../../../src/middlewares/error-handler.middleware';
import { Lyric } from '../../../src/models/lyric.model';
import { LyricRepository } from '../../../src/repositories/lyric.repository';
import { LyricService } from '../../../src/services/lyric.service';

describe('LyricService (unit)', () => {
  let repositoryMock: {
    create: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let service: LyricService;

  const sampleLyric: Lyric = {
    id: 1,
    title: 'Aquarela',
    artist: 'Toquinho',
    album: 'Aquarela',
    releaseYear: 1983,
    genre: 'MPB',
    language: 'pt',
    content: 'Numa folha qualquer eu desenho um sol amarelo...',
    createdAt: '2026-11-24 12:00:00',
    updatedAt: '2026-11-24 12:00:00',
  };

  beforeEach(() => {
    repositoryMock = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    service = new LyricService(repositoryMock as unknown as LyricRepository);
  });

  it('deve criar uma letra delegando ao repository', () => {
    repositoryMock.create.mockReturnValue(sampleLyric);

    const created = service.createLyric({
      title: 'Aquarela',
      artist: 'Toquinho',
      language: 'pt',
      content: 'Numa folha qualquer eu desenho um sol amarelo...',
    });

    expect(repositoryMock.create).toHaveBeenCalledOnce();
    expect(created).toEqual(sampleLyric);
  });

  it('deve retornar a letra quando encontrada por ID', () => {
    repositoryMock.findById.mockReturnValue(sampleLyric);

    const lyric = service.getLyricById(1);

    expect(lyric).toEqual(sampleLyric);
  });

  it('deve lançar AppError 404 quando a letra não existir ao buscar por ID', () => {
    repositoryMock.findById.mockReturnValue(null);

    expect(() => service.getLyricById(999)).toThrow(AppError);
    expect(() => service.getLyricById(999)).toThrow('Letra com id 999 não encontrada');
  });

  it('deve lançar AppError 404 ao tentar atualizar letra inexistente', () => {
    repositoryMock.update.mockReturnValue(null);

    expect(() => service.updateLyric(999, { title: 'Novo Título' })).toThrow(AppError);
  });

  it('deve lançar AppError 404 ao tentar remover letra inexistente', () => {
    repositoryMock.delete.mockReturnValue(false);

    expect(() => service.deleteLyric(999)).toThrow(AppError);
  });
});