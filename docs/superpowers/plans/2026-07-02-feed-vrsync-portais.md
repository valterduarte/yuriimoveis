# VRSync Portal Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a VRSync XML feed at `/api/feed/imoveis.xml` so active properties syndicate automatically to ZAP / Viva Real / OLX (Grupo OLX), with a per-property opt-out.

**Architecture:** A Next.js Route Handler queries active + syndicable properties and renders the Grupo OLX `ListingDataFeed` (VRSync) XML via pure mapper functions. The feed's cache is tagged `CACHE_TAG_IMOVEIS`, so the existing `revalidateTag(CACHE_TAG_IMOVEIS)` calls on property create/update/delete already invalidate it. A `sindicar_portais` boolean column (default true) plus an admin checkbox controls inclusion.

**Tech Stack:** Next.js App Router (Route Handlers, `unstable_cache`), Postgres (`getDb`), TypeScript, Vitest.

## Global Constraints

- Language of code comments/UI copy: Portuguese (PT-BR), matching the codebase.
- Sensitive fields `torre`, `numero_apartamento`, `observacoes` MUST NEVER appear in the feed.
- Broker contact from `lib/config.ts`: `BROKER_NAME='Yuri'`, `PHONE_STRUCTURED='+5511972563420'`, `CRECI='235509'`, `SITE_URL`. Advertiser email = `valter.rduarte@gmail.com`.
- VRSync namespace: `http://www.vivareal.com/schemas/1.0/VRSync`, schema `http://xml.vivareal.com/vrsync.xsd`.
- VRSync constraints: `ListingID` 1–50 chars; `Title` 10–100 chars, no HTML; `Description` 50–3000 chars, no HTML (use CDATA); prices/areas integer-only.
- Follow existing `lib/` patterns: pure functions, `.test.ts` colocated, cached fetch + public wrapper with `logDbError` fallback.

---

### Task 1: VRSync mapping helpers (pure)

Maps the app's enums/fields to VRSync vocabulary. No I/O.

**Files:**
- Create: `nextjs/lib/portalFeed/vrsyncMapping.ts`
- Test: `nextjs/lib/portalFeed/vrsyncMapping.test.ts`

**Interfaces:**
- Produces:
  - `type VrsyncPropertyMapping = { propertyType: string; usageType: 'Residential' | 'Commercial'; areaField: 'LivingArea' | 'LotArea' }`
  - `mapCategoria(categoria: Imovel['categoria']): VrsyncPropertyMapping`
  - `mapTransactionType(tipo: Imovel['tipo']): 'For Sale' | 'For Rent'`
  - `mapFeatures(diferenciais: string[]): string[]` — returns only recognized VRSync `Feature` values, deduped, unknown dropped.

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from 'vitest'
import { mapCategoria, mapTransactionType, mapFeatures } from './vrsyncMapping'

describe('mapCategoria', () => {
  it('maps casa to Residential / Home with LivingArea', () => {
    expect(mapCategoria('casa')).toEqual({ propertyType: 'Residential / Home', usageType: 'Residential', areaField: 'LivingArea' })
  })
  it('maps apartamento to Residential / Apartment', () => {
    expect(mapCategoria('apartamento').propertyType).toBe('Residential / Apartment')
  })
  it('maps terreno to Land Lot using LotArea', () => {
    expect(mapCategoria('terreno')).toEqual({ propertyType: 'Residential / Land Lot', usageType: 'Residential', areaField: 'LotArea' })
  })
  it('maps chacara to Farm Ranch using LotArea', () => {
    expect(mapCategoria('chacara')).toEqual({ propertyType: 'Residential / Farm Ranch', usageType: 'Residential', areaField: 'LotArea' })
  })
  it('maps comercial to Commercial usage', () => {
    expect(mapCategoria('comercial').usageType).toBe('Commercial')
  })
  it('maps chale to a residential home', () => {
    expect(mapCategoria('chale').usageType).toBe('Residential')
  })
})

describe('mapTransactionType', () => {
  it('maps venda to For Sale', () => { expect(mapTransactionType('venda')).toBe('For Sale') })
  it('maps aluguel to For Rent', () => { expect(mapTransactionType('aluguel')).toBe('For Rent') })
})

describe('mapFeatures', () => {
  it('keeps recognized features and drops unknown', () => {
    expect(mapFeatures(['Piscina', 'Churrasqueira', 'Alienígenas'])).toEqual(['Pool', 'Barbecue Grill'])
  })
  it('dedupes', () => {
    expect(mapFeatures(['Piscina', 'piscina'])).toEqual(['Pool'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails** — `cd nextjs && npx vitest run lib/portalFeed/vrsyncMapping.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement**

```ts
import type { Imovel } from '../../types'

export type VrsyncPropertyMapping = {
  propertyType: string
  usageType: 'Residential' | 'Commercial'
  areaField: 'LivingArea' | 'LotArea'
}

const CATEGORIA_MAP: Record<Imovel['categoria'], VrsyncPropertyMapping> = {
  casa:        { propertyType: 'Residential / Home',      usageType: 'Residential', areaField: 'LivingArea' },
  apartamento: { propertyType: 'Residential / Apartment', usageType: 'Residential', areaField: 'LivingArea' },
  terreno:     { propertyType: 'Residential / Land Lot',  usageType: 'Residential', areaField: 'LotArea' },
  chale:       { propertyType: 'Residential / Home',      usageType: 'Residential', areaField: 'LivingArea' },
  comercial:   { propertyType: 'Commercial / Building',   usageType: 'Commercial', areaField: 'LivingArea' },
  chacara:     { propertyType: 'Residential / Farm Ranch',usageType: 'Residential', areaField: 'LotArea' },
}

export function mapCategoria(categoria: Imovel['categoria']): VrsyncPropertyMapping {
  return CATEGORIA_MAP[categoria] ?? CATEGORIA_MAP.casa
}

export function mapTransactionType(tipo: Imovel['tipo']): 'For Sale' | 'For Rent' {
  return tipo === 'aluguel' ? 'For Rent' : 'For Sale'
}

// Free-text PT differentiators → official VRSync Feature enum. Unknown terms dropped.
const FEATURE_MAP: Record<string, string> = {
  'piscina': 'Pool',
  'churrasqueira': 'Barbecue Grill',
  'academia': 'Gym',
  'elevador': 'Elevator',
  'sauna': 'Sauna',
  'salao de festas': 'Party Hall',
  'playground': 'Playground',
  'portaria 24h': 'Security Guard on Duty',
  'seguranca 24h': 'Security Guard on Duty',
  'area de servico': 'Service Area',
  'varanda': 'Balcony',
  'varanda gourmet': 'Gourmet Area',
  'ar condicionado': 'Air Conditioning',
  'mobiliado': 'Furnished',
  'aceita pet': 'Pets Allowed',
  'aceita pets': 'Pets Allowed',
  'jardim': 'Garden Area',
  'quadra': 'Sports Court',
  'quadra poliesportiva': 'Sports Court',
}

function normalizeFeatureKey(raw: string): string {
  return raw.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function mapFeatures(diferenciais: string[]): string[] {
  const out: string[] = []
  for (const term of diferenciais) {
    const mapped = FEATURE_MAP[normalizeFeatureKey(term)]
    if (mapped && !out.includes(mapped)) out.push(mapped)
  }
  return out
}
```

> Note: `Barbecue Grill`, `Party Hall`, `Service Area`, `Balcony`, `Sports Court` are the assumed VRSync Feature labels. During implementation, confirm each against the official Feature list (https://developers.grupozap.com/feeds/vrsync/elements/details.html) and correct any mismatched label. Drop any that have no official equivalent rather than emitting an invalid one.

- [ ] **Step 4: Run tests** → PASS. (Adjust expected feature labels in the test if the official list differs; keep test and impl in sync.)

- [ ] **Step 5: Commit** — `git add nextjs/lib/portalFeed && git commit -m "Add VRSync enum and feature mapping helpers"`

---

### Task 2: VRSync XML feed builder (pure)

Renders one `Listing` and the full `ListingDataFeed` document. No I/O.

**Files:**
- Create: `nextjs/lib/portalFeed/vrsyncFeed.ts`
- Test: `nextjs/lib/portalFeed/vrsyncFeed.test.ts`

**Interfaces:**
- Consumes: `mapCategoria`, `mapTransactionType`, `mapFeatures` from Task 1; `Imovel` type.
- Produces:
  - `buildVrsyncFeed(imoveis: Imovel[], publishedAt?: Date): string` — returns the full XML document string.

**Behavior requirements (encode as tests):**
- Root `<ListingDataFeed>` carries the VRSync namespace + `<Header>` with Provider, Email (`valter.rduarte@gmail.com`), ContactName (`Yuri`), PublishDate (ISO, seconds precision), Telephone.
- Each property → one `<Listing>` with `ListingID` (the id), `Title` (clamped to 10–100 chars), `TransactionType`, `<Details>` (Description in CDATA clamped to 50–3000, PropertyType, UsageType, price element by transaction type with `currency="BRL"`, area element chosen by `areaField`, Bedrooms/Bathrooms/Garage when > 0, `<Features>` from `mapFeatures`), `<Location displayAddress="Street">` (Country BR, State abbr, City, Neighborhood, Address, PostalCode, Lat/Lng when present), `<ContactInfo>` (Name/Email/Telephone), `<Media>` (each image as `<Item medium="image" .../>`, first `primary="true"`; `video_url` as `<Item medium="video">` when present).
- All text is XML-escaped; sensitive fields never referenced (the builder only reads public `Imovel` fields — `torre`/`numero_apartamento`/`observacoes` are never accessed).

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from 'vitest'
import { buildVrsyncFeed } from './vrsyncFeed'
import type { Imovel } from '../../types'

const base: Imovel = {
  id: 42, titulo: 'Apartamento com 2 quartos no Centro', descricao: 'a'.repeat(60),
  descricao_seo: '', tipo: 'venda', categoria: 'apartamento', preco: 350000, area: 68,
  quartos: 2, banheiros: 1, vagas: 1, endereco: 'Rua das Flores', bairro: 'Centro',
  cidade: 'Osasco', cep: '06010-000', status: 'pronto', destaque: false, ativo: true,
  imagens: ['https://img/1.jpg', 'https://img/2.jpg'], diferenciais: ['Piscina'],
  parcela_display: '', parcela_label: '', created_at: '', updated_at: '',
  estado: 'SP', lat: -23.5, lng: -46.7, video_url: null,
}

describe('buildVrsyncFeed', () => {
  it('wraps listings in a namespaced ListingDataFeed with a Header', () => {
    const xml = buildVrsyncFeed([base], new Date('2026-07-02T10:00:00Z'))
    expect(xml).toContain('<ListingDataFeed')
    expect(xml).toContain('http://www.vivareal.com/schemas/1.0/VRSync')
    expect(xml).toContain('<Email>valter.rduarte@gmail.com</Email>')
  })
  it('renders a For Sale listing with ListPrice and PropertyType', () => {
    const xml = buildVrsyncFeed([base])
    expect(xml).toContain('<ListingID>42</ListingID>')
    expect(xml).toContain('<TransactionType>For Sale</TransactionType>')
    expect(xml).toContain('<ListPrice currency="BRL">350000</ListPrice>')
    expect(xml).toContain('<PropertyType>Residential / Apartment</PropertyType>')
    expect(xml).toContain('<LivingArea unit="square metres">68</LivingArea>')
  })
  it('uses RentalPrice for rentals', () => {
    const xml = buildVrsyncFeed([{ ...base, tipo: 'aluguel' }])
    expect(xml).toContain('<TransactionType>For Rent</TransactionType>')
    expect(xml).toContain('<RentalPrice currency="BRL" period="Monthly">350000</RentalPrice>')
  })
  it('marks the first image primary and adds video items', () => {
    const xml = buildVrsyncFeed([{ ...base, video_url: 'https://youtu.be/x' }])
    expect(xml).toContain('<Item medium="image" primary="true">https://img/1.jpg</Item>')
    expect(xml).toContain('<Item medium="video">https://youtu.be/x</Item>')
  })
  it('escapes XML-special characters in text', () => {
    const xml = buildVrsyncFeed([{ ...base, bairro: 'Vila A & B' }])
    expect(xml).toContain('<Neighborhood>Vila A &amp; B</Neighborhood>')
  })
  it('clamps a too-short title to at least 10 chars', () => {
    const xml = buildVrsyncFeed([{ ...base, titulo: 'Casa' }])
    expect(xml).toMatch(/<Title>.{10,100}<\/Title>/s)
  })
})
```

- [ ] **Step 2: Run test to verify it fails** — `cd nextjs && npx vitest run lib/portalFeed/vrsyncFeed.test.ts` → FAIL.

- [ ] **Step 3: Implement** `vrsyncFeed.ts` using the mappers and these helpers:
  - `escapeXml(s)` → replace `& < > " '`.
  - `clamp(s, min, max, pad)` for Title (pad short titles with `` — {bairro}, {cidade} `` context, then slice to 100).
  - `cdata(s)` wraps Description (strip HTML tags, clamp 50–3000; pad short with the title/bairro if needed).
  - Header pulls from `lib/config.ts` (`BROKER_NAME`, `PHONE_STRUCTURED`, `CRECI`) + the constant `ADVERTISER_EMAIL='valter.rduarte@gmail.com'` (define locally or import a new `BROKER_EMAIL` from config — see Task 3).
  - Build each `<Listing>` per the behavior requirements. Price element chosen by `mapTransactionType`. Area element chosen by `mapCategoria(...).areaField`. Bedrooms/Bathrooms/Garage emitted only when the value is > 0. `State abbreviation` from `imovel.estado ?? 'SP'`.
  - `displayAddress="Street"`; put `endereco` in `<Address>`; never emit unit/tower.

- [ ] **Step 4: Run tests** → PASS.

- [ ] **Step 5: Commit** — `git commit -am "Add VRSync XML feed builder"`

---

### Task 3: Schema, migration, config, and data-layer fetch

Adds the opt-out column, exposes it on the type, and provides the fetch the route uses.

**Files:**
- Create: `nextjs/migrations/008_add_sindicar_portais_to_imoveis.sql`
- Modify: `nextjs/types/index.ts` (add `sindicar_portais?: boolean` to `Imovel`)
- Modify: `nextjs/lib/config.ts` (add `BROKER_EMAIL`)
- Modify: `nextjs/lib/properties.ts` (add cached `fetchSyndicatableProperties` + public wrapper)
- Modify: `nextjs/lib/api.ts` (re-export the new fetch if that's the barrel — verify)
- Test: `nextjs/lib/properties.test.ts` (extend if it covers `parseImovel`)

**Interfaces:**
- Produces: `fetchSyndicatableProperties(): Promise<Imovel[]>` — active AND `sindicar_portais = true`, ordered `created_at DESC`, reasonable LIMIT (1000). Consumed by Task 4.
- Produces: `BROKER_EMAIL: string` from config.

- [ ] **Step 1: Write the migration**

```sql
-- 008_add_sindicar_portais_to_imoveis.sql
-- Per-property opt-out for portal (VRSync) syndication. Defaults true so all
-- existing active listings are included automatically.
ALTER TABLE imoveis
  ADD COLUMN IF NOT EXISTS sindicar_portais BOOLEAN NOT NULL DEFAULT true;
```

- [ ] **Step 2: Apply the migration** using the project's migration runner (check `nextjs/scripts` / `package.json` for the migrate command; run it against the dev DB). Expected: column added, existing rows = true.

- [ ] **Step 3: Add `BROKER_EMAIL` to `lib/config.ts`**

```ts
// Advertiser e-mail published in the portal (VRSync) feed. Change here to update everywhere.
export const BROKER_EMAIL: string = 'valter.rduarte@gmail.com'
```

- [ ] **Step 4: Add `sindicar_portais?: boolean` to the `Imovel` interface** in `types/index.ts` (near `ativo`). `parseImovel` already spreads the row, so it flows through; no strip needed (it's not sensitive).

- [ ] **Step 5: Add the cached fetch + wrapper to `lib/properties.ts`** (mirror `fetchAllPropertySlugsCached` shape)

```ts
const fetchSyndicatablePropertiesCached = unstable_cache(
  async (): Promise<Imovel[]> => {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true AND sindicar_portais = true ORDER BY created_at DESC LIMIT 1000`
    )
    return result.rows.map(parseImovel)
  },
  ['fetchSyndicatableProperties'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: LISTING_REVALIDATE_SECONDS }
)

export async function fetchSyndicatableProperties(): Promise<Imovel[]> {
  try {
    return await fetchSyndicatablePropertiesCached()
  } catch (err) {
    logDbError('fetchSyndicatableProperties', err)
    return []
  }
}
```

- [ ] **Step 6: Verify the barrel** — if `lib/api.ts` re-exports from `properties.ts`, ensure `fetchSyndicatableProperties` is exported. Run `cd nextjs && npx tsc --noEmit`.

- [ ] **Step 7: Commit** — `git commit -am "Add sindicar_portais column, config email, and syndication fetch"`

---

### Task 4: Feed route handler

Serves the XML at a stable public URL, cached and auto-invalidated via `CACHE_TAG_IMOVEIS`.

**Files:**
- Create: `nextjs/app/api/feed/imoveis.xml/route.ts`

**Interfaces:**
- Consumes: `fetchSyndicatableProperties` (Task 3), `buildVrsyncFeed` (Task 2).

- [ ] **Step 1: Implement the route**

```ts
import { fetchSyndicatableProperties } from '../../../../lib/properties'
import { buildVrsyncFeed } from '../../../../lib/portalFeed/vrsyncFeed'

export const revalidate = 300 // seconds; also busted on demand via CACHE_TAG_IMOVEIS

export async function GET() {
  const imoveis = await fetchSyndicatableProperties()
  const xml = buildVrsyncFeed(imoveis)
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
```

> Verify against the Next.js skill: because `fetchSyndicatableProperties` is wrapped in `unstable_cache` tagged `CACHE_TAG_IMOVEIS`, the existing `revalidateTag(CACHE_TAG_IMOVEIS)` on property write already refreshes the feed data. Confirm the route is statically cacheable (no dynamic request usage).

- [ ] **Step 2: Manual verify** — `cd nextjs && npm run dev`, then `curl -s localhost:3000/api/feed/imoveis.xml | head -40`. Expected: valid `<ListingDataFeed>` XML with your active listings. Validate well-formedness: `curl -s localhost:3000/api/feed/imoveis.xml | xmllint --noout -` → no errors.

- [ ] **Step 3: Commit** — `git add nextjs/app/api/feed && git commit -m "Serve VRSync property feed at /api/feed/imoveis.xml"`

---

### Task 5: Admin opt-out persistence + checkbox

Lets the broker exclude a property from portals.

**Files:**
- Modify: `nextjs/lib/schemas.ts` (add `sindicar_portais` to `imovelCreateSchema` / update schema, default true)
- Modify: `nextjs/app/api/imoveis/route.ts` (POST insert includes the column)
- Modify: `nextjs/app/api/imoveis/[id]/route.ts` (PUT update includes the column)
- Modify: admin form component(s) under `nextjs/app/admin/imoveis/novo/page.tsx` and `nextjs/app/admin/imoveis/[id]/page.tsx` (or their shared form) — add the checkbox.

**Interfaces:**
- Consumes: the `sindicar_portais` column (Task 3).

- [ ] **Step 1: Add to the zod schema** — in `imovelCreateSchema` (and the update schema if separate): `sindicar_portais: z.boolean().optional().default(true)`.

- [ ] **Step 2: Persist in POST** — add `sindicar_portais` to the INSERT column list, params (`data.sindicar_portais ?? true`), and `$N` placeholder in `app/api/imoveis/route.ts`.

- [ ] **Step 3: Persist in PUT** — mirror the same addition in `app/api/imoveis/[id]/route.ts` UPDATE. Read the file first to match its exact statement shape.

- [ ] **Step 4: Add the checkbox to the admin form** — a labeled checkbox **"Publicar nos portais (OLX / ZAP / Viva Real)"** bound to the form state, default checked, following the existing `destaque` checkbox pattern in the same form. Include it in the create and edit payloads.

- [ ] **Step 5: Manual verify** — in dev: create a property with the box unchecked → it must NOT appear in `/api/feed/imoveis.xml`; edit an existing one to unchecked → it disappears from the feed after revalidation. Re-check → reappears.

- [ ] **Step 6: Typecheck + build** — `cd nextjs && npx tsc --noEmit && npm run build`. Expected: clean.

- [ ] **Step 7: Commit** — `git commit -am "Add 'publish to portals' opt-out to admin property form"`

---

## Self-Review notes

- **Spec coverage:** endpoint (T4), data selection + sensitive exclusion (T2/T3), opt-out column + admin (T3/T5), VRSync mapping (T1/T2), cache invalidation (reused `CACHE_TAG_IMOVEIS`, T3/T4), tests (T1/T2 + manual T4/T5), config email (T3). All spec sections covered.
- **Open verification during build:** confirm exact VRSync `Feature` labels and that Route Handler static caching behaves as assumed (consult the nextjs skill). Fetch the official element pages before finalizing T1/T2 rather than trusting the labels verbatim.
- **Not automatable here:** opening portal accounts and registering the feed URL in Canal Pro — user's responsibility.
