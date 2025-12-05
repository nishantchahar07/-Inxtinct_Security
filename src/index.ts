import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { connect } from './lib/db';
import queryRouter from './routes/queryRoute';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', queryRouter);

interface HttpError extends Error { statusCode?: number }
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const e = err as HttpError | undefined;
  const message = typeof e?.message === 'string' && e.message.trim().length > 0
    ? e.message
    : 'An unexpected error occurred.';
  const status = (e && typeof e.statusCode === 'number' ? e.statusCode : 400);
  res.status(status).json({ answer: sanitizeSentence(message) });
});

function sanitizeSentence(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

const PORT = Number(process.env.PORT || 3000);

connect().then(() => {
  app.listen(PORT);
}).catch(() => {
  process.exit(1);
});
