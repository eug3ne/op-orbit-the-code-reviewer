export const reviewModes = ['quick', 'thorough', 'security', 'performance'] as const

export type ReviewMode = (typeof reviewModes)[number]

export type ReviewRequest = {
  filename: string
  code: string
  mode: ReviewMode
}

export type ReviewIssue = {
  type: string
  location: string
  problem: string
  fix: string
  priority: 'high' | 'medium' | 'low'
}

export type ReviewResult = {
  filename: string
  language: string
  mode: ReviewMode
  summary: string
  issues: ReviewIssue[]
  timestamp: string
}
