import { readdir, readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import jwt from 'jsonwebtoken'
import { loadServiceAccount, type ServiceAccount } from './lib/serviceAccount'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const INSPECT_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect'
const SCOPE = 'https://www.googleapis.com/auth/webmasters'
const SITE_URL = 'https://corretoryuri.com.br/'

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

interface InspectResult {
  inspectionResult?: {
    indexStatusResult?: {
      verdict?: string
      coverageState?: string
      robotsTxtState?: string
      indexingState?: string
      lastCrawlTime?: string
      pageFetchState?: string
      googleCanonical?: string
      userCanonical?: string
    }
  }
}

async function inspect(token: string, url: string): Promise<string> {
  const res = await fetch(INSPECT_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
  })
  if (!res.ok) return `ERROR ${res.status}: ${(await res.text()).replace(/\s+/g, ' ').slice(0, 160)}`
  const data = (await res.json()) as InspectResult
  const r = data.inspectionResult?.indexStatusResult
  if (!r) return 'no indexStatusResult'
  const canon = r.googleCanonical && r.googleCanonical !== url ? ` | gCanon=${r.googleCanonical}` : ''
  return `${r.verdict ?? '?'} | ${r.coverageState ?? '?'} | crawl=${r.lastCrawlTime ?? 'never'} | fetch=${r.pageFetchState ?? '?'}${canon}`
}

/** Reads every URL ever submitted, deduplicated, from the indexing archive. */
async function loadUrls(): Promise<string[]> {
  const dir = join(__dirname, 'indexing-submitted')
  const files = await readdir(dir)
  const urls = new Set<string>()
  for (const f of files) {
    if (!f.endsWith('.txt')) continue
    const text = await readFile(join(dir, f), 'utf8')
    for (const line of text.split('\n')) {
      const m = line.match(/https?:\/\/\S+/)
      if (m) urls.add(m[0])
    }
  }
  return [...urls]
}

/** Reads URLs from a newline-delimited file (e.g. an extracted sitemap). */
async function loadFromFile(path: string): Promise<string[]> {
  const text = await readFile(path, 'utf8')
  return text.split('\n').map(l => l.trim()).filter(l => l.startsWith('http'))
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const fileFlag = args.indexOf('--file')
  const cliUrls = args.filter(a => a.startsWith('http'))
  const account = await loadServiceAccount()
  const token = await getToken(account)
  const urls =
    fileFlag !== -1 ? await loadFromFile(args[fileFlag + 1]) : cliUrls.length > 0 ? cliUrls : await loadUrls()
  console.log(`Inspecting ${urls.length} URL(s) against ${SITE_URL}\n`)
  const buckets: Record<string, string[]> = {}
  for (const url of urls) {
    const status = await inspect(token, url)
    const coverage = status.split(' | ')[1] ?? status
    ;(buckets[coverage] ??= []).push(url)
    console.log(`${status}\n   ${url}`)
    await new Promise(r => setTimeout(r, 400))
  }
  console.log('\n=== Summary by coverageState ===')
  for (const [state, list] of Object.entries(buckets).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${list.length}x  ${state}`)
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
