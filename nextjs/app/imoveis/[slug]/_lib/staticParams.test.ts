import { describe, it, expect, vi, beforeEach } from 'vitest'

const fetchAllPropertySlugsMock = vi.fn()
const fetchDistinctBairrosMock  = vi.fn()

vi.mock('../../../../lib/api', () => ({
  fetchAllPropertySlugs: () => fetchAllPropertySlugsMock(),
  fetchDistinctBairros:  () => fetchDistinctBairrosMock(),
}))

import { LANDING_PAGES } from '../../../../data/landingPages'
import { BAIRROS } from '../../../../data/bairros'
import { generateImoveisSlugParams } from './staticParams'

beforeEach(() => {
  fetchAllPropertySlugsMock.mockReset()
  fetchDistinctBairrosMock.mockReset()
})

const configuredBairroSlugs = new Set(Object.values(BAIRROS).map(b => b.slug))
const landingSlugs = new Set(LANDING_PAGES.map(lp => lp.slug))

describe('generateImoveisSlugParams', () => {
  it('returns all landing pages, all configured bairros and the property slugs in their data-shape', async () => {
    fetchAllPropertySlugsMock.mockResolvedValueOnce([
      { id: 42, titulo: 'Casa na Vila Yara' },
    ])
    fetchDistinctBairrosMock.mockResolvedValueOnce([])

    const params = await generateImoveisSlugParams()
    const slugs = params.map(p => p.slug)

    expect(slugs).toContain('casa-na-vila-yara-42')
    for (const lp of landingSlugs) expect(slugs).toContain(lp)
    for (const b  of configuredBairroSlugs) expect(slugs).toContain(b)
  })

  it('includes a DB bairro whose slug is not already configured', async () => {
    fetchAllPropertySlugsMock.mockResolvedValueOnce([])
    fetchDistinctBairrosMock.mockResolvedValueOnce(['Algum Bairro Inédito 2026'])

    const slugs = (await generateImoveisSlugParams()).map(p => p.slug)
    expect(slugs).toContain('algum-bairro-inedito-2026')
  })

  it('skips DB bairros whose db name is overridden by a configured bairro (dbMatch)', async () => {
    const configured = Object.values(BAIRROS).find(b => b.dbMatch)
    if (!configured?.dbMatch) {
      return // skip when no fixture in production data
    }
    fetchAllPropertySlugsMock.mockResolvedValueOnce([])
    fetchDistinctBairrosMock.mockResolvedValueOnce([configured.dbMatch])

    const slugs = (await generateImoveisSlugParams()).map(p => p.slug)
    // Configured slug is in (always emitted from BAIRROS list), but no extra
    // entry with the dbMatch was added on top.
    expect(slugs.filter(s => s === configured.slug)).toHaveLength(1)
  })

  it('skips DB bairros whose slugified name collides with a configured slug', async () => {
    const configured = Object.values(BAIRROS)[0]
    fetchAllPropertySlugsMock.mockResolvedValueOnce([])
    // Submit the bairro name verbatim; slugifying it should land on
    // `configured.slug` and therefore be skipped.
    fetchDistinctBairrosMock.mockResolvedValueOnce([configured.nome])

    const slugs = (await generateImoveisSlugParams()).map(p => p.slug)
    expect(slugs.filter(s => s === configured.slug)).toHaveLength(1)
  })

  it('orders the buckets as: landings, properties, configured bairros, db bairros', async () => {
    fetchAllPropertySlugsMock.mockResolvedValueOnce([{ id: 1, titulo: 'X' }])
    fetchDistinctBairrosMock.mockResolvedValueOnce(['Novo Bairro Teste'])

    const slugs = (await generateImoveisSlugParams()).map(p => p.slug)
    const firstLanding   = slugs.findIndex(s => landingSlugs.has(s))
    const firstProperty  = slugs.findIndex(s => /-\d+$/.test(s))
    const firstConfigured = slugs.findIndex(s => configuredBairroSlugs.has(s))
    const firstDb        = slugs.indexOf('novo-bairro-teste')

    expect(firstLanding).toBeGreaterThanOrEqual(0)
    expect(firstLanding).toBeLessThan(firstProperty)
    expect(firstProperty).toBeLessThan(firstConfigured)
    expect(firstConfigured).toBeLessThan(firstDb)
  })
})
