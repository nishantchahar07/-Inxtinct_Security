import dotenv from 'dotenv';

// Load environment variables as early as possible
dotenv.config();

function getNumber(name: string, def?: number): number | undefined {
  const v = process.env[name];
  if (v == null || v.trim() === '') return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

export const PORT = getNumber('PORT', 3000) as number;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
export const MONGODB_URI = process.env.MONGODB_URI ?? '';
