import { NextFunction, Request, Response } from 'express';
import {
  createLyricSchema,
  listLyricsQuerySchema,
  lyricIdParamSchema,
  updateLyricSchema,
} from '../dtos/lyric.dto';
import { LyricService } from '../services/lyric.service';

export class LyricController {
  constructor(private readonly service: LyricService = new LyricService()) {}

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dto = createLyricSchema.parse(req.body);
      const created = this.service.createLyric(dto);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };

  findAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const query = listLyricsQuerySchema.parse(req.query);
      const result = this.service.listLyrics(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  findById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = lyricIdParamSchema.parse(req.params);
      const lyric = this.service.getLyricById(id);
      res.status(200).json(lyric);
    } catch (err) {
      next(err);
    }
  };

  update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = lyricIdParamSchema.parse(req.params);
      const dto = updateLyricSchema.parse(req.body);
      const updated = this.service.updateLyric(id, dto);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  remove = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = lyricIdParamSchema.parse(req.params);
      this.service.deleteLyric(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}