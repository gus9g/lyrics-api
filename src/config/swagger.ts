import { OpenAPIV3 } from 'openapi-types';

export const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Lyrics API',
    version: '1.0.0',
    description:
      'API RESTful para gerenciamento de letras de músicas com SQLite e arquitetura em camadas (Model, DTO, Repository, Service, Controller e Routes).',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local de desenvolvimento',
    },
  ],
  tags: [
    { name: 'Health', description: 'Status da aplicação' },
    { name: 'Lyrics', description: 'Operações CRUD e busca de letras de músicas' },
  ],
  components: {
    schemas: {
      Lyric: {
        type: 'object',
        required: ['id', 'title', 'artist', 'language', 'content', 'createdAt', 'updatedAt'],
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Aquarela' },
          artist: { type: 'string', example: 'Toquinho' },
          album: { type: 'string', nullable: true, example: 'Aquarela' },
          releaseYear: { type: 'integer', nullable: true, example: 1983 },
          genre: { type: 'string', nullable: true, example: 'MPB' },
          language: { type: 'string', example: 'pt' },
          content: {
            type: 'string',
            example: 'Numa folha qualquer eu desenho um sol amarelo...',
          },
          createdAt: { type: 'string', example: '2026-11-24 17:00:00' },
          updatedAt: { type: 'string', example: '2026-11-24 17:00:00' },
        },
      },
      CreateLyricInput: {
        type: 'object',
        required: ['title', 'artist', 'content'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 150, example: 'Aquarela' },
          artist: { type: 'string', minLength: 1, maxLength: 150, example: 'Toquinho' },
          album: { type: 'string', maxLength: 150, nullable: true, example: 'Aquarela' },
          releaseYear: {
            type: 'integer',
            minimum: 1850,
            maximum: 2027,
            nullable: true,
            example: 1983,
          },
          genre: { type: 'string', maxLength: 80, nullable: true, example: 'MPB' },
          language: { type: 'string', minLength: 2, maxLength: 10, default: 'pt', example: 'pt' },
          content: {
            type: 'string',
            minLength: 1,
            example: 'Numa folha qualquer eu desenho um sol amarelo...',
          },
        },
      },
      UpdateLyricInput: {
        type: 'object',
        description: 'Informe ao menos um campo para atualização',
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 150, example: 'Aquarela (Ao Vivo)' },
          artist: { type: 'string', minLength: 1, maxLength: 150, example: 'Toquinho' },
          album: { type: 'string', maxLength: 150, nullable: true, example: 'Aquarela' },
          releaseYear: {
            type: 'integer',
            minimum: 1850,
            maximum: 2027,
            nullable: true,
            example: 1983,
          },
          genre: { type: 'string', maxLength: 80, nullable: true, example: 'MPB Clássica' },
          language: { type: 'string', minLength: 2, maxLength: 10, example: 'pt' },
          content: { type: 'string', minLength: 1, example: 'Letra atualizada...' },
        },
      },
      PaginatedLyricsResponse: {
        type: 'object',
        required: ['data', 'pagination'],
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Lyric' },
          },
          pagination: {
            type: 'object',
            required: ['page', 'limit', 'total', 'totalPages'],
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 10 },
              total: { type: 'integer', example: 1 },
              totalPages: { type: 'integer', example: 1 },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: { type: 'string', example: 'Letra com id 99 não encontrada' },
        },
      },
      ValidationErrorResponse: {
        type: 'object',
        required: ['error', 'details'],
        properties: {
          error: { type: 'string', example: 'Erro de validação' },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'title' },
                message: { type: 'string', example: 'Título é obrigatório' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica se a API está online',
        responses: {
          '200': {
            description: 'Serviço saudável',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    service: { type: 'string', example: 'lyrics-api' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/lyrics': {
      post: {
        tags: ['Lyrics'],
        summary: 'Cria uma nova letra de música',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateLyricInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Letra criada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Lyric' },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Lyrics'],
        summary: 'Lista letras com filtros e paginação',
        parameters: [
          {
            name: 'q',
            in: 'query',
            description: 'Busca em título, artista ou letra',
            schema: { type: 'string' },
          },
          {
            name: 'artist',
            in: 'query',
            description: 'Filtra por nome do artista',
            schema: { type: 'string' },
          },
          {
            name: 'language',
            in: 'query',
            description: 'Filtra por código de idioma (ex: pt, en)',
            schema: { type: 'string' },
          },
          {
            name: 'page',
            in: 'query',
            description: 'Número da página (padrão: 1)',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Itens por página (padrão: 10, máx: 100)',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          },
        ],
        responses: {
          '200': {
            description: 'Lista paginada de letras',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedLyricsResponse' },
              },
            },
          },
          '400': {
            description: 'Parâmetros de consulta inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/lyrics/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID numérico da letra',
          schema: { type: 'integer', minimum: 1 },
        },
      ],
      get: {
        tags: ['Lyrics'],
        summary: 'Busca uma letra pelo ID',
        responses: {
          '200': {
            description: 'Letra encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Lyric' },
              },
            },
          },
          '400': {
            description: 'ID inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Letra não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Lyrics'],
        summary: 'Atualiza uma letra',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateLyricInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Letra atualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Lyric' },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Letra não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Lyrics'],
        summary: 'Atualiza parcialmente uma letra',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateLyricInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Letra atualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Lyric' },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Letra não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Lyrics'],
        summary: 'Remove uma letra pelo ID',
        responses: {
          '204': {
            description: 'Letra removida com sucesso',
          },
          '400': {
            description: 'ID inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Letra não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};