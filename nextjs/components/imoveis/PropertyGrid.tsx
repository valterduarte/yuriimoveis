import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import PropertyCard from '../PropertyCard'
import { PHONE_WA_BASE } from '../../lib/config'
import WhatsAppLink from '../WhatsAppLink'
import { CATEGORIAS } from '../../data/categorias'
import type { Imovel, PropertyCategory } from '../../types'

interface PropertyFilterParams {
  tipo?: string
  cidade?: string
  categoria?: string
  bairro?: string
}

interface PropertyGridProps {
  properties: Imovel[]
  activeFilterCount: number
  filters?: PropertyFilterParams
}

const TIPO_HEADLINE_LABEL: Record<string, string> = {
  venda: 'à venda',
  aluguel: 'para alugar',
}

const TIPO_WHATSAPP_LABEL: Record<string, string> = {
  venda: 'à venda',
  aluguel: 'para alugar',
}

function getCategoriaPlural(categoria: string | undefined): string {
  if (!categoria) return 'imóveis'
  return CATEGORIAS[categoria as PropertyCategory]?.plural.toLowerCase() ?? 'imóveis'
}

function buildEmptyHeadline(filters: PropertyFilterParams | undefined): string {
  if (!filters) return 'Nenhum imóvel encontrado'
  const noun = getCategoriaPlural(filters.categoria)
  const action = (filters.tipo && TIPO_HEADLINE_LABEL[filters.tipo]) || 'disponíveis'
  const place = filters.bairro
    ? ` em ${filters.bairro}`
    : filters.cidade
      ? ` em ${filters.cidade}`
      : ''
  return `Não encontramos ${noun} ${action}${place} no momento`
}

function buildWhatsAppMessage(filters: PropertyFilterParams | undefined): string {
  if (!filters?.cidade) {
    return 'Olá! Não encontrei o imóvel que procuro no site. Pode me ajudar?'
  }
  const action = (filters.tipo && TIPO_WHATSAPP_LABEL[filters.tipo]) || 'à venda'
  return `Olá! Estou procurando imóveis ${action} em ${filters.cidade}. Pode me ajudar?`
}

export default function PropertyGrid({ properties, activeFilterCount, filters }: PropertyGridProps) {
  if (properties.length === 0) {
    const headline = buildEmptyHeadline(filters)
    const waMessage = buildWhatsAppMessage(filters)
    return (
      <div className="text-center py-20 bg-white border border-gray-200 px-6">
        <div className="text-5xl mb-4" aria-hidden="true">🏠</div>
        <h2 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">{headline}</h2>
        <p className="text-gray-500 text-sm mb-6">
          Tente ajustar os filtros ou fale direto com o corretor — novos imóveis chegam toda semana e muitos saem antes de entrar no site.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {activeFilterCount > 0 && (
            <Link href="/imoveis" className="btn-primary">Limpar filtros</Link>
          )}
          <WhatsAppLink
            href={`${PHONE_WA_BASE}?text=${encodeURIComponent(waMessage)}`}
            source="lista-sem-resultado"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs py-3 px-6 transition-colors"
          >
            <FaWhatsapp size={14} /> Falar com o Corretor
          </WhatsAppLink>
        </div>
      </div>
    )
  }

  return (
    <>
      <h2 className="sr-only">Resultados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {properties.map((property, i) => (
          <div key={property.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
            <PropertyCard imovel={property} />
          </div>
        ))}
      </div>
    </>
  )
}
