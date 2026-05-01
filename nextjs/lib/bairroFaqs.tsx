import Link from 'next/link'
import { CATEGORIAS } from '../data/categorias'
import {
  emBairro,
  deBairro,
  articuloBairro,
  aoBairro,
  capitalize,
  pluralizeImoveis,
} from '../utils/imovelUtils'
import { buildHierarchicalUrl, type AcaoSlug } from './navigation'
import type { ReactNode } from 'react'
import type { BairroData, PropertyCategory } from '../types'

export interface BairroFaq {
  question: string
  answer: string
  answerJsx?: ReactNode
}

export interface BairroFaqCombo {
  acao: AcaoSlug
  categoria: string
  count: number
}

interface BuildBairroFaqsArgs {
  bairro: BairroData
  cidadeName: string
  cidadeSlug: string
  bairroDbName: string | undefined
  combos: BairroFaqCombo[]
}

const FAQ_LINK_CLASS = 'text-primary underline hover:no-underline'

function formatList(items: string[]): string {
  if (items.length === 0) return 'imóveis'
  if (items.length === 1) return items[0]
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`
}

function buildListagemHref(args: {
  combos: BairroFaqCombo[]
  cidadeName: string
  cidadeSlug: string
  bairroSlug: string
  bairroDbName: string
}): string {
  const categoriasUnicas = Array.from(new Set(args.combos.map(c => c.categoria)))
  const acoesUnicas = Array.from(new Set(args.combos.map(c => c.acao)))

  if (categoriasUnicas.length === 1 && acoesUnicas.length === 1) {
    return buildHierarchicalUrl({
      acao: acoesUnicas[0],
      cidade: args.cidadeSlug,
      categoria: categoriasUnicas[0],
      bairro: args.bairroSlug,
    })
  }

  const cidade = encodeURIComponent(args.cidadeName)
  const bairro = encodeURIComponent(args.bairroDbName)
  return `/imoveis?cidade=${cidade}&bairro=${bairro}`
}

function getCategoriasNomes(combos: BairroFaqCombo[]): string {
  const nomes = Array.from(new Set(combos.map(c => c.categoria)))
    .map(c => CATEGORIAS[c as PropertyCategory]?.plural.toLowerCase())
    .filter((c): c is string => Boolean(c))
  return formatList(nomes)
}

export function buildBairroFaqs({
  bairro,
  cidadeName,
  cidadeSlug,
  bairroDbName,
  combos,
}: BuildBairroFaqsArgs): BairroFaq[] {
  const total = combos.reduce((acc, c) => acc + c.count, 0)
  const tipoListagem = getCategoriasNomes(combos)
  const linkListagem = buildListagemHref({
    combos,
    cidadeName,
    cidadeSlug,
    bairroSlug: bairro.slug,
    bairroDbName: bairroDbName || bairro.nome,
  })

  const artigo = articuloBairro(bairro.nome)
  const em = emBairro(bairro.nome)
  const de = deBairro(bairro.nome)
  const ao = aoBairro(bairro.nome)
  const emCap = capitalize(em)

  const { noun: imoveisNoun, adjective: imoveisAdjective } = pluralizeImoveis(total)

  return [
    {
      question: `O que é ${artigo} ${bairro.nome} e onde fica?`,
      answer: bairro.conteudo.sobre,
    },
    {
      question: `Como é a infraestrutura ${de} ${bairro.nome}?`,
      answer: bairro.conteudo.infraestrutura,
    },
    {
      question: `Quais são os acessos e transporte público ${em} ${bairro.nome}?`,
      answer: bairro.conteudo.transporte,
    },
    {
      question: `Quais escolas ficam próximas ${ao} ${bairro.nome}?`,
      answer: bairro.conteudo.educacao,
    },
    {
      question: `Como é morar ${em} ${bairro.nome}?`,
      answer: bairro.conteudo.porqueMorar,
    },
    {
      question: `Que tipo de imóvel encontro ${em} ${bairro.nome}?`,
      answer: `${emCap} ${bairro.nome}, o portfólio do Corretor Yuri é composto por ${tipoListagem}. Para ver opções com filtros de dormitórios, metragem e diferenciais, acesse a lista completa de imóveis ${em} ${bairro.nome}.`,
      answerJsx: (
        <>
          {emCap} {bairro.nome}, o portfólio do Corretor Yuri é composto por {tipoListagem}. Para ver opções com filtros de dormitórios, metragem e diferenciais,{' '}
          <Link href={linkListagem} className={FAQ_LINK_CLASS}>
            acesse a lista completa de imóveis {em} {bairro.nome}
          </Link>.
        </>
      ),
    },
    {
      question: `Quanto custa um imóvel ${em} ${bairro.nome}?`,
      answer: `Os imóveis ${em} ${bairro.nome} variam conforme metragem, padrão de acabamento e diferenciais de cada empreendimento. Para ver os valores atualizados de cada unidade disponível, acesse a lista completa — você pode filtrar por faixa de preço, número de dormitórios e itens de lazer.`,
      answerJsx: (
        <>
          Os imóveis {em} {bairro.nome} variam conforme metragem, padrão de acabamento e diferenciais de cada empreendimento. Para ver os valores atualizados de cada unidade disponível,{' '}
          <Link href={linkListagem} className={FAQ_LINK_CLASS}>
            acesse a lista completa
          </Link>{' '}
          — você pode filtrar por faixa de preço, número de dormitórios e itens de lazer.
        </>
      ),
    },
    {
      question: `Quantos imóveis estão disponíveis ${em} ${bairro.nome}?`,
      answer: `No momento há ${total} ${imoveisNoun} ${imoveisAdjective} ${em} ${bairro.nome}, ${cidadeName}, entre compra e aluguel. Entre em contato com o Corretor Yuri, CRECI 235509, para agendar uma visita.`,
    },
  ]
}
