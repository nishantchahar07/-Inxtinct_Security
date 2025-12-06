# AI Routing System — LLM → MCP Router → Tools → English Answer

A production-ready Node.js + TypeScript backend that accepts a natural-language query and returns a single clean English sentence by routing via an LLM, an MCP Router, and either a Weather Tool or Database Tool.

## High-Level Architecture
LLM → MCP Router → Tool (Weather | Database) → One English sentence

- LLM (Gemini): Receives the user message and returns JSON routing instructions only.
- MCP Router: Validates and interprets the JSON to decide which tool to call.
- Tools: Weather (Open-Meteo) or Database (MongoDB via Mongoose) to compute the answer.
- Response: A single human-readable English sentence with no debug or raw data.

## Features
- Single endpoint: POST /api/query
- Strict LLM system prompt to return JSON only
- Zod-validated MCP Router rejects malformed or unknown tool outputs
- Weather Tool: Real-time weather via Open-Meteo
- Database Tool: Employees dataset with multiple query capabilities
- Fully typed TypeScript; no any
- Clean separation of concerns: services, tools, utils, lib, types
- Single-sentence responses, no debug logs

## Technology Stack
- Node.js 20 LTS
- Express
- TypeScript
- Google Gemini SDK (@google/generative-ai)
- MongoDB with Mongoose ORM
- Zod for schema validation

## Folder Structure
```
.
├─ .env (local)
├─ .gitignore
├─ package.json
├─ tsconfig.json
├─ README.md
├─ DEMO.md
└─ src/
   ├─ index.ts                (Express server bootstrap and global error handler)
   ├─ routes/
   │  └─ queryRoute.ts        (POST /api/query router)
   ├─ services/
   │  ├─ queryController.ts   (Endpoint controller)
   │  ├─ llmService.ts        (Calls Gemini LLM with strict system prompt)
   │  └─ routerService.ts     (MCP Router: validates and routes to tools)
   ├─ tools/
   │  ├─ weatherTool.ts       (Open-Meteo geocoding + current weather)
   │  └─ databaseTool.ts      (MongoDB employees queries from NL)
   ├─ utils/
   │  ├─ dates.ts             (Date helpers)
   │  └─ format.ts            (Single-sentence formatter)
   ├─ lib/
   │  └─ db.ts                (MongoDB connection + seed if empty)
   └─ types/
      ├─ models.ts            (Domain interfaces)
      └─ mongooseModels.ts    (Mongoose models & types)
```

## Environment Variables
Ensure a `.env` file exists with the following keys:

- PORT=3000
- GEMINI_API_KEY=AIza-...
- GEMINI_MODEL=gemini-1.5-flash
- MONGODB_URI=mongodb://localhost:27017/ai_routing_system

## Installation & Local Setup
```
npm install
# ensure .env is present and has valid values
npm run dev
```
MongoDB must be running and accessible through `MONGODB_URI`.

## Seeding Instructions
The server seeds employees automatically on startup if the collection is empty. Alternatively, run:
```
npm run seed
```

## Running
- Development: `npm run dev`
- Production: `npm run build && npm start`

## API Specifications
Endpoint: POST /api/query

Request body:
```
{
  "message": "natural language question from user"
}
```
Response body (strict):
```
{
  "answer": "final English explanation only"
}
```

### Example Requests
- Weather
```
curl -X POST http://localhost:3000/api/query \
  -H 'Content-Type: application/json' \
  -d '{"message":"What is the weather in Delhi?"}'
```
Possible response:
```
{ "answer": "The weather in Delhi is 28°C with scattered clouds." }
```

- Database
```
curl -X POST http://localhost:3000/api/query \
  -H 'Content-Type: application/json' \
  -d '{"message":"How many employees joined last month?"}'
```
Possible response:
```
{ "answer": "There are 3 employees who joined last month." }
```

## How LLM Routing Works
- The system prompt forces the LLM to respond with a pure JSON object and no prose.
- The MCP Router parses JSON strictly; malformed JSON or unknown tools are rejected.
- Valid instructions are routed to either the weather or database tool.

## Weather Tool
- Resolves city via Open-Meteo Geocoding API and fetches current weather.
- Returns a single sentence such as: “The weather in Delhi is 28°C with scattered clouds.”
- If the city cannot be resolved or weather fails to load, returns a single-sentence error.

## Database Tool
- MongoDB Employees dataset with meaningful seed data.
- Supports:
  - “How many employees joined last month?”
  - “How many employees joined this month?”
  - “List employees in the <department> department”
  - “Count employees in <city>”
  - “Average salary in the <department> department”
- Returns a single English sentence summary for each query.

## Error Handling
- Global handler ensures the API always returns `{ "answer": "..." }` with one sentence.
- MCP Router errors return a single-line English message, not stack traces or debug info.

## Screenshots / Demo
- See `DEMO.md` for a short script you can use to record a demo.

## Notes, Limitations, and Future Improvements
- The NL-to-DB is pattern-based and limited; could be expanded with a semantic parser.
- Add caching for weather results.
- Consider adding rate limiting and request validation for the public endpoint.
- Add tests and CI for build/format/lint.
