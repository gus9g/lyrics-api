import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const createLyricSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório').max(150),
  artist: z.string().trim().min(1, 'Artista é obrigatório').max(150),
  album: z.string().trim().max(150).nullable().optional(),
  releaseYear: z
    .number()
    .int()
    .min(1850, 'Ano de lançamento inválido')
    .max(currentYear + 1, 'Ano de lançamento não pode ser no futuro')
    .nullable()
    .optional(),
  genre: z.string().trim().max(80).nullable().optional(),
  language: z.string().trim().min(2).max(10).default('pt'),
  content: z.string().trim().min(1, 'Letra da música é obrigatória'),
});

export const updateLyricSchema = createLyricSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Informe ao menos um campo para atualização' }
);

export const lyricIdParamSchema = z.object({
  id: z.coerce.number().int().positive('ID deve ser um número inteiro positivo'),
});

export const listLyricsQuerySchema = z.object({
  q: z.string().trim().optional(),
  artist: z.string().trim().optional(),
  language: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateLyricDTO = z.infer<typeof createLyricSchema>;
export type UpdateLyricDTO = z.infer<typeof updateLyricSchema>;
export type ListLyricsQueryDTO = z.infer<typeof listLyricsQuerySchema>;