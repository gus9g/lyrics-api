import { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { errorHandler } from '../../../src/middlewares/error-handler.middleware';

describe('errorHandler middleware (unit)', () => {
  it('deve retornar 500 para erros genéricos não tratados', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response;

    errorHandler(new Error('Falha inesperada'), {} as Request, res, vi.fn() as NextFunction);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
    consoleSpy.mockRestore();
  });
});