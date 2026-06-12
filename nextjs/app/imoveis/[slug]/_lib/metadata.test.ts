import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Imovel } from '../../../../types'

const fetchImovelMock = vi.fn()

vi.mock('../../../../lib/api', () => ({
  fetchImovel: (id: string | number) => fetchImovelMock(id),
}))

import {
  buildPropertyMetadata,
  buildLandingMetadata,
  buildBairroMetadata,
} from './metadata'

function makeImovel(over: Partial<Imovel> = {}): Imovel {
  return {
    id: 42,
    titulo: 'Casa na Vila Yara',
    descricao: '',
    descricao_seo: 'SEO description',
    tipo: 'venda',
    categoria: 'casa',
    preco: 850_000,
    area: 120,
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    endereco: '',
    bairro: 'Vila Yara',
    cidade: 'Osasco',
    cep: '',
    destaque: false,
    imagens: ['https://res.cloudinary.com/x/upload/img.jpg'],
    diferenciais: [],
    ativo: true,
    status: 'pronto',
    area_display: '',
    vagas_display: '',
    parcela_display: '',
    parcela_label: '',
    lat: null,
    lng: null,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-02-20T12:30:00Z',
    ...over,
  } as Imovel
}

beforeEach(() => {
  fetchImovelMock.mockReset()
})

describe('buildPropertyMetadata', () => {
  it('returns a "not found" title when fetchImovel resolves null', async () => {
    fetchImovelMock.mockResolvedValueOnce(null)
    const meta = await buildPropertyMetadata('999')
    expect(meta.title).toBe('Imóvel não encontrado')
  })

  it('returns Imovel-driven metadata with canonical and openGraph image', async () => {
    fetchImovelMock.mockResolvedValueOnce(makeImovel())
    const meta = await buildPropertyMetadata('42')

    expect(meta.title).toBe('Casa na Vila Yara')
    expect(meta.alternates?.canonical).toContain('/imoveis/casa-na-vila-yara-42')
    expect(meta.openGraph?.images).toHaveLength(1)
    expect(meta.twitter).toBeDefined()
    expect((meta.twitter as { card: string } | undefined)?.card).toBe('summary_large_image')
  })

  it('marks priced listings as og:type product and leads the share text with the price', async () => {
    fetchImovelMock.mockResolvedValueOnce(makeImovel({ preco: 850_000 }))
    const meta = await buildPropertyMetadata('42')

    expect((meta.openGraph as { type?: string }).type).toBe('product')
    // Price leads the social description so it shows in WhatsApp/Instagram previews.
    const ogDescription = (meta.openGraph?.description ?? '').replace(/ /g, ' ')
    expect(ogDescription).toMatch(/^R\$ 850\.000 ·/)
  })

  it('omits the product treatment when the listing has no price', async () => {
    fetchImovelMock.mockResolvedValueOnce(makeImovel({ preco: 0 }))
    const meta = await buildPropertyMetadata('42')

    expect((meta.openGraph as { type?: string }).type).not.toBe('product')
    expect(meta.openGraph?.description ?? '').not.toContain('·')
  })
})

describe('buildLandingMetadata', () => {
  it('returns metadata for a known landing slug', () => {
    const meta = buildLandingMetadata('casas-a-venda-em-osasco')
    expect(meta.title).toBeTruthy()
    expect(meta.alternates?.canonical).toContain('/imoveis/casas-a-venda-em-osasco')
    expect(meta.openGraph?.url).toContain('/imoveis/casas-a-venda-em-osasco')
  })

  it('returns empty metadata for an unknown landing slug', () => {
    expect(buildLandingMetadata('no-such-landing')).toEqual({})
  })
})

describe('buildBairroMetadata', () => {
  it('always marks bairro pages as noindex', () => {
    const meta = buildBairroMetadata('some-bairro')
    expect(meta.robots).toEqual({ index: false, follow: true })
  })

  it('falls back to formatted neighborhood name when bairro is unknown', () => {
    const meta = buildBairroMetadata('algum-bairro-novo')
    expect(meta.title).toContain('Algum Bairro Novo')
    expect(meta.alternates?.canonical).toContain('/imoveis/algum-bairro-novo')
  })
})
