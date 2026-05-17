import Link from 'next/link'
import { getBairroBySlug } from '../../data/bairros'
import { formatBRL } from '../../lib/formatters'
import { buildHierarchicalUrl, type AcaoSlug } from '../../lib/navigation'
import type { BairroPriceInsight, PropertyCategory } from '../../types'

interface BairroWithCount {
  slug: string
  count: number
}

interface BairrosRecomendadosProps {
  acao: AcaoSlug
  cidade: string
  cidadeName: string
  categoria: PropertyCategory
  categoriaPlural: string
  bairrosWithCount: BairroWithCount[]
}

const MAX_CARDS = 6

function pickValorMedio(insight: BairroPriceInsight, categoria: PropertyCategory): { value: number; label: string } | null {
  if (categoria === 'apartamento' && insight.apartamento2qts) {
    return { value: insight.apartamento2qts, label: 'Apartamento 2 dorm.' }
  }
  if (categoria === 'casa' && insight.casa3qts) {
    return { value: insight.casa3qts, label: 'Casa 3 dorm.' }
  }
  if (insight.m2) {
    return { value: insight.m2, label: 'por m²' }
  }
  return null
}

export default function BairrosRecomendados({
  acao,
  cidade,
  cidadeName,
  categoria,
  categoriaPlural,
  bairrosWithCount,
}: BairrosRecomendadosProps) {
  const enriched = bairrosWithCount
    .map(b => {
      const data = getBairroBySlug(b.slug)
      if (!data || !data.precoMedio) return null
      const valor = pickValorMedio(data.precoMedio, categoria)
      if (!valor) return null
      return { ...b, nome: data.nome, valor }
    })
    .filter((b): b is NonNullable<typeof b> => b !== null)
    .slice(0, MAX_CARDS)

  if (enriched.length === 0) return null

  const categoriaLc = categoriaPlural.toLowerCase()

  return (
    <section className="mt-14">
      <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">
        Bairros recomendados para {acao === 'comprar' ? 'comprar' : 'alugar'} {categoriaLc} em {cidadeName}
      </h2>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enriched.map(b => (
          <li key={b.slug}>
            <Link
              href={buildHierarchicalUrl({ acao, cidade, categoria, bairro: b.slug })}
              className="block bg-white border border-gray-200 p-5 hover:border-primary transition-colors h-full"
            >
              <h3 className="font-bold text-dark text-base mb-1">{b.nome}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {b.count} {categoriaLc} para {acao === 'comprar' ? 'comprar' : 'alugar'}
              </p>

              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Valor médio</p>
              <p className="text-primary font-bold text-lg leading-tight">
                {formatBRL(b.valor.value)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{b.valor.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
