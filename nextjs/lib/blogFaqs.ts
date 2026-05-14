export interface BlogFaqEntry {
  question: string
  answer: string
}

const FAQ_SECTION_PATTERN = /<h2[^>]*>\s*Perguntas frequentes[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/i
const FAQ_ITEM_PATTERN = /<p>\s*<strong>([^<]+?)<\/strong>\s*<br\s*\/?>\s*([\s\S]*?)<\/p>/gi

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

export function extractFaqsFromHtml(html: string): BlogFaqEntry[] {
  if (!html) return []
  const section = html.match(FAQ_SECTION_PATTERN)
  if (!section) return []
  const block = section[1]
  const entries: BlogFaqEntry[] = []
  let match: RegExpExecArray | null
  FAQ_ITEM_PATTERN.lastIndex = 0
  while ((match = FAQ_ITEM_PATTERN.exec(block)) !== null) {
    const question = stripTags(match[1]).replace(/\?\s*$/, '?').trim()
    const answer = stripTags(match[2])
    if (question && answer) entries.push({ question, answer })
  }
  return entries
}
