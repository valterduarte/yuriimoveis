import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import jwt from 'jsonwebtoken'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCRIPTS_DIR = __dirname
const PROJECT_ROOT = join(__dirname, '..')
const SERVICE_ACCOUNT_PATH = join(PROJECT_ROOT, 'service-account.json')
const DEFAULT_QUEUE_FILE = join(SCRIPTS_DIR, 'indexing-queue.txt')
const ARCHIVE_DIR = join(SCRIPTS_DIR, 'indexing-submitted')

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const INDEXING_URL = 'https://indexing.googleapis.com/v3/urlNotifications:publish'
const SCOPE = 'https://www.googleapis.com/auth/indexing'

interface ServiceAccount {
  client_email: string
  private_key: string
}

interface SubmitResult {
  url: string
  status: 'ok' | 'failed'
  detail?: string
}

async function loadServiceAccount(): Promise<ServiceAccount> {
  const fromEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (fromEnv) return JSON.parse(fromEnv) as ServiceAccount

  if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    throw new Error(
      `No service account credentials found. Set GOOGLE_SERVICE_ACCOUNT_JSON env var ` +
      `or place service-account.json at ${SERVICE_ACCOUNT_PATH}`
    )
  }
  return JSON.parse(await readFile(SERVICE_ACCOUNT_PATH, 'utf-8')) as ServiceAccount
}

async function getAccessToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const assertion = jwt.sign(
    { iss: account.client_email, scope: SCOPE, aud: TOKEN_URL, exp: now + 3600, iat: now },
    account.private_key,
    { algorithm: 'RS256' },
  )

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status} ${await response.text()}`)
  }

  const data = (await response.json()) as { access_token: string }
  return data.access_token
}

async function submitUrl(url: string, accessToken: string): Promise<SubmitResult> {
  const response = await fetch(INDEXING_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  })

  if (!response.ok) {
    const detail = `${response.status} ${await response.text()}`
    console.error(`✗ ${url} — ${detail}`)
    return { url, status: 'failed', detail }
  }

  console.log(`✓ ${url}`)
  return { url, status: 'ok' }
}

function parseQueueContent(raw: string): string[] {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'))
}

async function readQueueFile(path: string): Promise<string[]> {
  const raw = await readFile(path, 'utf-8')
  return parseQueueContent(raw)
}

function parseArgs(argv: string[]): { queuePath: string | null; cliUrls: string[] } {
  const args = argv.slice(2)
  const queueIdx = args.indexOf('--from-file')
  if (queueIdx !== -1) {
    const path = args[queueIdx + 1]
    if (!path) throw new Error('--from-file requires a path argument')
    return { queuePath: path, cliUrls: [] }
  }
  if (args.includes('--queue')) {
    return { queuePath: DEFAULT_QUEUE_FILE, cliUrls: [] }
  }
  return { queuePath: null, cliUrls: args }
}

async function archiveSubmittedQueue(queuePath: string, results: SubmitResult[]): Promise<void> {
  await mkdir(ARCHIVE_DIR, { recursive: true })
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const archivePath = join(ARCHIVE_DIR, `${timestamp}.txt`)
  const summary = results
    .map(r => `${r.status === 'ok' ? '✓' : '✗'} ${r.url}${r.detail ? ' — ' + r.detail : ''}`)
    .join('\n')
  await writeFile(archivePath, summary + '\n', 'utf-8')

  const failed = results.filter(r => r.status === 'failed').map(r => r.url)
  const header =
    `# Indexing queue — URLs awaiting submission to Google Indexing API\n` +
    `# Format: one URL per line. Lines starting with # are ignored.\n` +
    `# Failed URLs from last run (if any) are retained for retry.\n\n`
  await writeFile(queuePath, header + failed.join('\n') + (failed.length ? '\n' : ''), 'utf-8')
}

async function main(): Promise<void> {
  const { queuePath, cliUrls } = parseArgs(process.argv)
  let urls: string[]
  let resolvedQueuePath: string | null = null

  if (queuePath) {
    resolvedQueuePath = queuePath
    urls = await readQueueFile(queuePath)
    if (urls.length === 0) {
      console.log(`Queue file ${queuePath} is empty — nothing to submit.`)
      return
    }
  } else if (cliUrls.length > 0) {
    urls = cliUrls
  } else {
    console.error('Usage:')
    console.error('  tsx scripts/submit-indexing.ts <url1> [url2] ...')
    console.error('  tsx scripts/submit-indexing.ts --from-file <path>')
    console.error('  tsx scripts/submit-indexing.ts --queue   (uses scripts/indexing-queue.txt)')
    process.exit(1)
  }

  const account = await loadServiceAccount()
  const accessToken = await getAccessToken(account)

  console.log(`Submitting ${urls.length} URL(s) to Google Indexing API\n`)
  const results: SubmitResult[] = []
  for (const url of urls) {
    results.push(await submitUrl(url, accessToken))
  }

  const ok = results.filter(r => r.status === 'ok').length
  const failed = results.length - ok
  console.log(`\nDone. ${ok} succeeded, ${failed} failed.`)

  if (resolvedQueuePath) {
    await archiveSubmittedQueue(resolvedQueuePath, results)
    console.log(`Queue archived in ${ARCHIVE_DIR} and reset.`)
  }

  if (failed > 0) process.exit(2)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
