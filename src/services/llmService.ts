import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set.');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: modelName,
});

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

export async function getRoutingInstructions(userMessage: string): Promise<string> {
  const input = `${SYSTEM_PROMPT}\nUser: ${userMessage}`;
  const response = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: input }] }],
    generationConfig: {
      temperature: 0,
      responseMimeType: 'application/json',
    },
  });
  const text = response.response.text();
  return text;
}
