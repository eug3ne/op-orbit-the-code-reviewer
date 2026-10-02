const languages: Record<string, string> = {
  '.js': 'JavaScript',
  '.ts': 'TypeScript',
  '.jsx': 'React JSX',
  '.tsx': 'React TSX',
  '.vue': 'Vue SFC',
  '.py': 'Python',
  '.go': 'Go',
  '.rs': 'Rust',
  '.java': 'Java',
}

export const supportedExtensions = Object.keys(languages)

export function detectLanguage(filename: string) {
  const extension = filename.slice(filename.lastIndexOf('.')).toLowerCase()
  return languages[extension] ?? null
}
