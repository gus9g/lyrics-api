import { CreateLyricDTO, ListLyricsQueryDTO, UpdateLyricDTO } from '../dtos/lyric.dto';
import { AppError } from '../middlewares/error-handler.middleware';
import { Lyric } from '../models/lyric.model';
import { LyricRepository, PaginatedLyrics } from '../repositories/lyric.repository';

export class LyricService {
  constructor(private readonly repository: LyricRepository = new LyricRepository()) {}

  createLyric(data: CreateLyricDTO): Lyric {
    return this.repository.create(data);
  }

  getLyricById(id: number): Lyric {
    const lyric = this.repository.findById(id);
    if (!lyric) {
      throw new AppError(404, `Letra com id ${id} não encontrada`);
    }
    return lyric;
  }

  listLyrics(query: ListLyricsQueryDTO): PaginatedLyrics {
    return this.repository.findAll(query);
  }

  updateLyric(id: number, data: UpdateLyricDTO): Lyric {
    const updated = this.repository.update(id, data);
    if (!updated) {
      throw new AppError(404, `Letra com id ${id} não encontrada`);
    }
    return updated;
  }

  deleteLyric(id: number): void {
    const deleted = this.repository.delete(id);
    if (!deleted) {
      throw new AppError(404, `Letra com id ${id} não encontrada`);
    }
  }
}