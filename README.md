# Orbit

A Vue 3 + Vite starter for streaming chat with the AI SDK.

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

The server route in `server/index.ts` uses `streamText` and `toUIMessageStreamResponse`; the Vue client uses `useChat` from `@ai-sdk/vue`.

## Production build

```bash
npm run build
npm run start
```
