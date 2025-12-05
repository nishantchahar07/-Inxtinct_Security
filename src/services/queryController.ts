import { Request, Response, NextFunction } from 'express';
import { getRoutingInstructions } from './llmService';
import { routeWithMCP } from './routerService';
import { toSingleSentence } from '../utils/format';

export async function handleQuery(req: Request, res: Response, next: NextFunction) {
  try {
    const message = (req.body?.message ?? '').toString();
    if (!message || message.trim().length === 0) {
      throw Object.assign(new Error('Please provide a valid question.'), { statusCode: 400 });
    }

    const routingJson = await getRoutingInstructions(message);
    const toolResult = await routeWithMCP(routingJson);

    const finalSentence = toSingleSentence(toolResult);
    res.json({ answer: finalSentence });
  } catch (err) {
    next(err);
  }
}
