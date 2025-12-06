import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, GEMINI_MODEL } from '../config/env';

let model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

function getModel() {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set.');
  }
  if (!model) {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  }
  return model;
}

const SYSTEM_PROMPT = `You must decide ONLY which tool to call by returning a pure JSON object with no explanation.
Example schema:
{
  "tool": "weather",
  "city": "San Francisco"
}
OR
{
  "tool": "database",
  "query": "count employees joined last month"
}
Return ONLY JSON. No English sentence.`;

function fallbackRouting(userMessage: string): string {
  const msg = (userMessage || '').toLowerCase();
  const weatherMatch = msg.match(/weather\s+(in|at)\s+([a-zA-Z\s]+)\??$/);
  if (weatherMatch) {
    const city = weatherMatch[2].trim();
    return JSON.stringify({ tool: 'weather', city });
  }
  // crude detection for DB queries
  if (/(employee|employees|salary|department|joined)/.test(msg)) {
    return JSON.stringify({ tool: 'database', query: userMessage });
  }
  // default to weather if it looks like a location
  if (/in\s+[a-zA-Z\s]+\??$/.test(msg)) {
    const city = msg.replace(/^.*in\s+/, '').replace(/\?+$/, '');
    return JSON.stringify({ tool: 'weather', city });
  }
  // last resort
  return JSON.stringify({ tool: 'database', query: userMessage });
}

export async function getRoutingInstructions(userMessage: string): Promise<string> {
  // If no GEMINI_API_KEY, use a simple deterministic router
  if (!GEMINI_API_KEY) {
    return fallbackRouting(userMessage);
  }

  const input = `${SYSTEM_PROMPT}\nUser: ${userMessage}`;
  try {
    const response = await getModel().generateContent({
      contents: [{ role: 'user', parts: [{ text: input }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: 'application/json',
      },
    });
    const text = response.response.text();
    return text;
  } catch (err) {
    // On any LLM error (e.g., invalid API key), fall back silently to deterministic routing
    console.warn('LLM unavailable, falling back to deterministic routing.');
    return fallbackRouting(userMessage);
  }
}
