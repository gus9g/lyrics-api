import 'dotenv/config';
import app from './app';
import { initDatabase } from './config/database';

const PORT = Number(process.env.PORT) || 3001;

initDatabase();

app.listen(PORT, () => {
  console.log(`Lyrics API rodando em http://localhost:${PORT}`);
});