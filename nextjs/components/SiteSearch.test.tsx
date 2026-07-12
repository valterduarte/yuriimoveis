// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SiteSearch from './SiteSearch'
import type { SearchItem } from '../lib/search'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

const INDEX: SearchItem[] = [
  { type: 'imovel', label: 'Casa no Tamboré', sublabel: 'Santana de Parnaíba', url: '/imoveis/casa-tambore', terms: 'casa no tambore santana de parnaiba' },
  { type: 'imovel', label: 'Apartamento na Vila Yara', sublabel: 'Osasco', url: '/imoveis/apto-vila-yara', terms: 'apartamento na vila yara osasco' },
]

beforeEach(() => {
  push.mockClear()
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => INDEX })) as unknown as typeof fetch)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('SiteSearch — mobile variant', () => {
  it('renders a full-width labelled trigger instead of a bare icon', () => {
    render(<SiteSearch variant="mobile" />)
    expect(screen.getByText('Buscar imóvel, bairro ou código…')).toBeDefined()
  })

  it('opens the input, loads the index and filters as the user types', async () => {
    const user = userEvent.setup()
    render(<SiteSearch variant="mobile" />)

    await user.click(screen.getByRole('button', { name: /buscar imóvel/i }))

    const input = await screen.findByRole('textbox', { name: /buscar imóvel/i })
    expect(fetch).toHaveBeenCalledWith('/api/search')

    await user.type(input, 'tambore')

    expect(await screen.findByText('Casa no Tamboré')).toBeDefined()
    expect(screen.queryByText('Apartamento na Vila Yara')).toBeNull()
  })

  it('navigates to the picked result', async () => {
    const user = userEvent.setup()
    render(<SiteSearch variant="mobile" />)

    await user.click(screen.getByRole('button', { name: /buscar imóvel/i }))
    const input = await screen.findByRole('textbox', { name: /buscar imóvel/i })
    await user.type(input, 'vila yara')

    await user.click(await screen.findByText('Apartamento na Vila Yara'))
    expect(push).toHaveBeenCalledWith('/imoveis/apto-vila-yara')
  })
})

describe('SiteSearch — desktop variant', () => {
  it('renders a bare icon trigger without the mobile placeholder text', () => {
    render(<SiteSearch />)
    expect(screen.getByRole('button', { name: /buscar imóvel/i })).toBeDefined()
    expect(screen.queryByText('Buscar imóvel, bairro ou código…')).toBeNull()
  })
})
