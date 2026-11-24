import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger';
import { errorHandler } from './middlewares/error-handler.middleware';
import lyricRoutes from './routes/lyric.routes';

const app = express();

// Evita bloqueio de scripts inline do Swagger UI no Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'lyrics-api' });
});

app.get('/docs.json', (_req, res) => {
  res.status(200).json(swaggerDocument);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/lyrics', lyricRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use(errorHandler);

export default app;