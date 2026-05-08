const LOWERCASE_WORDS = new Set([
  'de', 'da', 'do', 'dos', 'das',
  'e', 'em', 'na', 'no', 'a', 'o',
])

export function stripDiacritics(input: string): string {
  return input.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function titleCaseWord(word: string, isFirst: boolean): string {
  if (!word) return word
  if (!isFirst && LOWERCASE_WORDS.has(word)) return word
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function normalizeBairro(input: string): string {
  if (!input) return ''
  const cleaned = input.trim().replace(/\s+/g, ' ')
  if (!cleaned) return ''
  return cleaned
    .toLowerCase()
    .split(' ')
    .map((word, i) => titleCaseWord(word, i === 0))
    .join(' ')
}

export function normalizeCidade(input: string): string {
  return normalizeBairro(input)
}
