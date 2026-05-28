import { describe, it, expect } from 'vitest'
import { buildExploreLinks, buildLcpImageHref } from './imovelDetalhe'
import type { Imovel } from '../../../../types'

function makeImovel(over: Partial<Imovel> = {}): Imovel {
  return {
    id: 1,
    titulo: 'X',
    descricao: '',
    descricao_seo: '',
    tipo: 'venda',
    categoria: 'apartamento',
    preco: 500_000,
    area: 60,
    quartos: 2,
    banheiros: 1,
    vagas: 1,
    endereco: '',
    bairro: 'Vila Yara',
    cidade: 'Osasco',
    cep: '',
    status: 'pronto',
    destaque: false,
    ativo: true,
    imagens: [],
    diferenciais: [],
    parcela_display: '',
    parcela_label: '',
    created_at: '',
    updated_at: '',
    ...over,
  }
}

describe('buildLcpImageHref', () => {
  it('returns undefined for an empty image list', () => {
    expect(buildLcpImageHref([])).toBeUndefined()
  })

  it('rewrites Cloudinary URLs to a 1920w auto variant', () => {
    const out = buildLcpImageHref([
      'https://res.cloudinary.com/x/upload/v1/img.jpg',
      'https://res.cloudinary.com/x/upload/v1/other.jpg',
    ])
    expect(out).toBe('https://res.cloudinary.com/x/upload/f_auto,q_auto,w_1920/v1/img.jpg')
  })

  it('returns non-Cloudinary URLs unchanged', () => {
    expect(buildLcpImageHref(['https://example.com/photo.png'])).toBe('https://example.com/photo.png')
  })
})

describe('buildExploreLinks', () => {
  it('returns only the city links when there is no empreendimento, no guide and a small bairro', () => {
    const links = buildExploreLinks({
      imovel: makeImovel({ bairro: 'Bairro Sem Guia', cidade: 'Osasco' }),
      empreendimento: null,
      bairroInventoryForCategory: 1,
    })
    expect(links).toHaveLength(2)
    expect(links[0].label).toContain('Apartamentos para venda em Osasco')
    expect(links[1].label).toContain('Imóveis para venda em Osasco')
  })

  it('adds the bairro listing when inventory >= 3', () => {
    const links = buildExploreLinks({
      imovel: makeImovel({ bairro: 'Bairro Sem Guia' }),
      empreendimento: null,
      bairroInventoryForCategory: 3,
    })
    expect(links[0].label).toContain('Bairro Sem Guia')
    expect(links[0].href).toContain('/comprar/osasco/apartamento/')
  })

  it('puts the empreendimento link first when one is given', () => {
    const links = buildExploreLinks({
      imovel: makeImovel(),
      empreendimento: { nome: 'Edif Sol', totalUnidades: 12 },
      bairroInventoryForCategory: 0,
    })
    expect(links[0].href).toBe('/empreendimentos/edif-sol')
    expect(links[0].label).toBe('Ver todas as 12 plantas do Edif Sol')
  })

  it('switches the empreendimento label when totalUnidades < 2', () => {
    const links = buildExploreLinks({
      imovel: makeImovel(),
      empreendimento: { nome: 'Casa Solo', totalUnidades: 1 },
      bairroInventoryForCategory: 0,
    })
    expect(links[0].label).toBe('Ver detalhes do empreendimento Casa Solo')
  })

  it('uses "aluguel" wording in the city-scoped labels for tipo aluguel', () => {
    const links = buildExploreLinks({
      imovel: makeImovel({ tipo: 'aluguel', bairro: 'Bairro Sem Guia' }),
      empreendimento: null,
      bairroInventoryForCategory: 0,
    })
    // Only city + city+category links remain when there is no guide,
    // no empreendimento and no qualifying bairro page. Both must use aluguel.
    expect(links).toHaveLength(2)
    expect(links.every(l => l.label.includes('aluguel'))).toBe(true)
  })

  it('omits city-scoped links when cidade is not in the supported set', () => {
    const links = buildExploreLinks({
      imovel: makeImovel({ cidade: 'Cidade Aleatória SP', bairro: 'Bairro Sem Guia' }),
      empreendimento: null,
      bairroInventoryForCategory: 5,
    })
    // Bairro-scoped link also requires cidadeSupported, so all four city/bairro
    // links are gated out; only an empreendimento or a bairro guide could remain.
    expect(links).toHaveLength(0)
  })

  it('still emits the bairro guide link even when cidade is unsupported', () => {
    const links = buildExploreLinks({
      imovel: makeImovel({ cidade: 'Cidade Aleatória SP', bairro: 'Vila Yara' }),
      empreendimento: null,
      bairroInventoryForCategory: 5,
    })
    // Guide existence is independent of cidadeSupported.
    expect(links).toHaveLength(1)
    expect(links[0].href).toBe('/bairros/vila-yara')
  })

  it('returns an empty list when imovel has no cidade and no qualifying signals', () => {
    const links = buildExploreLinks({
      imovel: makeImovel({ cidade: '', bairro: '' }),
      empreendimento: null,
      bairroInventoryForCategory: 0,
    })
    expect(links).toHaveLength(0)
  })
})
