import { describe, it, expect, vi, beforeEach } from 'vitest'

// Run the `after` callback inline so the warming side effect is observable.
vi.mock('next/server', () => ({ after: (fn: () => unknown) => fn() }))

import { warmPropertyOgCard } from './ogWarm'

describe('warmPropertyOgCard', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('fetches the card route for the first photo with price and location', async () => {
    const calls: string[] = []
    vi.stubGlobal('fetch', vi.fn(async (u: string) => { calls.push(u); return new Response() }))

    warmPropertyOgCard({
      imagens: ['https://res.cloudinary.com/demo/image/upload/v1/a.jpg'],
      preco: 250000,
      tipo: 'venda',
      bairro: 'Centro',
      cidade: 'Osasco',
    })
    await Promise.resolve()

    expect(calls).toHaveLength(1)
    const url = new URL(calls[0])
    expect(url.pathname).toBe('/api/og/imovel')
    expect(url.searchParams.get('loc')).toBe('Centro - Osasco')
    expect(url.searchParams.get('price')).toBeTruthy()
    expect(url.searchParams.get('img')).toContain('res.cloudinary.com')
  })

  it('does nothing when the property has no photo', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    warmPropertyOgCard({ imagens: [], preco: 1, tipo: 'venda' })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
