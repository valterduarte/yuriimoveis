import { fetchProperties, fetchBairrosByCidade, fetchDistinctCidades } from '../../lib/api'
import { ITEMS_PER_PAGE } from '../../lib/constants'
import ImoveisControls from './ImoveisControls'
import PropertyGrid from './PropertyGrid'

const FILTER_KEYS = ['tipo', 'categoria', 'cidade', 'bairro', 'precoMin', 'precoMax', 'quartos', 'codigo']

interface ImoveisResultsProps {
  searchParams: Promise<Record<string, string>>
}

export default async function ImoveisResults({ searchParams }: ImoveisResultsProps) {
  const params = await searchParams
  const [{ imoveis, total }, bairrosPorCidade, cidades] = await Promise.all([
    fetchProperties({
      ...Object.fromEntries(FILTER_KEYS.filter(k => params[k]).map(k => [k, params[k]])),
      ordem: params.ordem || 'recente',
      page:  params.page  || 1,
      limit: ITEMS_PER_PAGE,
    }),
    fetchBairrosByCidade(),
    fetchDistinctCidades(),
  ])
  const currentPage = Number(params.page || 1)
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const activeFilterCount = FILTER_KEYS.filter(k => params[k]).length

  return (
    <ImoveisControls
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
      bairrosPorCidade={bairrosPorCidade}
      cidades={cidades}
    >
      <PropertyGrid
        properties={imoveis}
        activeFilterCount={activeFilterCount}
        filters={{ tipo: params.tipo, cidade: params.cidade, categoria: params.categoria, bairro: params.bairro }}
      />
    </ImoveisControls>
  )
}

export function ImoveisResultsFallback() {
  return (
    <div className="py-12 text-center">
      <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      <p className="mt-3 text-xs uppercase tracking-widest text-gray-500">Carregando imóveis…</p>
    </div>
  )
}
