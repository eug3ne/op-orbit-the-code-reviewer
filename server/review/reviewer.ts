import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { reviewConfigs } from './config.js'
import { detectLanguage } from './language.js'
import type { ReviewMode, ReviewResult } from './types.js'

const reviewSchema = z.object({
  summary: z.string().describe('A concise summary of the most important findings.'),
  issues: z.array(
    z.object({
      type: z.string().describe('Bug, security, performance, quality, or testing'),
      location: z.string().describe('Line number, block, or function name'),
      problem: z.string(),
      fix: z.string().describe('A specific, actionable recommendation'),
      priority: z.enum(['high', 'medium', 'low']),
    }),
  ),
})

export async function reviewCode(
  filename: string,
  code: string,
  mode: ReviewMode,
  sessionId: string,
): Promise<ReviewResult> {
  const language = detectLanguage(filename)
  if (!language) throw new Error('Unsupported file type')

  const config = reviewConfigs[mode]
  const opencode = createOpenAI({
    apiKey: process.env.OPENCODE_API_KEY,
    baseURL: process.env.OPENCODE_BASE_URL ?? 'https://opencode.ai/zen/go/v1',
    headers: {
      'User-Agent': 'orbit-code-review/1.0',
      'x-opencode-session': sessionId,
    },
  })

  const { object } = await generateObject({
    model: opencode.responses(process.env.OPENCODE_MODEL ?? config.model),
    schema: reviewSchema,
    maxOutputTokens: config.maxOutputTokens,
    system:
      'You are an expert code reviewer. Review only the supplied source code. Do not invent issues. Give specific, actionable feedback and use the requested priority levels.',
    prompt: `Review this ${language} code with emphasis on ${config.focus}.

Check for:
1. Bugs and logic issues
2. Performance concerns
3. Security issues
4. Code quality and maintainability
5. Testing gaps

Return only the structured review. If the code has no meaningful issue, return an empty issues list and say so in the summary.

Filename: ${filename}
Source code:
<source>
${code}
</source>`,
  })

  return {
    filename,
    language,
    mode,
    summary: object.summary,
    issues: object.issues,
    timestamp: new Date().toISOString(),
  }
}
