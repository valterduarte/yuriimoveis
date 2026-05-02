/**
 * One-shot script that geocodes every neighborhood configured in
 * data/bairros.ts via OpenStreetMap Nominatim and prints the resulting
 * coordinates as the body of BAIRRO_CENTROIDS in lib/bairroCoords.ts.
 *
 * Run:
 *   npx tsx scripts/fetch-bairro-coords.ts
 *
 * Apply:
 *   Replace the BAIRRO_CENTROIDS literal in lib/bairroCoords.ts with
 *   the printed block. Manually verify the misses (logged at the end).
 *
 * Nominatim usage policy:
 *   - Send a meaningful User-Agent (required).
 *   - Throttle to 1 request per second.
 *   See https://operations.osmfoundation.org/policies/nominatim/
 */

import { BAIRROS } from '../data/bairros'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'corretor-yuri-imoveis-bairro-geocoder/1.0 (contato@corretoryuri.com.br)'
const THROTTLE_MS = 1100

interface NominatimResult {
  lat: string
  lon: string
  display_name: string
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function geocode(query: string): Promise<{ lat: number; lng: number; display: string } | null> {
  const url = `${NOMINATIM_URL}?${new URLSearchParams({
    q: query,
    format: 'json',
    limit: '1',
    countrycodes: 'br',
  })}`

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'pt-BR' },
  })

  if (!response.ok) {
    throw new Error(`Nominatim ${response.status} for query "${query}"`)
  }

  const data = await response.json() as NominatimResult[]
  if (data.length === 0) return null
  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
    display: data[0].display_name,
  }
}

async function main() {
  const found: { slug: string; nome: string; cidade: string; lat: number; lng: number; source: string }[] = []
  const missed: { slug: string; nome: string; cidade: string; queries: string[] }[] = []

  for (const bairro of Object.values(BAIRROS)) {
    const queries = [
      `${bairro.nome}, ${bairro.cidade}, SP, Brasil`,
      `${bairro.nome}, ${bairro.cidade}`,
      `Bairro ${bairro.nome}, ${bairro.cidade}`,
    ]

    let hit: Awaited<ReturnType<typeof geocode>> = null
    let usedQuery = ''

    for (const q of queries) {
      try {
        hit = await geocode(q)
        await sleep(THROTTLE_MS)
        if (hit) {
          usedQuery = q
          break
        }
      } catch (err) {
        console.error(`  ! ${q} → ${err instanceof Error ? err.message : err}`)
        await sleep(THROTTLE_MS)
      }
    }

    if (hit) {
      found.push({
        slug: bairro.slug,
        nome: bairro.nome,
        cidade: bairro.cidade,
        lat: hit.lat,
        lng: hit.lng,
        source: usedQuery,
      })
      console.log(`  ✓ ${bairro.slug.padEnd(28)}  lat: ${hit.lat.toFixed(4)}  lng: ${hit.lng.toFixed(4)}`)
    } else {
      missed.push({ slug: bairro.slug, nome: bairro.nome, cidade: bairro.cidade, queries })
      console.log(`  ✗ ${bairro.slug.padEnd(28)}  not found`)
    }
  }

  console.log('\n// ----- Paste the block below into lib/bairroCoords.ts -----\n')
  console.log('const BAIRRO_CENTROIDS: Record<string, LatLng> = {')
  for (const b of found) {
    const padding = ' '.repeat(Math.max(1, 28 - b.slug.length))
    console.log(`  '${b.slug}':${padding}{ lat: ${b.lat.toFixed(4)}, lng: ${b.lng.toFixed(4)} }, // ${b.cidade} (${b.source.split(',')[0]})`)
  }
  console.log('}')

  if (missed.length > 0) {
    console.log('\n// ----- Misses (need manual lookup) -----\n')
    for (const m of missed) {
      console.log(`  ${m.slug} (${m.nome}, ${m.cidade}) — tried: ${m.queries.join(' | ')}`)
    }
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
