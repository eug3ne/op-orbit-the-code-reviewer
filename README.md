# Orbit

A Vue 3 + Vite code-review workspace powered by the AI SDK.

## Requirements

- Node.js 22+
- An OpenAI API key

## Run locally

```bash
nvm use
npm install
cp .env.example .env
# add your OPENAI_API_KEY to .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite client proxies `/api` requests to the Express server on port 8787.

The review workflow uses `generateObject` with a typed review schema. Review modes and language detection live in `server/review/`, while the Vue client handles file input, code editing, and issue presentation.

## Production build

```bash
npm run build
npm run start
```
