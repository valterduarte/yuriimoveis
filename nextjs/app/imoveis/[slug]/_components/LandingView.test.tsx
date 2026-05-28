import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import type { Imovel } from '../../../../types'

const fetchPropertiesByTypeCategoryMock = vi.fn()

vi.mock('../../../../lib/api', () => ({
  fetchPropertiesByTypeCategory: (tipo: string, categoria: string) =>
    fetchPropertiesByTypeCategoryMock(tipo, categoria),
}))

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))

import LandingView from './LandingView'

function makeImovel(over: Partial<Imovel> = {}): Imovel {
  return {
    id: 1,
    titulo: 'Casa Demo',
    descricao: '',
    descricao_seo: '',
    tipo: 'venda',
    categoria: 'casa',
    preco: 600_000,
    area: 100,
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    endereco: '',
    bairro: 'Vila Yara',
    cidade: 'Osasco',
    cep: '',
    status: 'pronto',
    destaque: false,
    ativo: true,
    imagens: ['https://res.cloudinary.com/x/upload/v1/img.jpg'],
    diferenciais: [],
    parcela_display: '',
    parcela_label: '',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    ...over,
  }
}

beforeEach(() => {
  fetchPropertiesByTypeCategoryMock.mockReset()
})

describe('LandingView', () => {
  it('renders hero with landing title and the property grid when there are results', async () => {
    fetchPropertiesByTypeCategoryMock.mockResolvedValueOnce({
      imoveis: [makeImovel({ id: 1 }), makeImovel({ id: 2 })],
      total: 2,
    })

    const node = await LandingView({ slug: 'casas-a-venda-em-osasco' })
    const html = renderToString(node)
    // React 19 inserts <!-- --> markers between text fragments. Strip them
    // so substring assertions match the visible string the browser renders.
    const visible = html.replace(/<!---->/g, '').replace(/<!--[^>]*-->/g, '')

    expect(visible).toContain('Casas à Venda em Osasco')
    // NOTE: copy reads "imóvelis" not "imóveis" — pluralization bug carried
    // over verbatim from the pre-refactor god page (also present in
    // BairroView). Tracked separately; the test pins current behavior so a
    // future fix surfaces here.
    expect(visible).toContain('2 imóvelis encontrados')
    expect(html).toContain('"@type":"BreadcrumbList"')
    expect(html).toContain('"@type":"CollectionPage"')
    expect(html).toContain('"numberOfItems":2')
    expect(visible).not.toContain('Nenhum imóvel encontrado')
  })

  it('renders the empty-state CTA when there are no results and skips CollectionPage', async () => {
    fetchPropertiesByTypeCategoryMock.mockResolvedValueOnce({ imoveis: [], total: 0 })

    const node = await LandingView({ slug: 'casas-a-venda-em-osasco' })
    const html = renderToString(node)

    expect(html).toContain('Nenhum imóvel encontrado')
    expect(html).toContain('"@type":"BreadcrumbList"')
    expect(html).not.toContain('"@type":"CollectionPage"')
  })

  it('calls notFound when the slug does not match any landing page', async () => {
    fetchPropertiesByTypeCategoryMock.mockResolvedValueOnce({ imoveis: [], total: 0 })

    await expect(LandingView({ slug: 'no-such-landing' })).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
