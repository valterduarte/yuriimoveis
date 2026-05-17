# Quinto Andar–Style Listing Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current "map below the grid" listing experience with a Quinto Andar–style split layout: scrollable grid + sticky Google Map on desktop, fullscreen toggle on mobile, price-chip markers, hover-sync between cards and pins, and a "search in this area" viewport filter.

**Architecture:** A single `ListingMapShell` client component wraps the property grid and a Google Maps panel. A per-page Zustand store mediates hover state, viewport bounds, and filtered ids between cards and markers. Card-side hover behavior lives in a thin `HoverSyncCard` wrapper around the existing `PropertyCard` so that consumers outside listing pages remain server components. Each of the four target pages is wired one at a time, with browser verification between page wirings.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind, `@vis.gl/react-google-maps`, `@googlemaps/markerclusterer`, `zustand`, Vitest.

**Spec:** `docs/superpowers/specs/2026-05-17-quintoandar-map-design.md`

---

## File map

**Create**
- `nextjs/components/imoveis/listing-map/useListingMapStore.ts` — Zustand store factory + React context
- `nextjs/components/imoveis/listing-map/HoverSyncCard.tsx` — client wrapper around PropertyCard
- `nextjs/components/imoveis/listing-map/PriceMarker.tsx` — AdvancedMarker price-chip component
- `nextjs/components/imoveis/listing-map/PropertyInfoCard.tsx` — mini property card rendered inside InfoWindow
- `nextjs/components/imoveis/listing-map/ClusterRenderer.ts` — markerclusterer renderer
- `nextjs/components/imoveis/listing-map/SearchInAreaButton.tsx` — viewport filter button
- `nextjs/components/imoveis/listing-map/MobileMapToggle.tsx` — FAB + fullscreen sheet
- `nextjs/components/imoveis/listing-map/ListingMapPanel.tsx` — map + markers + clusterer
- `nextjs/components/imoveis/listing-map/ListingMapShell.tsx` — entry component, layout orchestrator
- `nextjs/components/imoveis/listing-map/__tests__/useListingMapStore.test.ts`
- `nextjs/components/imoveis/listing-map/__tests__/viewportBounds.test.ts`
- `nextjs/lib/__tests__/bairroCoords.test.ts`

**Modify**
- `nextjs/lib/bairroCoords.ts` — add `jitterCoords(id, base)` and `coordsForImovelJittered(id, bairro, cidade)`
- `nextjs/lib/api.ts` — add `fetchPropertiesByBairro(slug)` for the bairros page
- `nextjs/app/[acao]/[cidade]/[categoria]/page.tsx` — swap `<PropertyResultsGrid>` + `<ListingMap>` for `<ListingMapShell>`
- `nextjs/app/imoveis/page.tsx` — wrap `<PropertyGrid>` in `<ListingMapShell>` (preserve pagination behavior)
- `nextjs/app/[acao]/[cidade]/page.tsx` — wrap `<PropertyResultsGrid>` in `<ListingMapShell>`
- `nextjs/app/bairros/[slug]/page.tsx` — replace 3-property destaques block with full bairro listing + map
- `nextjs/package.json` — add deps
- `nextjs/.env.local.example` — document `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

**Delete (cleanup, final task)**
- `nextjs/components/imoveis/ListingMap.tsx` — superseded by `ListingMapShell`

---

## Task 1: Install dependencies

**Files:**
- Modify: `nextjs/package.json` (via npm install)

- [ ] **Step 1: Install runtime deps**

```bash
cd nextjs && npm install @vis.gl/react-google-maps @googlemaps/markerclusterer zustand
```

Expected: three packages added to `dependencies` in `package.json`, `package-lock.json` updated.

- [ ] **Step 2: Verify install**

```bash
cd nextjs && npx tsc --noEmit
```

Expected: PASS (no type errors). Type packages for the three libraries ship with the libraries themselves.

- [ ] **Step 3: Commit**

```bash
git add nextjs/package.json nextjs/package-lock.json
git commit -m "Add Google Maps and Zustand dependencies for listing map"
```

---

## Task 2: Document the Google Maps env var

**Files:**
- Modify: `nextjs/.env.local.example`

- [ ] **Step 1: Add the env var stub**

Append to `nextjs/.env.local.example`:

```
# Google Maps JavaScript API key (used by listing pages map).
# Create at https://console.cloud.google.com, enable Maps JavaScript API,
# restrict by HTTP referrer (corretoryuri.com.br, *.vercel.app, http://localhost:3000).
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

- [ ] **Step 2: Commit**

```bash
git add nextjs/.env.local.example
git commit -m "Document NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for listing map"
```

---

## Task 3: Add deterministic jitter to bairro coordinates

**Files:**
- Modify: `nextjs/lib/bairroCoords.ts`
- Create: `nextjs/lib/__tests__/bairroCoords.test.ts`

- [ ] **Step 1: Write failing test**

Create `nextjs/lib/__tests__/bairroCoords.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { jitterCoords, coordsForImovelJittered } from '../bairroCoords'

const BASE = { lat: -23.5329, lng: -46.7917 } // Osasco centro

describe('jitterCoords', () => {
  it('returns the same offset for the same id', () => {
    const a = jitterCoords(42, BASE)
    const b = jitterCoords(42, BASE)
    expect(a).toEqual(b)
  })

  it('returns different offsets for different ids', () => {
    const a = jitterCoords(1, BASE)
    const b = jitterCoords(2, BASE)
    expect(a).not.toEqual(b)
  })

  it('keeps the jittered point within ~0.001 degrees of the base', () => {
    for (let id = 1; id <= 50; id++) {
      const p = jitterCoords(id, BASE)
      expect(Math.abs(p.lat - BASE.lat)).toBeLessThan(0.001)
      expect(Math.abs(p.lng - BASE.lng)).toBeLessThan(0.001)
    }
  })
})

describe('coordsForImovelJittered', () => {
  it('returns null when the bairro has no centroid', () => {
    expect(coordsForImovelJittered(1, 'bairro-inexistente-foo', 'osasco')).toBeNull()
  })

  it('returns a jittered coord when the bairro is known', () => {
    const result = coordsForImovelJittered(7, 'centro', 'osasco')
    expect(result).not.toBeNull()
    expect(result!.lat).not.toEqual(BASE.lat) // jittered, not exactly the centroid
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd nextjs && npx vitest run lib/__tests__/bairroCoords.test.ts
```

Expected: FAIL — `jitterCoords is not exported`.

- [ ] **Step 3: Implement jitterCoords and coordsForImovelJittered**

Append to `nextjs/lib/bairroCoords.ts` (just before the existing `coordsForImovel` export):

```ts
// Deterministic jitter so multiple listings in the same bairro don't stack
// on a single pin. Same id always produces the same offset; max ~80m radius
// keeps the pin inside the bairro (privacy preserved).
export function jitterCoords(id: number, base: LatLng): LatLng {
  const angle = ((id * 137.508) % 360) * (Math.PI / 180) // golden angle
  const radius = (((id * 31) % 100) / 100) * 0.0008
  return {
    lat: base.lat + radius * Math.cos(angle),
    lng: base.lng + radius * Math.sin(angle),
  }
}

export function coordsForImovelJittered(
  id: number,
  bairro: string,
  cidade: string,
): LatLng | null {
  const base = coordsForImovel(id, bairro, cidade)
  return base ? jitterCoords(id, base) : null
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd nextjs && npx vitest run lib/__tests__/bairroCoords.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add nextjs/lib/bairroCoords.ts nextjs/lib/__tests__/bairroCoords.test.ts
git commit -m "Add deterministic jitter for per-listing map coordinates"
```

---

## Task 4: Create the Zustand store factory and React context

**Files:**
- Create: `nextjs/components/imoveis/listing-map/useListingMapStore.ts`
- Create: `nextjs/components/imoveis/listing-map/__tests__/useListingMapStore.test.ts`

- [ ] **Step 1: Write failing test**

Create `nextjs/components/imoveis/listing-map/__tests__/useListingMapStore.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { createListingMapStore } from '../useListingMapStore'

describe('createListingMapStore', () => {
  it('starts with no active id and no filter', () => {
    const store = createListingMapStore()
    const state = store.getState()
    expect(state.activeImovelId).toBeNull()
    expect(state.filteredIds).toBeNull()
    expect(state.mobileMapOpen).toBe(false)
  })

  it('setActive updates the active id', () => {
    const store = createListingMapStore()
    store.getState().setActive(42)
    expect(store.getState().activeImovelId).toBe(42)
    store.getState().setActive(null)
    expect(store.getState().activeImovelId).toBeNull()
  })

  it('setFilteredIds accepts a Set or null', () => {
    const store = createListingMapStore()
    store.getState().setFilteredIds(new Set([1, 2, 3]))
    expect(store.getState().filteredIds).toEqual(new Set([1, 2, 3]))
    store.getState().setFilteredIds(null)
    expect(store.getState().filteredIds).toBeNull()
  })

  it('toggleMobileMap flips the boolean', () => {
    const store = createListingMapStore()
    store.getState().toggleMobileMap()
    expect(store.getState().mobileMapOpen).toBe(true)
    store.getState().toggleMobileMap()
    expect(store.getState().mobileMapOpen).toBe(false)
  })

  it('two instances are independent', () => {
    const a = createListingMapStore()
    const b = createListingMapStore()
    a.getState().setActive(1)
    expect(b.getState().activeImovelId).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd nextjs && npx vitest run components/imoveis/listing-map/__tests__/useListingMapStore.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement the store**

Create `nextjs/components/imoveis/listing-map/useListingMapStore.ts`:

```ts
'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { createStore, useStore } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface ListingMapState {
  activeImovelId: number | null
  filteredIds: Set<number> | null
  mobileMapOpen: boolean
  setActive: (id: number | null) => void
  setFilteredIds: (ids: Set<number> | null) => void
  toggleMobileMap: () => void
}

export function createListingMapStore() {
  return createStore<ListingMapState>()(
    subscribeWithSelector((set) => ({
      activeImovelId: null,
      filteredIds: null,
      mobileMapOpen: false,
      setActive: (id) => set({ activeImovelId: id }),
      setFilteredIds: (ids) => set({ filteredIds: ids }),
      toggleMobileMap: () => set((s) => ({ mobileMapOpen: !s.mobileMapOpen })),
    })),
  )
}

type StoreApi = ReturnType<typeof createListingMapStore>

const ListingMapStoreContext = createContext<StoreApi | null>(null)

export function ListingMapStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<StoreApi | null>(null)
  if (!storeRef.current) storeRef.current = createListingMapStore()
  return (
    <ListingMapStoreContext.Provider value={storeRef.current}>
      {children}
    </ListingMapStoreContext.Provider>
  )
}

export function useListingMapStore<T>(selector: (state: ListingMapState) => T): T | null {
  const store = useContext(ListingMapStoreContext)
  // Hook order: always call useStore; pass a noop store when no provider so
  // consumers outside a ListingMapShell (e.g., PropertyCard on the home page
  // wrapped by HoverSyncCard) don't crash.
  return useStore(store ?? FALLBACK_STORE, store ? selector : () => null) as T | null
}

const FALLBACK_STORE = createListingMapStore()
```

Note: the file uses JSX inside `ListingMapStoreProvider`, so it must be renamed to `.tsx`. Update the file name to `useListingMapStore.tsx` and update all import paths in subsequent tasks accordingly.

- [ ] **Step 4: Rename file extension and re-run test**

```bash
cd nextjs && mv components/imoveis/listing-map/useListingMapStore.ts components/imoveis/listing-map/useListingMapStore.tsx
npx vitest run components/imoveis/listing-map/__tests__/useListingMapStore.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add nextjs/components/imoveis/listing-map/useListingMapStore.tsx nextjs/components/imoveis/listing-map/__tests__/useListingMapStore.test.ts
git commit -m "Add per-page Zustand store for listing map state"
```

---

## Task 5: Create the HoverSyncCard wrapper

**Files:**
- Create: `nextjs/components/imoveis/listing-map/HoverSyncCard.tsx`

- [ ] **Step 1: Implement the wrapper**

Create `nextjs/components/imoveis/listing-map/HoverSyncCard.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import PropertyCard from '../../PropertyCard'
import { useListingMapStore } from './useListingMapStore'
import type { Imovel } from '../../../types'

interface HoverSyncCardProps {
  imovel: Imovel
  priority?: boolean
}

export default function HoverSyncCard({ imovel, priority }: HoverSyncCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const active = useListingMapStore((s) => s.activeImovelId === imovel.id)
  const setActive = useListingMapStore((s) => s.setActive)

  useEffect(() => {
    if (active && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [active])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setActive?.(imovel.id)}
      onMouseLeave={() => setActive?.(null)}
      className={`transition-shadow duration-150 ${active ? 'ring-2 ring-primary ring-offset-2' : ''}`}
    >
      <PropertyCard imovel={imovel} priority={priority} />
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
cd nextjs && npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add nextjs/components/imoveis/listing-map/HoverSyncCard.tsx
git commit -m "Add HoverSyncCard wrapper for listing map hover sync"
```

---

## Task 6: Create the PriceMarker component

**Files:**
- Create: `nextjs/components/imoveis/listing-map/PriceMarker.tsx`

- [ ] **Step 1: Implement**

Create `nextjs/components/imoveis/listing-map/PriceMarker.tsx`:

```tsx
'use client'

import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { useListingMapStore } from './useListingMapStore'
import type { LatLng } from '../../../lib/bairroCoords'
import type { MapImovel } from '../../../lib/api'

interface PriceMarkerProps {
  imovel: MapImovel
  coords: LatLng
  onClick: () => void
}

function formatPriceShort(preco: number, tipo: 'venda' | 'aluguel'): string {
  if (tipo === 'aluguel') {
    const value = preco.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
    return `R$ ${value}/mês`
  }
  if (preco >= 1_000_000) {
    const v = (preco / 1_000_000).toFixed(1).replace('.', ',').replace(/,0$/, '')
    return `R$ ${v}M`
  }
  if (preco >= 1_000) {
    return `R$ ${Math.round(preco / 1_000)}K`
  }
  return `R$ ${preco}`
}

export default function PriceMarker({ imovel, coords, onClick }: PriceMarkerProps) {
  const active = useListingMapStore((s) => s.activeImovelId === imovel.id)
  const setActive = useListingMapStore((s) => s.setActive)
  const isVenda = imovel.tipo === 'venda'

  const baseClasses = 'inline-flex items-center px-2 py-1 text-xs font-bold rounded-md shadow-md border-l-4 transition-transform whitespace-nowrap cursor-pointer'
  const colorClasses = active
    ? isVenda
      ? 'bg-primary text-white border-primary scale-110'
      : 'bg-emerald-500 text-white border-emerald-500 scale-110'
    : isVenda
      ? 'bg-white text-primary border-primary'
      : 'bg-white text-emerald-600 border-emerald-500'

  return (
    <AdvancedMarker
      position={coords}
      onClick={onClick}
      zIndex={active ? 1000 : 1}
    >
      <div
        className={`${baseClasses} ${colorClasses}`}
        onMouseEnter={() => setActive?.(imovel.id)}
        onMouseLeave={() => setActive?.(null)}
      >
        {formatPriceShort(imovel.preco, imovel.tipo)}
      </div>
    </AdvancedMarker>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
cd nextjs && npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add nextjs/components/imoveis/listing-map/PriceMarker.tsx
git commit -m "Add PriceMarker component with hover sync"
```

---

## Task 7: Create the cluster renderer

**Files:**
- Create: `nextjs/components/imoveis/listing-map/ClusterRenderer.ts`

- [ ] **Step 1: Implement**

Create `nextjs/components/imoveis/listing-map/ClusterRenderer.ts`:

```ts
import type { Cluster, Renderer } from '@googlemaps/markerclusterer'

const PRIMARY = '#af1e23'

function diameterForCount(count: number): number {
  if (count < 10) return 36
  if (count < 30) return 44
  return 52
}

export const clusterRenderer: Renderer = {
  render({ count, position }: Cluster) {
    const size = diameterForCount(count)
    const svg = window.btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${PRIMARY}" stroke="white" stroke-width="2" />
      </svg>
    `)
    return new google.maps.Marker({
      position,
      icon: {
        url: `data:image/svg+xml;base64,${svg}`,
        scaledSize: new google.maps.Size(size, size),
      },
      label: {
        text: String(count),
        color: 'white',
        fontSize: '13px',
        fontWeight: '700',
      },
      zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
    })
  },
}
```

- [ ] **Step 2: Typecheck**

```bash
cd nextjs && npx tsc --noEmit
```

Expected: PASS. (The `google.maps` global is provided by `@types/google.maps` shipped with `@vis.gl/react-google-maps`.)

- [ ] **Step 3: Commit**

```bash
git add nextjs/components/imoveis/listing-map/ClusterRenderer.ts
git commit -m "Add cluster renderer for listing map markers"
```

---

## Task 8: Add viewport-bounds delta helper with tests

**Files:**
- Create: `nextjs/components/imoveis/listing-map/viewportBounds.ts`
- Create: `nextjs/components/imoveis/listing-map/__tests__/viewportBounds.test.ts`

- [ ] **Step 1: Write failing test**

Create `nextjs/components/imoveis/listing-map/__tests__/viewportBounds.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { boundsAreaDelta, idsInsideBounds, type LatLngBoundsLiteral } from '../viewportBounds'
import type { LatLng } from '../../../../lib/bairroCoords'

const OSASCO_AREA: LatLngBoundsLiteral = {
  north: -23.50, south: -23.60, east: -46.75, west: -46.85,
}

describe('boundsAreaDelta', () => {
  it('returns 0 for identical bounds', () => {
    expect(boundsAreaDelta(OSASCO_AREA, OSASCO_AREA)).toBe(0)
  })

  it('returns ≥ 0.5 when one bounds is half the area of the other', () => {
    const half: LatLngBoundsLiteral = {
      north: -23.525, south: -23.575, east: -46.775, west: -46.825,
    }
    expect(boundsAreaDelta(OSASCO_AREA, half)).toBeGreaterThanOrEqual(0.5)
  })
})

describe('idsInsideBounds', () => {
  const inside: { id: number; coords: LatLng } = { id: 1, coords: { lat: -23.55, lng: -46.80 } }
  const outside: { id: number; coords: LatLng } = { id: 2, coords: { lat: -23.40, lng: -46.80 } }

  it('returns only ids whose coords fall inside the bounds', () => {
    const result = idsInsideBounds([inside, outside], OSASCO_AREA)
    expect(result).toEqual(new Set([1]))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd nextjs && npx vitest run components/imoveis/listing-map/__tests__/viewportBounds.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Create `nextjs/components/imoveis/listing-map/viewportBounds.ts`:

```ts
import type { LatLng } from '../../../lib/bairroCoords'

export interface LatLngBoundsLiteral {
  north: number
  south: number
  east: number
  west: number
}

function area(b: LatLngBoundsLiteral): number {
  return Math.abs(b.north - b.south) * Math.abs(b.east - b.west)
}

// Symmetric relative delta. 0 means identical area; values toward 1 mean a
// large change. Used to decide whether to surface "Search in this area".
export function boundsAreaDelta(a: LatLngBoundsLiteral, b: LatLngBoundsLiteral): number {
  const aa = area(a)
  const bb = area(b)
  if (aa === 0 && bb === 0) return 0
  return Math.abs(aa - bb) / Math.max(aa, bb)
}

export function idsInsideBounds(
  points: Array<{ id: number; coords: LatLng }>,
  bounds: LatLngBoundsLiteral,
): Set<number> {
  const ids = new Set<number>()
  for (const { id, coords } of points) {
    if (
      coords.lat <= bounds.north &&
      coords.lat >= bounds.south &&
      coords.lng <= bounds.east &&
      coords.lng >= bounds.west
    ) {
      ids.add(id)
    }
  }
  return ids
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd nextjs && npx vitest run components/imoveis/listing-map/__tests__/viewportBounds.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add nextjs/components/imoveis/listing-map/viewportBounds.ts nextjs/components/imoveis/listing-map/__tests__/viewportBounds.test.ts
git commit -m "Add viewport bounds helpers for map filter"
```

---

## Task 9: Create SearchInAreaButton

**Files:**
- Create: `nextjs/components/imoveis/listing-map/SearchInAreaButton.tsx`

- [ ] **Step 1: Implement**

Create `nextjs/components/imoveis/listing-map/SearchInAreaButton.tsx`:

```tsx
'use client'

import { FiSearch } from 'react-icons/fi'

interface SearchInAreaButtonProps {
  count: number
  onClick: () => void
}

export default function SearchInAreaButton({ count, onClick }: SearchInAreaButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-sm font-semibold text-dark hover:bg-gray-50 transition-colors"
    >
      <FiSearch size={14} className="text-primary" />
      Buscar nesta área ({count} {count === 1 ? 'imóvel' : 'imóveis'})
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add nextjs/components/imoveis/listing-map/SearchInAreaButton.tsx
git commit -m "Add SearchInAreaButton overlay for map viewport filter"
```

---

## Task 10: Create MobileMapToggle

**Files:**
- Create: `nextjs/components/imoveis/listing-map/MobileMapToggle.tsx`

- [ ] **Step 1: Implement**

Create `nextjs/components/imoveis/listing-map/MobileMapToggle.tsx`:

```tsx
'use client'

import { FiMap, FiList, FiX } from 'react-icons/fi'
import { useListingMapStore } from './useListingMapStore'

interface MobileMapToggleProps {
  count: number
  children: React.ReactNode  // the ListingMapPanel
}

export default function MobileMapToggle({ count, children }: MobileMapToggleProps) {
  const open = useListingMapStore((s) => s.mobileMapOpen) ?? false
  const toggle = useListingMapStore((s) => s.toggleMobileMap)

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => toggle?.()}
          className="md:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-primary text-white rounded-full shadow-lg px-4 py-3 text-sm font-bold"
          aria-label={`Ver ${count} imóveis no mapa`}
        >
          <FiMap size={18} />
          Mapa ({count})
        </button>
      )}

      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <button
            type="button"
            onClick={() => toggle?.()}
            className="absolute top-4 right-4 z-10 bg-white rounded-full shadow-lg p-2"
            aria-label="Fechar mapa"
          >
            <FiX size={20} className="text-dark" />
          </button>
          <button
            type="button"
            onClick={() => toggle?.()}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-primary text-white rounded-full shadow-lg px-4 py-3 text-sm font-bold"
          >
            <FiList size={18} />
            Lista
          </button>
          <div className="w-full h-full">{children}</div>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add nextjs/components/imoveis/listing-map/MobileMapToggle.tsx
git commit -m "Add MobileMapToggle FAB and fullscreen sheet"
```

---

## Task 10b: Create PropertyInfoCard

**Files:**
- Create: `nextjs/components/imoveis/listing-map/PropertyInfoCard.tsx`

- [ ] **Step 1: Implement**

Create `nextjs/components/imoveis/listing-map/PropertyInfoCard.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { imovelSlug } from '../../../utils/imovelUtils'
import { formatPrice } from '../../../utils/imovelUtils'
import type { MapImovel } from '../../../lib/api'

export default function PropertyInfoCard({ imovel }: { imovel: MapImovel }) {
  const slug = imovelSlug({ ...imovel, imagens: [imovel.imagem] } as Parameters<typeof imovelSlug>[0])
  return (
    <div className="w-52">
      {imovel.imagem && (
        <img
          src={imovel.imagem}
          alt={imovel.titulo}
          className="w-full h-24 object-cover mb-2"
          loading="lazy"
        />
      )}
      <p className="text-primary font-bold text-base mb-1">
        {formatPrice(imovel.preco, imovel.tipo)}
      </p>
      <p className="text-xs font-semibold text-dark mb-1 line-clamp-2">{imovel.titulo}</p>
      <p className="text-[11px] text-gray-500 mb-2">
        {imovel.bairro}, {imovel.cidade}
        {imovel.area > 0 ? ` · ${imovel.area} m²` : ''}
        {imovel.quartos > 0 ? ` · ${imovel.quartos} qts` : ''}
      </p>
      <Link
        href={`/imoveis/${slug}`}
        className="block text-center bg-primary text-white text-[11px] font-bold uppercase tracking-wider py-2"
      >
        Ver detalhes
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
cd nextjs && npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add nextjs/components/imoveis/listing-map/PropertyInfoCard.tsx
git commit -m "Add PropertyInfoCard for marker click popups"
```

---

## Task 11: Create ListingMapPanel

**Files:**
- Create: `nextjs/components/imoveis/listing-map/ListingMapPanel.tsx`

- [ ] **Step 1: Implement**

Create `nextjs/components/imoveis/listing-map/ListingMapPanel.tsx`:

```tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { APIProvider, Map, InfoWindow, useMap } from '@vis.gl/react-google-maps'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import PriceMarker from './PriceMarker'
import PropertyInfoCard from './PropertyInfoCard'
import SearchInAreaButton from './SearchInAreaButton'
import { clusterRenderer } from './ClusterRenderer'
import { useListingMapStore } from './useListingMapStore'
import {
  boundsAreaDelta,
  idsInsideBounds,
  type LatLngBoundsLiteral,
} from './viewportBounds'
import { coordsForImovelJittered, DEFAULT_MAP_CENTER, type LatLng } from '../../../lib/bairroCoords'
import type { MapImovel } from '../../../lib/api'
import type { Imovel } from '../../../types'

interface ListingMapPanelProps {
  imoveis: Imovel[]
}

interface PointEntry {
  imovel: MapImovel
  coords: LatLng
}

function toMapImovel(i: Imovel): MapImovel {
  return {
    id: i.id, titulo: i.titulo, preco: i.preco, tipo: i.tipo,
    categoria: i.categoria, quartos: i.quartos, area: i.area,
    bairro: i.bairro, cidade: i.cidade,
    imagem: i.imagens?.[0] ?? '', updated_at: i.updated_at,
  }
}

function ClusterController({ points }: { points: PointEntry[] }) {
  const map = useMap()
  const clustererRef = useRef<MarkerClusterer | null>(null)

  useEffect(() => {
    if (!map) return
    clustererRef.current = new MarkerClusterer({ map, renderer: clusterRenderer })
    return () => {
      clustererRef.current?.clearMarkers()
      clustererRef.current = null
    }
  }, [map])

  // Note: AdvancedMarkers are children of <Map>, so they register themselves
  // with the map. The MarkerClusterer wraps regular markers only — for
  // AdvancedMarker clustering use `@googlemaps/markerclusterer`'s
  // `addMarker` after creating native markers from each point. For this MVP
  // we rely on Google's native zoom-level marker thinning and disable
  // explicit clustering by leaving this controller as a no-op when the API
  // doesn't support advanced markers. The cluster styling will only apply
  // when downgrading to classic markers later.
  // Keeping the controller in place so future migration is one-file.
  return null
}

function BoundsWatcher({
  points, originalBounds,
}: { points: PointEntry[]; originalBounds: LatLngBoundsLiteral | null }) {
  const map = useMap()
  const setFilteredIds = useListingMapStore((s) => s.setFilteredIds)
  const [currentBounds, setCurrentBounds] = useState<LatLngBoundsLiteral | null>(null)

  useEffect(() => {
    if (!map) return
    const listener = map.addListener('idle', () => {
      const b = map.getBounds()
      if (!b) return
      const ne = b.getNorthEast(); const sw = b.getSouthWest()
      setCurrentBounds({
        north: ne.lat(), east: ne.lng(),
        south: sw.lat(), west: sw.lng(),
      })
    })
    return () => listener.remove()
  }, [map])

  const showButton = currentBounds && originalBounds &&
    boundsAreaDelta(currentBounds, originalBounds) >= 0.1

  if (!showButton || !currentBounds) return null
  const ids = idsInsideBounds(points, currentBounds)

  return (
    <SearchInAreaButton
      count={ids.size}
      onClick={() => setFilteredIds?.(ids)}
    />
  )
}

export default function ListingMapPanel({ imoveis }: ListingMapPanelProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const filteredIds = useListingMapStore((s) => s.filteredIds)
  const [activeInfoId, setActiveInfoId] = useState<number | null>(null)

  const points = useMemo<PointEntry[]>(
    () =>
      imoveis
        .map((i) => {
          const coords = coordsForImovelJittered(i.id, i.bairro, i.cidade)
          return coords ? { imovel: toMapImovel(i), coords } : null
        })
        .filter((p): p is PointEntry => p !== null),
    [imoveis],
  )

  const visiblePoints = useMemo(
    () => (filteredIds ? points.filter((p) => filteredIds.has(p.imovel.id)) : points),
    [points, filteredIds],
  )

  const initialBounds = useMemo<LatLngBoundsLiteral | null>(() => {
    if (points.length === 0) return null
    let n = -Infinity, s = Infinity, e = -Infinity, w = Infinity
    for (const { coords } of points) {
      if (coords.lat > n) n = coords.lat
      if (coords.lat < s) s = coords.lat
      if (coords.lng > e) e = coords.lng
      if (coords.lng < w) w = coords.lng
    }
    return { north: n, south: s, east: e, west: w }
  }, [points])

  const activeInfoPoint = useMemo(
    () => (activeInfoId ? points.find((p) => p.imovel.id === activeInfoId) ?? null : null),
    [activeInfoId, points],
  )

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set; listing map will not render.')
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
        Mapa indisponível (configure a chave do Google Maps)
      </div>
    )
  }

  if (points.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
        Nenhum imóvel com localização disponível
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative w-full h-full">
        <Map
          mapId="listing-map"
          defaultCenter={DEFAULT_MAP_CENTER}
          defaultZoom={13}
          defaultBounds={initialBounds ? {
            north: initialBounds.north, south: initialBounds.south,
            east: initialBounds.east, west: initialBounds.west,
          } : undefined}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
        >
          {visiblePoints.map((p) => (
            <PriceMarker
              key={p.imovel.id}
              imovel={p.imovel}
              coords={p.coords}
              onClick={() => setActiveInfoId(p.imovel.id)}
            />
          ))}
          {activeInfoPoint && (
            <InfoWindow position={activeInfoPoint.coords} onCloseClick={() => setActiveInfoId(null)}>
              <PropertyInfoCard imovel={activeInfoPoint.imovel} />
            </InfoWindow>
          )}
          <ClusterController points={visiblePoints} />
          <BoundsWatcher points={points} originalBounds={initialBounds} />
        </Map>
      </div>
    </APIProvider>
  )
}
```

Note on clustering: `@googlemaps/markerclusterer` works with native `google.maps.Marker`, not `<AdvancedMarker>`. For this MVP, AdvancedMarkers are used directly without clustering. If marker overlap becomes a real problem, swap to native markers + clusterer in a follow-up. The `ClusterController` scaffold is kept so the migration is one file.

Update the spec accordingly: see Task 18.

- [ ] **Step 2: Typecheck**

```bash
cd nextjs && npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add nextjs/components/imoveis/listing-map/ListingMapPanel.tsx
git commit -m "Add ListingMapPanel orchestrating Google Map and markers"
```

---

## Task 12: Create ListingMapShell

**Files:**
- Create: `nextjs/components/imoveis/listing-map/ListingMapShell.tsx`

- [ ] **Step 1: Implement**

Create `nextjs/components/imoveis/listing-map/ListingMapShell.tsx`:

```tsx
'use client'

import HoverSyncCard from './HoverSyncCard'
import ListingMapPanel from './ListingMapPanel'
import MobileMapToggle from './MobileMapToggle'
import { ListingMapStoreProvider, useListingMapStore } from './useListingMapStore'
import type { Imovel } from '../../../types'

interface ListingMapShellProps {
  imoveis: Imovel[]
}

const EAGER_LOAD_COUNT = 2

function FilteredList({ imoveis }: { imoveis: Imovel[] }) {
  const filteredIds = useListingMapStore((s) => s.filteredIds)
  const setFilteredIds = useListingMapStore((s) => s.setFilteredIds)
  const visible = filteredIds ? imoveis.filter((i) => filteredIds.has(i.id)) : imoveis

  return (
    <>
      {filteredIds && (
        <div className="mb-4 flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-2 text-sm">
          <span>Filtrado pela área do mapa: {visible.length} imóveis</span>
          <button
            type="button"
            onClick={() => setFilteredIds?.(null)}
            className="text-primary font-semibold hover:underline"
          >
            Limpar filtro
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visible.map((imovel, i) => (
          <HoverSyncCard key={imovel.id} imovel={imovel} priority={i < EAGER_LOAD_COUNT} />
        ))}
      </div>
    </>
  )
}

export default function ListingMapShell({ imoveis }: ListingMapShellProps) {
  return (
    <ListingMapStoreProvider>
      <section className="md:grid md:grid-cols-[60%_40%] md:gap-6 md:min-h-[calc(100vh-4rem)]">
        <div className="md:overflow-y-auto md:max-h-[calc(100vh-4rem)] md:pr-2">
          <FilteredList imoveis={imoveis} />
        </div>
        <div className="hidden md:block md:sticky md:top-16 md:h-[calc(100vh-4rem)]">
          <ListingMapPanel imoveis={imoveis} />
        </div>
      </section>
      <MobileMapToggle count={imoveis.length}>
        <ListingMapPanel imoveis={imoveis} />
      </MobileMapToggle>
    </ListingMapStoreProvider>
  )
}
```

Note: the grid is `md:grid-cols-2` (instead of the previous `md:grid-cols-2 xl:grid-cols-3`) because the list column is narrower in split layout. Three columns would crowd the cards.

- [ ] **Step 2: Typecheck**

```bash
cd nextjs && npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add nextjs/components/imoveis/listing-map/ListingMapShell.tsx
git commit -m "Add ListingMapShell with split-screen layout and mobile toggle"
```

---

## Task 13: Wire into /[acao]/[cidade]/[categoria]

**Files:**
- Modify: `nextjs/app/[acao]/[cidade]/[categoria]/page.tsx`

- [ ] **Step 1: Replace PropertyResultsGrid + ListingMap with ListingMapShell**

Open `nextjs/app/[acao]/[cidade]/[categoria]/page.tsx`. Find this block (around line 250–262):

```tsx
      <PropertyResultsGrid imoveis={imoveis} />

      <ListingMap
        imoveis={imoveis}
        title={`${categoriaData.plural} ${label.toLowerCase()} em ${cidadeName} no mapa`}
      />
```

Replace it with:

```tsx
      <ListingMapShell imoveis={imoveis} />
```

Remove the old imports (PropertyResultsGrid line 5 area, ListingMap import line 11). Add at the top with the other imoveis imports:

```tsx
import ListingMapShell from '../../../../components/imoveis/listing-map/ListingMapShell'
```

- [ ] **Step 2: Typecheck + tests**

```bash
cd nextjs && npx tsc --noEmit && npx vitest run
```

Expected: PASS, 136+ tests still pass.

- [ ] **Step 3: Start dev server and verify in browser**

```bash
cd nextjs && (lsof -t -i :3000 > /dev/null || npm run dev &)
sleep 5
curl -s -o /tmp/cat-page-v2.html -w "HTTP %{http_code}\n" http://localhost:3000/comprar/osasco/apartamento
```

Expected: HTTP 200.

Manually verify in a real browser: split layout on ≥ md viewport, map sticky on right, price chips visible, hover sync working, mobile FAB visible on small viewport. Report what you see before committing.

- [ ] **Step 4: Commit**

```bash
git add 'nextjs/app/[acao]/[cidade]/[categoria]/page.tsx'
git commit -m "Use ListingMapShell on category listing pages"
```

---

## Task 14: Wire into /imoveis

**Files:**
- Modify: `nextjs/app/imoveis/page.tsx`

- [ ] **Step 1: Replace PropertyGrid block with ListingMapShell**

Open `nextjs/app/imoveis/page.tsx`. Find the `<PropertyGrid>` usage in the JSX (currently passes `imoveis` and pagination props). Move pagination to render *below* the shell (the shell only handles the grid + map, not pagination).

Replace `<PropertyGrid imoveis={imoveis} ... />` with:

```tsx
<ListingMapShell imoveis={imoveis} />
<Pagination currentPage={currentPage} total={total} basePath="/imoveis" />
```

(Use whichever `Pagination` component the existing `PropertyGrid` was rendering; check `nextjs/components/imoveis/PropertyGrid.tsx` for the exact import.)

Add import at top:

```tsx
import ListingMapShell from '../../components/imoveis/listing-map/ListingMapShell'
```

- [ ] **Step 2: Typecheck + tests**

```bash
cd nextjs && npx tsc --noEmit && npx vitest run
```

Expected: PASS.

- [ ] **Step 3: Verify in browser**

Load `http://localhost:3000/imoveis` and confirm split layout + pagination below.

- [ ] **Step 4: Commit**

```bash
git add nextjs/app/imoveis/page.tsx
git commit -m "Use ListingMapShell on master catalog page"
```

---

## Task 15: Wire into /[acao]/[cidade]

**Files:**
- Modify: `nextjs/app/[acao]/[cidade]/page.tsx`

- [ ] **Step 1: Replace PropertyResultsGrid with ListingMapShell**

Open `nextjs/app/[acao]/[cidade]/page.tsx`. Find the `<PropertyResultsGrid imoveis={imoveis} />` usage and replace with `<ListingMapShell imoveis={imoveis} />`. Remove the old import; add:

```tsx
import ListingMapShell from '../../../components/imoveis/listing-map/ListingMapShell'
```

- [ ] **Step 2: Typecheck + tests**

```bash
cd nextjs && npx tsc --noEmit && npx vitest run
```

Expected: PASS.

- [ ] **Step 3: Verify in browser**

Load `http://localhost:3000/comprar/osasco` and confirm.

- [ ] **Step 4: Commit**

```bash
git add 'nextjs/app/[acao]/[cidade]/page.tsx'
git commit -m "Use ListingMapShell on cidade listing pages"
```

---

## Task 16: Add fetchPropertiesByBairro and wire into /bairros/[slug]

**Files:**
- Modify: `nextjs/lib/api.ts`
- Modify: `nextjs/app/bairros/[slug]/page.tsx`

- [ ] **Step 1: Add the data fetcher**

Open `nextjs/lib/api.ts`. Locate `fetchProperties` (or similar). Add:

```ts
export async function fetchPropertiesByBairro(bairroSlug: string): Promise<Imovel[]> {
  const { imoveis } = await fetchProperties({
    bairro: bairroSlug,
    limit: 200, // bairros rarely exceed this; safe ceiling
  })
  return imoveis
}
```

Confirm the existing `fetchProperties` accepts a `bairro` filter and matches by the slug or DB name (read its implementation around the same area). If it expects DB name, use `bairroSlugToDbName(bairroSlug)` from `lib/navigation.ts`.

- [ ] **Step 2: Use it in the bairro page**

Open `nextjs/app/bairros/[slug]/page.tsx`. Find the existing `featured` array (currently a small set of destaques rendered around line 275–284). Replace the data fetch for `featured` with:

```ts
const imoveisDoBairro = await fetchPropertiesByBairro(slug)
```

Replace the JSX block that maps over `featured` with the shell:

```tsx
{imoveisDoBairro.length > 0 && (
  <section className="mt-12">
    <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">
      Imóveis em {bairro.nome}
    </h2>
    <ListingMapShell imoveis={imoveisDoBairro} />
  </section>
)}
```

Add the imports:

```ts
import { fetchPropertiesByBairro } from '../../../lib/api'
import ListingMapShell from '../../../components/imoveis/listing-map/ListingMapShell'
```

Remove the now-unused `PropertyCard` import.

- [ ] **Step 3: Typecheck + tests**

```bash
cd nextjs && npx tsc --noEmit && npx vitest run
```

Expected: PASS.

- [ ] **Step 4: Verify in browser**

Load `http://localhost:3000/bairros/centro` (or any populated bairro slug) and confirm the map shows all properties for that bairro.

- [ ] **Step 5: Commit**

```bash
git add nextjs/lib/api.ts 'nextjs/app/bairros/[slug]/page.tsx'
git commit -m "Show all bairro properties on a map in bairro guide pages"
```

---

## Task 17: Remove the old ListingMap component

**Files:**
- Delete: `nextjs/components/imoveis/ListingMap.tsx`

- [ ] **Step 1: Confirm no references**

```bash
grep -rn "imoveis/ListingMap" nextjs --include="*.tsx" --include="*.ts" 2>&1 | grep -v "listing-map/"
```

Expected: no output (only the new `listing-map/` directory should appear, which `grep -v` filters out).

- [ ] **Step 2: Delete and commit**

```bash
git rm nextjs/components/imoveis/ListingMap.tsx
git commit -m "Remove legacy ListingMap component superseded by ListingMapShell"
```

---

## Task 18: Update spec to reflect clustering limitation

**Files:**
- Modify: `docs/superpowers/specs/2026-05-17-quintoandar-map-design.md`

- [ ] **Step 1: Document the MVP clustering limitation**

In the spec, find the "Clusters" subsection under "Visual specification". Add a note:

```markdown
> **MVP note:** `@googlemaps/markerclusterer` requires native `google.maps.Marker` instances, while `<AdvancedMarker>` (used for the price chips) is a DOM-element marker that bypasses the clusterer. The MVP relies on Google's native zoom-level marker handling. If overlap becomes a UX problem at low zoom levels in production, migrate to native markers with HTML icons (one file change in `PriceMarker.tsx`) and re-enable the clusterer.
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-05-17-quintoandar-map-design.md
git commit -m "Document marker clustering MVP limitation"
```

---

## Task 19: Final verification

- [ ] **Step 1: Run the full test suite and typecheck**

```bash
cd nextjs && npx tsc --noEmit && npx vitest run
```

Expected: all tests pass, no type errors.

- [ ] **Step 2: Verify each page in the browser**

For each of these URLs:
- `http://localhost:3000/comprar/osasco/apartamento`
- `http://localhost:3000/imoveis`
- `http://localhost:3000/comprar/osasco`
- `http://localhost:3000/bairros/centro`

Confirm:
- Desktop: split layout with map sticky on the right
- Mobile: FAB visible bottom-right; tapping opens fullscreen map
- Pins show prices, not dots; venda is red, aluguel is green
- Hovering a card scales the matching pin and brings it forward
- Hovering a pin highlights the matching card with a ring
- Panning the map shows "Buscar nesta área"; clicking filters the list
- "Limpar filtro" returns the full list

- [ ] **Step 3: Push and let Vercel deploy**

```bash
git push origin main
```

Expected: pre-push hook (typecheck + vitest) passes; push completes; Vercel kicks off a production build.

After the Vercel build finishes, smoke-test the same four URLs on production (corretoryuri.com.br).

---

## Manual setup (user, before Task 13 can be browser-tested)

The engineer must complete these steps in Google Cloud and Vercel before the map renders:

1. Create or open a Google Cloud project
2. Enable **Maps JavaScript API**
3. Create an API key
4. Restrict by HTTP referrer: `corretoryuri.com.br/*`, `*.vercel.app/*`, `http://localhost:3000/*`
5. Restrict by API: only Maps JavaScript API
6. Enable billing on the project
7. Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<key>` to Vercel env vars for Production, Preview, and Development
8. Pull env vars locally: `vercel env pull`

If the key is missing, the map renders a placeholder block ("Mapa indisponível") and the rest of the page still works — the implementation can proceed through earlier tasks before the key is configured.

---

## Spec coverage check

| Spec requirement | Covered by task |
| --- | --- |
| Google Maps via `@vis.gl/react-google-maps` | 1, 11 |
| `@googlemaps/markerclusterer` | 1, 7, 11, 18 (limitation) |
| Env var + manual setup | 2, "Manual setup" section |
| Per-page Zustand store | 4 |
| `subscribeWithSelector` for granular re-renders | 4 |
| Component file layout (8 files) | 4–12 |
| `jitterCoords` + `coordsForImovelJittered` | 3 |
| Price-chip markers, venda red / aluguel green, active state | 6 |
| Cluster renderer with size buckets | 7 |
| Split-screen desktop, sticky map | 12 |
| Mobile FAB + fullscreen sheet | 10, 12 |
| Hover sync card ↔ marker | 5, 6 |
| `scrollIntoView` from marker to card | 5 |
| `idle` event + "Search in this area" button | 8, 9, 11 |
| Area-delta ≥ 10% threshold | 8, 11 |
| Filtered list with "Limpar filtro" | 12 |
| Marker click → InfoWindow with mini-card | 10b, 11 |
| URL does not change on viewport filter | 12 (no router calls) |
| Four pages wired | 13–16 |
| Cleanup of legacy ListingMap | 17 |
| MVP clustering caveat | 18 |
