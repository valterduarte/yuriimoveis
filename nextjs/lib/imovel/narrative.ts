import { emBairro } from '../bairroGrammar'
import type { Imovel } from '../../types'

export function buildSeoDescription(imovel: Imovel): string {
  if (imovel.descricao_seo) return imovel.descricao_seo.slice(0, 155)
  if (imovel.descricao) {
    return imovel.descricao
      .replace(/[\u{1F000}-\u{1FFFF}]|[\u2600-\u27FF]/gu, '')
      .replace(/\n/g, ' ')
      .slice(0, 155)
      .trim()
  }
  return `${imovel.titulo} em ${imovel.cidade || 'Osasco'}, SP. ${imovel.tipo === 'aluguel' ? 'Aluguel' : 'Venda'}.`
}

export function formatListingAge(createdAt: string | null | undefined): string | null {
  if (!createdAt) return null
  const created = new Date(createdAt)
  if (Number.isNaN(created.getTime())) return null

  const diffMs = Date.now() - created.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return null
  if (diffDays === 0) return 'Anunciado hoje'
  if (diffDays === 1) return 'Anunciado ontem'
  if (diffDays < 7) return `Anunciado há ${diffDays} dias`
  if (diffDays < 14) return 'Anunciado há 1 semana'
  if (diffDays < 30) return `Anunciado há ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 60) return 'Anunciado há 1 mês'
  if (diffDays < 365) return `Anunciado há ${Math.floor(diffDays / 30)} meses`
  return 'Anunciado há mais de 1 ano'
}

const CATEGORIA_SINGULAR: Record<string, string> = {
  apartamento: 'Apartamento',
  casa:        'Casa',
  terreno:     'Terreno',
  chale:       'Chalé',
  comercial:   'Imóvel comercial',
  chacara:     'Chácara',
}

const STATUS_NARRATIVE: Record<string, string> = {
  pronto:     'O imóvel está pronto para entrega imediata.',
  construcao: 'O empreendimento ainda está em fase de construção.',
  planta:     'O empreendimento está disponível na planta para reserva.',
}

function joinNatural(parts: string[]): string {
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[0]} e ${parts[1]}`
  return `${parts.slice(0, -1).join(', ')} e ${parts[parts.length - 1]}`
}

export function buildPropertyNarrative(imovel: Imovel): string {
  const categoria = CATEGORIA_SINGULAR[imovel.categoria] || 'Imóvel'
  const acao = imovel.tipo === 'aluguel' ? 'para alugar' : 'à venda'
  const prep = imovel.bairro ? emBairro(imovel.bairro) : 'em'
  const sentences: string[] = []

  const dorms = imovel.quartos > 0
    ? `de ${imovel.quartos} dormitório${imovel.quartos > 1 ? 's' : ''} `
    : ''
  const locale = imovel.bairro && imovel.cidade
    ? `${prep} ${imovel.bairro}, ${imovel.cidade}`
    : imovel.cidade
      ? `em ${imovel.cidade}`
      : ''
  sentences.push(`${categoria} ${dorms}${acao}${locale ? ' ' + locale : ''}.`.replace(/\s+/g, ' '))

  const specs: string[] = []
  if (imovel.area > 0)      specs.push(`${imovel.area} m² de área`)
  if (imovel.banheiros > 0) specs.push(`${imovel.banheiros} banheiro${imovel.banheiros > 1 ? 's' : ''}`)
  if (imovel.vagas > 0)     specs.push(`${imovel.vagas} vaga${imovel.vagas > 1 ? 's' : ''} de garagem`)
  if (specs.length > 0) sentences.push(`Conta com ${joinNatural(specs)}.`)

  const statusSentence = imovel.status ? STATUS_NARRATIVE[imovel.status] : undefined
  if (statusSentence) sentences.push(statusSentence)

  const diferenciais = (imovel.diferenciais || []).slice(0, 5).map(d => d.toLowerCase())
  if (diferenciais.length > 0) {
    sentences.push(`Entre os diferenciais do empreendimento estão ${joinNatural(diferenciais)}.`)
  }

  return sentences.join(' ')
}
