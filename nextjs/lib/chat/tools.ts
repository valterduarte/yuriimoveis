import { tool } from 'ai'
import { z } from 'zod'
import { fetchProperties } from '../properties'
import { getDb } from '../db'
import { SITE_URL } from '../config'
import { normalizeCidade } from '../textNormalization'
import {
  detectCreditProgram,
  calculateSacFinancing,
  MIN_DOWN_PAYMENT_RATE,
} from '../financiamento'
import { imovelSlug, calcParcela, formatPrice } from '../../utils/imovelUtils'
import { formatBRLInteger } from '../formatters'
import { buildLeadSummary, buildWhatsAppHandoff, type LeadInfo } from './leadHandoff'

const FINANCING_TERM_MONTHS = 360
const MAX_RESULTS = 3

/** Search the agent's real listings. The model must call this before quoting anything. */
const buscarImoveis = tool({
  description:
    'Busca imóveis reais no acervo do Yuri. Use sempre antes de citar qualquer imóvel, preço ou disponibilidade. Retorna no máximo 3 opções com link.',
  inputSchema: z.object({
    intencao: z.enum(['comprar', 'alugar']).describe('Se a pessoa quer comprar ou alugar'),
    categoria: z
      .enum(['casa', 'apartamento', 'terreno', 'chale', 'comercial', 'chacara'])
      .optional()
      .describe('Tipo de imóvel, se a pessoa especificou'),
    cidade: z.string().optional().describe('Cidade de interesse (ex: Osasco, Barueri, Carapicuíba)'),
    bairro: z.string().optional().describe('Bairro de interesse'),
    precoMax: z.number().optional().describe('Orçamento máximo em reais'),
    quartosMin: z.number().int().optional().describe('Número mínimo de quartos'),
  }),
  execute: async ({ intencao, categoria, cidade, bairro, precoMax, quartosMin }) => {
    const result = await fetchProperties({
      tipo: intencao === 'alugar' ? 'aluguel' : 'venda',
      categoria,
      cidade: cidade ? normalizeCidade(cidade) : undefined,
      bairro,
      precoMax: precoMax ? String(precoMax) : undefined,
      quartos: quartosMin ? String(quartosMin) : undefined,
      limit: MAX_RESULTS,
    })

    return {
      total: result.total,
      imoveis: result.imoveis.map(i => ({
        id: i.id,
        titulo: i.titulo,
        preco: i.preco,
        precoFormatado: formatPrice(i.preco, i.tipo),
        quartos: i.quartos,
        banheiros: i.banheiros,
        vagas: i.vagas,
        area: i.area,
        bairro: i.bairro,
        cidade: i.cidade,
        parcelaEstimada: i.tipo === 'venda' ? calcParcela(i.preco) : null,
        url: `${SITE_URL}/imoveis/${imovelSlug(i)}`,
      })),
    }
  },
})

/** Estimate the monthly installment and likely credit program (incl. MCMV). */
const estimarFinanciamento = tool({
  description:
    'Estima a parcela mensal e a faixa de crédito (incluindo Minha Casa Minha Vida) a partir do valor do imóvel e da renda mensal. Prazos sempre em meses.',
  inputSchema: z.object({
    valorImovel: z.number().describe('Valor do imóvel em reais'),
    rendaMensal: z.number().describe('Renda mensal bruta familiar em reais'),
    entrada: z.number().optional().describe('Entrada disponível em reais, se informada'),
  }),
  execute: async ({ valorImovel, rendaMensal, entrada }) => {
    const program = detectCreditProgram(valorImovel, rendaMensal)
    const downPayment = entrada && entrada > 0 ? entrada : valorImovel * MIN_DOWN_PAYMENT_RATE
    const sim = calculateSacFinancing({
      propertyValue: valorImovel,
      downPayment,
      termMonths: FINANCING_TERM_MONTHS,
      annualInterestRate: program.rate,
    })
    return {
      programa: program.label,
      descricao: program.description,
      prazoMeses: FINANCING_TERM_MONTHS,
      taxaFormatada: `${program.rate.toFixed(2).replace('.', ',')}% a.a.`,
      valorImovelFormatado: formatBRLInteger(valorImovel),
      entradaFormatada: formatBRLInteger(downPayment),
      primeiraParcelaFormatada: formatBRLInteger(sim.firstInstallment),
      ultimaParcelaFormatada: formatBRLInteger(sim.lastInstallment),
      observacao: 'Estimativa aproximada (tabela SAC, parcelas decrescentes). A aprovação depende de análise da Caixa/banco.',
    }
  },
})

/** Persist the lead to the `contatos` inbox and produce the WhatsApp handoff link. */
const registrarLead = tool({
  description:
    'Registra o lead no sistema do Yuri. Chame assim que tiver pelo menos nome e telefone. Depois disso a pessoa recebe um botão para falar com o Yuri no WhatsApp.',
  inputSchema: z.object({
    nome: z.string().describe('Nome da pessoa'),
    telefone: z.string().describe('Telefone/WhatsApp com DDD'),
    intencao: z.enum(['comprar', 'alugar']).optional(),
    tipoImovel: z.string().optional().describe('Tipo de imóvel procurado'),
    regiao: z.string().optional().describe('Bairro/cidade de interesse'),
    orcamento: z.string().optional().describe('Faixa de orçamento informada'),
    financiamento: z.string().optional().describe('Forma de pagamento / faixa de financiamento'),
    prazo: z.string().optional().describe('Prazo para mudar / urgência'),
    motivacao: z.string().optional().describe('Motivo da compra/procura (ex: primeiro imóvel, casamento, mudança de cidade)'),
    querVisita: z.boolean().optional().describe('true quando a pessoa topou agendar uma visita ao imóvel'),
    imovelId: z.number().int().optional().describe('Código do imóvel de interesse, se houver'),
    imovelTitulo: z.string().optional().describe('Título do imóvel de interesse, se houver'),
    observacoes: z.string().optional().describe('Qualquer detalhe adicional relevante'),
  }),
  execute: async (lead: LeadInfo) => {
    const resumo = buildLeadSummary(lead)
    await getDb().query(
      `INSERT INTO contatos (nome, email, telefone, assunto, mensagem, imovel_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [lead.nome ?? '', '', lead.telefone ?? '', 'Lead via atendente virtual', resumo, lead.imovelId ?? null],
    )
    return {
      status: 'registrado' as const,
      whatsappUrl: buildWhatsAppHandoff(lead),
      mensagem: 'Lead registrado. Convide a pessoa a falar com o Yuri pelo botão do WhatsApp.',
    }
  },
})

export const chatTools = {
  buscarImoveis,
  estimarFinanciamento,
  registrarLead,
}
