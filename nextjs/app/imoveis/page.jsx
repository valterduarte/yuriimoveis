import ImoveisControls from '../../components/imoveis/ImoveisControls'
import PropertyGrid from '../../components/imoveis/PropertyGrid'
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

async function getProperties(searchParams) {
  const p = new URLSearchParams()
  FILTER_KEYS.forEach(k => { if (searchParams[k]) p.set(k, searchParams[k]) })
  p.set('ordem', searchParams.ordem || 'recente')
  p.set('page',  searchParams.page  || '1')
  p.set('limit', String(ITEMS_PER_PAGE))

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  try {
    const res = await fetch(`${baseUrl}/api/imoveis?${p.toString()}`, { cache: 'no-store' })
    if (!res.ok) return { imoveis: [], total: 0 }
    return res.json()
  } catch {
    return { imoveis: [], total: 0 }
  }
}

export default async function ImoveisPage({ searchParams }) {
  const params = await searchParams
  const { imoveis, total } = await getProperties(params)
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
