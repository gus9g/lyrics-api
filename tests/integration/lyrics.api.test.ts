import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lyrics-test-'));
process.env.DATABASE_PATH = path.join(tmpDir, 'test.sqlite');

const { default: app } = await import('../../src/app');
const { db, initDatabase } = await import('../../src/config/database');

initDatabase();

describe('Lyrics API (integration)', () => {
  beforeEach(() => {
    db.exec('DELETE FROM lyrics');
  });

  afterAll(() => {
    db.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('GET /health deve retornar 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'lyrics-api' });
  });

  it('POST -> GET -> PATCH -> DELETE deve executar o fluxo CRUD completo', async () => {
    // 1. Criar
    const createRes = await request(app).post('/api/lyrics').send({
      title: 'Tempo Perdido',
      artist: 'Legião Urbana',
      album: 'Dois',
      releaseYear: 1986,
      genre: 'Rock',
      language: 'pt',
      content: 'Todos os dias quando acordo...',
    });

    expect(createRes.status).toBe(201);
    expect(createRes.body.id).toBeTypeOf('number');
    expect(createRes.body.title).toBe('Tempo Perdido');

    const createdId = createRes.body.id;

    // 2. Buscar por ID
    const getRes = await request(app).get(`/api/lyrics/${createdId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.artist).toBe('Legião Urbana');

    // 3. Atualizar parcialmente
    const patchRes = await request(app)
      .patch(`/api/lyrics/${createdId}`)
      .send({ genre: 'Pós-Punk / Rock' });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.genre).toBe('Pós-Punk / Rock');

    // 4. Remover
    const deleteRes = await request(app).delete(`/api/lyrics/${createdId}`);
    expect(deleteRes.status).toBe(204);

    // 5. Confirmar 404 após remoção
    const afterDeleteRes = await request(app).get(`/api/lyrics/${createdId}`);
    expect(afterDeleteRes.status).toBe(404);
  });

  it('GET /api/lyrics deve filtrar por busca (q), artista e paginar resultados', async () => {
    await request(app).post('/api/lyrics').send({
      title: 'Pais e Filhos',
      artist: 'Legião Urbana',
      language: 'pt',
      content: 'Estátuas e cofres...',
    });
    await request(app).post('/api/lyrics').send({
      title: 'Wonderwall',
      artist: 'Oasis',
      language: 'en',
      content: 'Today is gonna be the day...',
    });

    const searchRes = await request(app).get('/api/lyrics?q=today');
    expect(searchRes.status).toBe(200);
    expect(searchRes.body.data).toHaveLength(1);
    expect(searchRes.body.data[0].title).toBe('Wonderwall');

    const pagedRes = await request(app).get('/api/lyrics?page=1&limit=1');
    expect(pagedRes.status).toBe(200);
    expect(pagedRes.body.data).toHaveLength(1);
    expect(pagedRes.body.pagination).toEqual({
      page: 1,
      limit: 1,
      total: 2,
      totalPages: 2,
    });
  });

  it('deve retornar 400 para payload inválido ou ID não numérico', async () => {
    const invalidBodyRes = await request(app).post('/api/lyrics').send({
      title: '',
    });
    expect(invalidBodyRes.status).toBe(400);
    expect(invalidBodyRes.body.error).toBe('Erro de validação');

    const invalidIdRes = await request(app).get('/api/lyrics/abc');
    expect(invalidIdRes.status).toBe(400);
  });

  it('deve cobrir /docs.json, rota 404 e erros 400 em query, update e delete', async () => {
    const docsRes = await request(app).get('/docs.json');
    expect(docsRes.status).toBe(200);
    expect(docsRes.body.openapi).toBe('3.0.3');

    const notFoundRoute = await request(app).get('/rota-inexistente');
    expect(notFoundRoute.status).toBe(404);
    expect(notFoundRoute.body).toEqual({ error: 'Rota não encontrada' });

    const invalidQuery = await request(app).get('/api/lyrics?page=0');
    expect(invalidQuery.status).toBe(400);

    const invalidUpdate = await request(app).patch('/api/lyrics/1').send({});
    expect(invalidUpdate.status).toBe(400);

    const invalidDelete = await request(app).delete('/api/lyrics/abc');
    expect(invalidDelete.status).toBe(400);
  });
});