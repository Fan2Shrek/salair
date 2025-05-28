export function parseFrontmatter(markdown: string): Record<string, string> {
  const lines = markdown.split('\n')

  if (lines[0].trim() !== '---') {
    throw new Error('Frontmatter manquant')
  }

  const frontmatterLines: string[] = []
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') break
    frontmatterLines.push(lines[i])
  }

  const result: Record<string, string> = {}

  for (const line of frontmatterLines) {
    const [key, ...rest] = line.split(':')
    const value = rest.join(':').trim().replace(/^"|"$/g, '')
    result[key.trim()] = value
  }

  return result
}
