 
import jwt from 'jsonwebtoken'
import { loadServiceAccount, type ServiceAccount } from './lib/serviceAccount'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'
const SITE_URL = 'https://corretoryuri.com.br/'
const API = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`

async function getToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const assertion = jwt.sign(
    { iss: account.client_email, scope: SCOPE, aud: TOKEN_URL, exp: now + 3600, iat: now },
    account.private_key,
    { algorithm: 'RS256' },
  )
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  })
  if (!res.ok) throw new Error(`Token failed: ${await res.text()}`)
  return ((await res.json()) as { access_token: string }).access_token
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

interface Row { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }

async function query(token: string, body: Record<string, unknown>): Promise<Row[]> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Query failed ${res.status}: ${await res.text()}`)
  return ((await res.json()) as { rows?: Row[] }).rows ?? []
}

function print(rows: Row[], label: string) {
  console.log(`\n=== ${label} ===`)
  if (rows.length === 0) {
    console.log('  (sem dados — nenhuma impressão registrada no período)')
    return
  }
  for (const r of rows) {
    const key = (r.keys || []).join(' | ')
    console.log(
      `  pos ${(r.position ?? 0).toFixed(1).padStart(5)} | impr ${String(r.impressions ?? 0).padStart(6)} | clk ${String(r.clicks ?? 0).padStart(4)} | ctr ${((r.ctr ?? 0) * 100).toFixed(1).padStart(4)}%  ::  ${key}`,
    )
  }
}

async function main() {
  const account = await loadServiceAccount()
  const token = await getToken(account)
  const startDate = daysAgo(90)
  const endDate = daysAgo(1)
  console.log(`Período: ${startDate} → ${endDate} (últimos 90 dias) | propriedade: ${SITE_URL}`)

  print(await query(token, {
    startDate, endDate, dimensions: ['query'], rowLimit: 50,
    dimensionFilterGroups: [{ filters: [
      { dimension: 'query', operator: 'contains', expression: 'apartamento' },
      { dimension: 'query', operator: 'contains', expression: 'osasco' },
    ] }],
  }), 'Consultas com "apartamento" + "osasco"')

  print(await query(token, { startDate, endDate, dimensions: ['query'], rowLimit: 25 }),
    'Top 25 consultas do site (geral)')

  print(await query(token, {
    startDate, endDate, dimensions: ['query'], rowLimit: 25,
    dimensionFilterGroups: [{ filters: [
      { dimension: 'page', operator: 'equals', expression: 'https://corretoryuri.com.br/comprar/osasco/apartamento' },
    ] }],
  }), 'Consultas que /comprar/osasco/apartamento captura')

  print(await query(token, { startDate, endDate, dimensions: ['page'], rowLimit: 15 }),
    'Top 15 páginas por impressão')

  // Demanda informativa: tudo que contém "osasco", ordenado por impressão
  const osasco = await query(token, {
    startDate, endDate, dimensions: ['query'], rowLimit: 200,
    dimensionFilterGroups: [{ filters: [{ dimension: 'query', operator: 'contains', expression: 'osasco' }] }],
  })
  osasco.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
  print(osasco.slice(0, 40), 'Todas as consultas com "osasco" (por impressão)')

  // Striking distance: pos 8-30 com impressão real = quase página 1
  const all = await query(token, { startDate, endDate, dimensions: ['query'], rowLimit: 1000 })
  const striking = all
    .filter(r => (r.position ?? 99) >= 8 && (r.position ?? 99) <= 30 && (r.impressions ?? 0) >= 2)
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
  print(striking.slice(0, 30), 'Striking distance (pos 8-30, impr>=2) — quase página 1')
}

main().catch(err => { console.error(err); process.exit(1) })
