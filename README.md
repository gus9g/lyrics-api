# Lyrics API

API RESTful para gerenciamento de letras de músicas construída com **Node.js**, **TypeScript**, **Express** e **SQLite** (`better-sqlite3`), seguindo arquitetura em camadas (**Model**, **DTO**, **Repository**, **Service**, **Controller** e **Routes**), documentação interativa via **Swagger/OpenAPI 3.0**, testes unitários e de integração com **Vitest** e **Supertest**, e pipeline de **CI** no **GitHub Actions**.

---

## Tecnologias

- **Runtime & Linguagem:** Node.js, TypeScript
- **Framework HTTP:** Express
- **Banco de Dados:** SQLite (`better-sqlite3` com modo WAL)
- **Validação:** Zod
- **Documentação:** Swagger UI (`swagger-ui-express` + OpenAPI 3.0.3)
- **Testes & Cobertura:** Vitest, Supertest, `@vitest/coverage-v8`
- **Segurança & Utilitários:** Helmet, CORS, dotenv

---

## Arquitetura do Projeto

```text
lyrics-api/
├── .github/
│   └── workflows/
│       └── ci.yml
├── data/
│   └── lyrics.sqlite
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── swagger.ts
│   ├── controllers/
│   │   └── lyric.controller.ts
│   ├── dtos/
│   │   └── lyric.dto.ts
│   ├── middlewares/
│   │   └── error-handler.middleware.ts
│   ├── models/
│   │   └── lyric.model.ts
│   ├── repositories/
│   │   └── lyric.repository.ts
│   ├── routes/
│   │   └── lyric.routes.ts
│   ├── services/
│   │   └── lyric.service.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── integration/
│   │   └── lyrics.api.test.ts
│   └── unit/
│       ├── middlewares/
│       │   └── error-handler.middleware.test.ts
│       ├── dtos/
│       │   └── lyric.dto.test.ts
│       ├── repositories/
│       │   └── lyric.repository.test.ts
│       └── services/
│           └── lyric.service.test.ts
├── package.json
├── tsconfig.json
└── README.md