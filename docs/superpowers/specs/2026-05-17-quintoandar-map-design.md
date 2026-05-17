# Quinto Andar–Style Listing Map

Date: 2026-05-17
Status: Approved, ready for implementation plan

## Goal

Replace the current "map below the grid" experience on listing pages with a Quinto Andar–style split layout: scrollable property grid on the left, sticky interactive Google Map on the right (desktop), with a fullscreen toggle on mobile. Pins show prices instead of dots, hovering a card highlights the matching pin (and vice versa), and panning the map exposes a "Search in this area" filter.

## Pages covered

- `app/[acao]/[cidade]/[categoria]/page.tsx`
- `app/imoveis/page.tsx`
- `app/[acao]/[cidade]/page.tsx`
- `app/alugar/page.tsx`
- `app/bairros/[slug]/page.tsx`

The property detail page (`app/imoveis/[slug]`) is **not** in scope. It keeps the existing Leaflet-based `MapaLeaflet` for now.

## Stack decisions

### Map provider: Google Maps
- Library: `@vis.gl/react-google-maps` (React wrapper maintained by the vis.gl team, sanctioned by Google)
- Clustering: `@googlemaps/markerclusterer`
- Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in Vercel (production, preview, development)
- Cost: 28k free loads/month, $7 per additional 1k. Acceptable for current traffic.
- If the key is missing in dev, log `console.warn` and render a placeholder block — do not crash the build.

### State: per-page Zustand store
- Created inside `ListingMapShell` via `createStore` factory so two pages mounted in parallel (e.g., during navigation) don't share state.
- Uses `subscribeWithSelector` so cards and markers only re-render when their own active state flips.

## Component architecture

```
nextjs/components/imoveis/listing-map/
  ListingMapShell.tsx       — entry component, orchestrates split/stack layout + store
  ListingMapPanel.tsx       — wraps <APIProvider> + <Map>, renders markers and cluster
  PriceMarker.tsx           — <AdvancedMarker> with a price-chip DOM element
  ClusterRenderer.ts        — custom renderer for @googlemaps/markerclusterer
  MobileMapToggle.tsx       — FAB + fullscreen sheet on mobile
  SearchInAreaButton.tsx    — floating button on map after pan/zoom
  useListingMapStore.ts     — Zustand store factory
```

### Public API
`<ListingMapShell imoveis={imoveis} sectionTitle="…" />` is the only thing pages import. It replaces both `<PropertyResultsGrid>` and `<ListingMap>` on listing routes.

### Internal contract
- Shell decides layout (split vs stack) via CSS only (no SSR/client divergence)
- Shell passes `imoveis` to `ListingMapPanel`; panel derives marker coords on the client via `useMemo` calling `coordsForImovel` + `jitterCoords`
- Cards and markers read `activeImovelId` and `filteredIds` from the store via selectors
- All cross-component state lives in the store; no prop drilling

## Coordinate handling

The current data stores no per-listing coordinates — `coordsForImovel(id, bairro, cidade)` returns the bairro centroid. With Quinto Andar–style pins (one chip per listing), stacking 8 listings on a single point looks broken even after clustering.

Add `jitterCoords(id, base)` in `lib/bairroCoords.ts`:

```ts
function jitterCoords(id: number, base: LatLng): LatLng {
  const angle = (id * 137.508) % 360       // golden angle, distributes evenly
  const radius = ((id * 31) % 100) / 100 * 0.0008  // ~80m max
  return {
    lat: base.lat + radius * Math.cos(angle * Math.PI / 180),
    lng: base.lng + radius * Math.sin(angle * Math.PI / 180),
  }
}
```

Deterministic per id; the same listing always gets the same offset across renders, refreshes, and devices. Privacy stays equivalent to the bairro centroid (jitter is smaller than typical bairro radius).

## Visual specification

### Price markers
- Container: rounded-md, bg-white, border-l-4 (red `#af1e23` for venda, green `#10b981` for aluguel), shadow-md, px-2 py-1, text-xs font-bold
- Label format: `R$ 450K` (≤ 999.999), `R$ 1,2M` (≥ 1.000.000), `R$ 2.800/mês` (aluguel always with suffix)
- Active state: scale-110, z-index 1000, shadow-lg, fully filled background (matches border color)
- Inactive state: z-index 1

### Clusters
- Custom renderer passed to `MarkerClusterer({ renderer })`
- Circle with primary-color fill (`#af1e23`), white bold text, drop shadow
- Size scales with count: <10 → 36px, <30 → 44px, ≥30 → 52px
- Click → `map.fitBounds(cluster.bounds, { maxZoom: 17 })`

### Tile style
- Use Google Maps default light style for now (matches Quinto Andar baseline)
- A custom `styles` array can be added later if we want to mute POIs more aggressively — out of scope for this spec

## Layout

### Desktop (≥ md)

```
┌─ Header (existing, sticky, h-16) ───────────────────────┐
├─ Breadcrumb + H1 + filter chips (full width) ───────────┤
├─ Split section ─────────────────────────────────────────┤
│ Grid (60% width)              │ Map (40% width)         │
│ md:overflow-y-auto            │ md:sticky md:top-16     │
│ md:max-h-[calc(100vh-64px)]   │ md:h-[calc(100vh-64px)] │
├─────────────────────────────────────────────────────────┤
│ Bairros suggested / cross-category / SEO content        │
│ (full width, below split)                               │
└─────────────────────────────────────────────────────────┘
```

The split section is the natural viewport-height block. Page sections that today live below the grid (BairrosRecomendados, CrossCategoryLinks, AmplieChances, SEO copy) render full-width below the split.

### Mobile (< md)
- Grid renders normally, same as today
- Floating FAB bottom-right: red circle, map icon + counter (e.g., "Mapa (44)")
- Tap FAB → `fixed inset-0 z-50 bg-white` overlay with:
  - Google Map fullscreen
  - Close (X) top-right
  - "Lista" FAB bottom-right to dismiss
  - Tap pin → bottom sheet with mini property card, slide-up

## Interactions

### Hover sync (desktop only)
- Card `onMouseEnter` → `store.setActive(id)` → matching marker scales/elevates
- Card `onMouseLeave` → `store.setActive(null)`
- Marker `mouseenter` → `store.setActive(id)` → matching card gets `ring-2 ring-primary` and `scrollIntoView({ behavior: 'smooth', block: 'nearest' })`
- Marker `mouseleave` → `store.setActive(null)`

### Click
- Card click → existing behavior (navigate to property detail)
- Marker click → opens `InfoWindow` with the same mini-card content (image, price, title, bairro, "Ver detalhes" CTA)

### Viewport filter ("Buscar nesta área")
- Map `idle` event fires after pan/zoom settles
- Compute current bounds; compare to bounds in effect when the current list was generated
- If the area delta (new bounds area / original bounds area, normalized) differs by ≥ 10%, show `SearchInAreaButton` overlaid at the top of the map: "Buscar nesta área (X imóveis)"
- Click → `store.setFilteredIds(idsInsideBounds)` → grid filters client-side
- When `filteredIds` is non-null, show "Limpar filtro do mapa" at top of the list
- URL does **not** change — keeps SEO canonical clean, avoids re-fetch loops

## Performance

- Google Maps script loads via `<APIProvider>` once per page (vis.gl handles dedup)
- Markers use `AdvancedMarkerElement` with HTML content — Google batches these efficiently
- Cards subscribe to the store with a selector keyed by their own id so a hover only re-renders two cards (previously active + newly active)
- Viewport filter computation is debounced by Google's native `idle` event (~150ms after movement stops)
- The whole listing map bundle is loaded only by listing pages, not by the rest of the site

## SEO

- The grid still renders server-side with all properties (no behavior change in initial HTML)
- Map is a client component; no impact on indexable content
- Viewport filter is client-only and does not modify URL — no canonical/index implications

## Out of scope (deferred)

- Migrating the property detail page (`MapaLeaflet`) to Google Maps
- Custom Google Maps `styles` array (using default light style for now)
- Saving the user's last viewed area between sessions
- Map-based heatmap of average prices per bairro
- Drawing tools (draw an area to filter)

## Manual setup required from user

1. Create or open a Google Cloud project
2. Enable **Maps JavaScript API**
3. Create an API key
4. Restrict it by HTTP referrer: `corretoryuri.com.br/*`, `*.vercel.app/*`, `http://localhost:3000/*`
5. Restrict it by API: only Maps JavaScript API
6. Enable billing on the project (required even for free tier)
7. Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<key>` to Vercel env vars for Production, Preview, and Development
8. Pull env vars locally: `vercel env pull`

## Acceptance criteria

- All 5 listing pages render the split layout on desktop and the FAB-toggled fullscreen on mobile
- Pins display prices in the Quinto Andar format (not dots), color-coded by tipo
- Clusters show counts with primary-color circles
- Hovering a card highlights its pin; hovering a pin highlights and scrolls to its card
- Panning the map shows "Buscar nesta área"; clicking filters the list
- Listing pages still pass typecheck, lint, and existing tests
- First load size of category page does not regress by more than 30 KB (Google Maps script is the main addition)
