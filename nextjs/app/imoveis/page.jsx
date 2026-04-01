import ImoveisControls from '../../components/imoveis/ImoveisControls'
import PropertyGrid from '../../components/imoveis/PropertyGrid'
import { fetchProperties } from '../../lib/api'
import { ITEMS_PER_PAGE } from '../../lib/constants'
import { SITE_URL } from '../../lib/config'

const FILTER_KEYS = ['tipo', 'categoria', 'cidade', 'precoMin', 'precoMax', 'quartos']

export const metadata = {
  title: 'Imóveis Disponíveis em Osasco SP — Corretor Yuri',
  description: 'Encontre casas, apartamentos e terrenos à venda e para alugar em Osasco e região. Atendimento com o Corretor Yuri Duarte, CRECI-SP 235509.',
  alternates: { canonical: `${SITE_URL}/imoveis` },
  openGraph: {
    title: 'Imóveis Disponíveis em Osasco SP — Corretor Yuri',
    description: 'Encontre casas, apartamentos e terrenos à venda e para alugar em Osasco e região.',
    url: `${SITE_URL}/imoveis`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default async function ImoveisPage({ searchParams }) {
  const params = await searchParams
  const { imoveis, total } = await fetchProperties({
    ...Object.fromEntries(FILTER_KEYS.filter(k => params[k]).map(k => [k, params[k]])),
    ordem: params.ordem || 'recente',
    page:  params.page  || 1,
    limit: ITEMS_PER_PAGE,
  })
  const currentPage = Number(params.page || 1)
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const activeFilterCount = FILTER_KEYS.filter(k => params[k]).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <span className="section-label">Portfólio</span>
          <h1 className="text-4xl font-black uppercase text-white">Imóveis Disponíveis</h1>
        </div>
      </div>
      <div className="container mx-auto px-6 py-10">
        <ImoveisControls total={total} currentPage={currentPage} totalPages={totalPages}>
          <PropertyGrid properties={imoveis} activeFilterCount={activeFilterCount} />
        </ImoveisControls>
      </div>
    </div>
  )
}
