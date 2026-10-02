import 'dotenv/config'
import express from 'express'
import { Readable } from 'node:stream'
import { openai } from '@ai-sdk/openai'
import { convertToModelMessages, streamText, type UIMessage } from 'ai'

const app = express()
const port = Number(process.env.PORT ?? 8787)

app.use(express.json())

app.post('/api/chat', async (request, response) => {
  try {
    const { messages } = request.body as { messages: UIMessage[] }

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system:
        'You are a thoughtful assistant in a clean Vue and AI SDK starter app. Keep answers useful and concise.',
      messages: await convertToModelMessages(messages),
    })

    const streamResponse = result.toUIMessageStreamResponse()
    response.status(streamResponse.status)
    streamResponse.headers.forEach((value, key) => response.setHeader(key, value))
    if (!streamResponse.body) {
      response.end()
      return
    }
    Readable.fromWeb(streamResponse.body).pipe(response)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Unable to reach the AI provider.' })
  }
})

app.listen(port, () => {
  console.log(`AI server listening on http://localhost:${port}`)
})
