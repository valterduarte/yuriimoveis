import ImoveisControls from '../../components/imoveis/ImoveisControls'
import { ITEMS_PER_PAGE } from '../../lib/constants'

async function getProperties(searchParams) {
  const p = new URLSearchParams()
  const filterKeys = ['tipo', 'categoria', 'cidade', 'precoMin', 'precoMax', 'quartos']
  filterKeys.forEach(k => { if (searchParams[k]) p.set(k, searchParams[k]) })
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <span className="section-label">Portfólio</span>
          <h1 className="text-4xl font-black uppercase text-white">Imóveis Disponíveis</h1>
        </div>
      </div>
      <div className="container mx-auto px-6 py-10">
        <ImoveisControls
          properties={imoveis}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}
