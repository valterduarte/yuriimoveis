import { PHONE_WA_BASE } from '../config'

/**
 * A qualified lead captured by the assistant. Every field is optional because
 * the conversation may end early — we still want to hand off whatever we have.
 */
export interface LeadInfo {
  nome?: string
  telefone?: string
  intencao?: 'comprar' | 'alugar' | string
  tipoImovel?: string
  regiao?: string
  orcamento?: string
  financiamento?: string
  prazo?: string
  motivacao?: string
  querVisita?: boolean
  imovelTitulo?: string
  imovelId?: number
  observacoes?: string
}

function clean(value?: string): string {
  return (value ?? '').trim()
}

/**
 * Human-readable, structured summary of the lead. Stored on the `contatos`
 * row so the agent has full context in the admin inbox even if the WhatsApp
 * handoff is never opened.
 */
export function buildLeadSummary(lead: LeadInfo): string {
  const lines: string[] = []
  const add = (label: string, value?: string) => {
    if (clean(value)) lines.push(`${label}: ${clean(value)}`)
  }

  add('Interesse', lead.intencao === 'alugar' ? 'Alugar' : lead.intencao === 'comprar' ? 'Comprar' : lead.intencao)
  add('Tipo de imóvel', lead.tipoImovel)
  add('Região', lead.regiao)
  add('Orçamento', lead.orcamento)
  add('Financiamento', lead.financiamento)
  add('Prazo para mudar', lead.prazo)
  add('Motivo', lead.motivacao)
  if (clean(lead.imovelTitulo)) {
    lines.push(`Imóvel de interesse: ${clean(lead.imovelTitulo)}${lead.imovelId ? ` (#${lead.imovelId})` : ''}`)
  }
  if (lead.querVisita) lines.push('Quer agendar visita: Sim')
  add('Observações', lead.observacoes)

  return lines.length > 0
    ? `Lead qualificado pelo atendente virtual.\n\n${lines.join('\n')}`
    : 'Lead iniciado pelo atendente virtual (qualificação incompleta).'
}

/**
 * First-person WhatsApp message the lead sends to the agent, pre-filled so the
 * conversation arrives warm and contextual instead of a cold "tem esse imóvel?".
 */
export function buildHandoffMessage(lead: LeadInfo): string {
  const parts: string[] = []
  const nome = clean(lead.nome)
  parts.push(nome ? `Olá Yuri! Sou ${nome}.` : 'Olá Yuri!')

  const acao = lead.intencao === 'alugar' ? 'alugar' : 'comprar'
  const tipo = clean(lead.tipoImovel)
  const regiao = clean(lead.regiao)
  if (tipo || regiao) {
    parts.push(`Quero ${acao}${tipo ? ` ${tipo}` : ' um imóvel'}${regiao ? ` em ${regiao}` : ''}.`)
  } else {
    parts.push(`Quero ${acao} um imóvel.`)
  }

  if (clean(lead.orcamento)) parts.push(`Orçamento: ${clean(lead.orcamento)}.`)
  if (clean(lead.financiamento)) parts.push(`Financiamento: ${clean(lead.financiamento)}.`)
  if (clean(lead.prazo)) parts.push(`Prazo para mudar: ${clean(lead.prazo)}.`)
  if (clean(lead.motivacao)) parts.push(`Motivo: ${clean(lead.motivacao)}.`)
  const imovel = clean(lead.imovelTitulo)
  if (imovel) {
    const ref = `${imovel}${lead.imovelId ? ` (#${lead.imovelId})` : ''}`
    parts.push(lead.querVisita
      ? `Quero agendar uma visita ao imóvel: ${ref}.`
      : `Tenho interesse no imóvel: ${ref}.`)
  } else if (lead.querVisita) {
    parts.push('Quero agendar uma visita.')
  }
  if (clean(lead.telefone)) parts.push(`Meu telefone: ${clean(lead.telefone)}.`)

  return parts.join(' ')
}

/** wa.me deep link to the agent's number with the handoff message pre-filled. */
export function buildWhatsAppHandoff(lead: LeadInfo): string {
  return `${PHONE_WA_BASE}?text=${encodeURIComponent(buildHandoffMessage(lead))}`
}
