// Portuguese grammatical gender for neighborhood names, plus the small text
// helpers used alongside them in bairro/listing copy. "Vila X" reads feminine
// ("na Vila Yara"), most others masculine ("no Tamboré").

const FEMININE_BAIRRO_FIRST_WORDS = new Set([
  'vila', 'aldeia', 'praia', 'rua', 'avenida', 'travessa', 'alameda', 'cruz',
  'conceição', 'conceicao', 'padroeira', 'bela', 'santa', 'chácara', 'chacara',
  'cidade',
])

function isFeminineBairroName(nome: string): boolean {
  const first = nome.trim().split(/\s+/)[0].toLowerCase()
  return FEMININE_BAIRRO_FIRST_WORDS.has(first)
}

export function emBairro(nome: string): 'no' | 'na' {
  return isFeminineBairroName(nome) ? 'na' : 'no'
}

export function deBairro(nome: string): 'do' | 'da' {
  return isFeminineBairroName(nome) ? 'da' : 'do'
}

export function sobreBairro(nome: string): 'sobre o' | 'sobre a' {
  return isFeminineBairroName(nome) ? 'sobre a' : 'sobre o'
}

export function articuloBairro(nome: string): 'o' | 'a' {
  return isFeminineBairroName(nome) ? 'a' : 'o'
}

export function aoBairro(nome: string): 'ao' | 'à' {
  return isFeminineBairroName(nome) ? 'à' : 'ao'
}

export function capitalize(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function pluralizeImoveis(count: number): { noun: string; adjective: string } {
  return count === 1
    ? { noun: 'imóvel', adjective: 'disponível' }
    : { noun: 'imóveis', adjective: 'disponíveis' }
}
