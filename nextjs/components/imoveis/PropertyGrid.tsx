import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import PropertyCard from '../PropertyCard'
import { PHONE_WA_BASE } from '../../lib/config'
import WhatsAppLink from '../WhatsAppLink'
import type { Imovel } from '../../types'

interface PropertyGridProps {
  properties: Imovel[]
  activeFilterCount: number
  filters?: { tipo?: string; cidade?: string; categoria?: string; bairro?: string }
}

const TIPO_LABEL: Record<string, string> = { venda: 'à venda', aluguel: 'para alugar' }
const CATEGORIA_LABEL: Record<string, string> = {
  apartamento: 'apartamentos',
  casa: 'casas',
  terreno: 'terrenos',
  comercial: 'imóveis comerciais',
  construcao: 'imóveis em construção',
  planta: 'imóveis na planta',
}

function buildEmptyHeadline(filters: PropertyGridProps['filters']): string {
  if (!filters) return 'Nenhum imóvel encontrado'
  const { tipo, cidade, bairro, categoria } = filters
  const what = (categoria && CATEGORIA_LABEL[categoria]) || 'imóveis'
  const action = (tipo && TIPO_LABEL[tipo]) || 'disponíveis'
  const where = bairro ? ` em ${bairro}` : cidade ? ` em ${cidade}` : ''
  return `Não encontramos ${what} ${action}${where} no momento`
}

export default function PropertyGrid({ properties, activeFilterCount, filters }: PropertyGridProps) {
  if (properties.length === 0) {
    const headline = buildEmptyHeadline(filters)
    const waMessage = filters?.cidade
      ? `Olá! Estou procurando imóveis ${filters.tipo === 'aluguel' ? 'para alugar' : 'à venda'} em ${filters.cidade}. Pode me ajudar?`
      : 'Olá! Não encontrei o imóvel que procuro no site. Pode me ajudar?'
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
