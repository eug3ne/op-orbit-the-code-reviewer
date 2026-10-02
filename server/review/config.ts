import type { ReviewMode } from './types.js'

export const reviewConfigs: Record<ReviewMode, { model: string; maxOutputTokens: number; focus: string }> = {
  quick: {
    model: 'gpt-4o-mini',
    maxOutputTokens: 1200,
    focus: 'bugs and obvious issues',
  },
  thorough: {
    model: 'gpt-4o',
    maxOutputTokens: 3000,
    focus: 'architecture, maintainability, bugs, and code quality',
  },
  security: {
    model: 'gpt-4o',
    maxOutputTokens: 2200,
    focus: 'security vulnerabilities, unsafe input handling, and data exposure',
  },
  performance: {
    model: 'gpt-4o',
    maxOutputTokens: 2200,
    focus: 'performance bottlenecks, unnecessary work, and resource usage',
  },
}
