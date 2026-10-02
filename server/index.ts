import 'dotenv/config'
import express from 'express'
import { randomUUID } from 'node:crypto'
import { reviewConfigs } from './review/config.js'
import { supportedExtensions, detectLanguage } from './review/language.js'
import { reviewCode } from './review/reviewer.js'
import { reviewModes, type ReviewMode } from './review/types.js'

const app = express()
const port = Number(process.env.PORT ?? 8787)

app.use(express.json({ limit: '200kb' }))

app.post('/api/review', async (request, response) => {
  try {
    const { filename, code, mode } = request.body as {
      filename?: unknown
      code?: unknown
      mode?: unknown
    }

    if (typeof filename !== 'string' || !filename.trim()) {
      response.status(400).json({ error: 'A filename is required.' })
      return
    }
    if (typeof code !== 'string' || !code.trim()) {
      response.status(400).json({ error: 'Source code is required.' })
      return
    }
    if (code.length > 150_000) {
      response.status(413).json({ error: 'Source code must be smaller than 150 KB.' })
      return
    }
    if (!reviewModes.includes(mode as ReviewMode)) {
      response.status(400).json({ error: 'Choose a valid review mode.' })
      return
    }
    if (!detectLanguage(filename)) {
      response.status(400).json({
        error: `Unsupported file type. Use one of: ${supportedExtensions.join(', ')}`,
      })
      return
    }

    const sessionId = request.header('x-opencode-session') ?? randomUUID()
    const result = await reviewCode(filename.trim(), code, mode as ReviewMode, sessionId)
    response.json(result)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Unable to reach the AI provider.' })
  }
})

app.get('/api/review-modes', (_request, response) => response.json(reviewConfigs))

app.listen(port, () => {
  console.log(`AI server listening on http://localhost:${port}`)
})
