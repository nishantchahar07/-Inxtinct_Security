# Demo Script for Screen Recording

This script demonstrates the system with two queries.

## 1) Weather Query
- Request:
```
POST /api/query
{
  "message": "What's the weather in Delhi?"
}
```
- Narration: "The LLM routes to the weather tool. The MCP Router validates the JSON, the weather tool fetches real data from Open-Meteo, and we return a clean sentence."
- Expected Output (example):
```
{
  "answer": "The weather in Delhi is 28°C with scattered clouds."
}
```

## 2) Database Query
- Request:
```
POST /api/query
{
  "message": "How many employees joined last month?"
}
```
- Narration: "The LLM routes to the database tool. We translate the natural-language query into MongoDB queries and summarize in one sentence."
- Expected Output (example):
```
{
  "answer": "There are 3 employees who joined last month."
}
```
