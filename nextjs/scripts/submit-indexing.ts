import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import jwt from 'jsonwebtoken'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SERVICE_ACCOUNT_PATH = join(__dirname, '..', 'service-account.json')
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const INDEXING_URL = 'https://indexing.googleapis.com/v3/urlNotifications:publish'
const SCOPE = 'https://www.googleapis.com/auth/indexing'

interface ServiceAccount {
  client_email: string
  private_key: string
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

async function submitUrl(url: string, accessToken: string): Promise<void> {
  const response = await fetch(INDEXING_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  })

  if (!response.ok) {
    console.error(`✗ ${url} — ${response.status} ${await response.text()}`)
    return
  }

  console.log(`✓ ${url}`)
}

async function main() {
  const urls = process.argv.slice(2)

  if (urls.length === 0) {
    console.error('Usage: tsx scripts/submit-indexing.ts <url1> [url2] ...')
    process.exit(1)
  }

  const rawAccount = await readFile(SERVICE_ACCOUNT_PATH, 'utf-8').catch(() => null)
  if (!rawAccount) {
    console.error(`service-account.json not found at ${SERVICE_ACCOUNT_PATH}`)
    process.exit(1)
  }

  const account = JSON.parse(rawAccount) as ServiceAccount
  const accessToken = await getAccessToken(account)

  console.log(`Submitting ${urls.length} URL(s) to Google Indexing API\n`)
  for (const url of urls) {
    await submitUrl(url, accessToken)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
