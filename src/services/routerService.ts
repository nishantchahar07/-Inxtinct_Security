import { z } from 'zod';
import { runWeatherTool } from '../tools/weatherTool';
import { runDatabaseTool } from '../tools/databaseTool';

const WeatherSchema = z.object({
  tool: z.literal('weather'),
  city: z.string().min(1),
});

const DatabaseSchema = z.object({
  tool: z.literal('database'),
  query: z.string().min(1),
});

const RoutingSchema = z.union([WeatherSchema, DatabaseSchema]);

export type RoutingInstruction = z.infer<typeof RoutingSchema>;

export async function routeWithMCP(routingJson: string): Promise<string> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(routingJson);
  } catch {
    throw Object.assign(new Error('I could not interpret the routing instructions.'), { statusCode: 400 });
  }

  const validation = RoutingSchema.safeParse(parsed);
  if (!validation.success) {
    throw Object.assign(new Error('I could not interpret the routing instructions.'), { statusCode: 400 });
  }

  const instruction = validation.data;

  if (instruction.tool === 'weather') {
    const sentence = await runWeatherTool(instruction.city);
    return sentence;
  }

  if (instruction.tool === 'database') {
    const sentence = await runDatabaseTool(instruction.query);
    return sentence;
  }

  throw Object.assign(new Error('I could not interpret the routing instructions.'), { statusCode: 400 });
}
