import { writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import jwt from 'jsonwebtoken'
import { loadServiceAccount, type ServiceAccount } from './lib/serviceAccount'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = join(__dirname, '..', 'public')
const SITE_URL = 'https://corretoryuri.com.br/'

async function getToken(account: ServiceAccount, scope: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const assertion = jwt.sign(
    { iss: account.client_email, scope, aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now },
    account.private_key,
    { algorithm: 'RS256' },
  )

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  })

  if (!res.ok) throw new Error(`Token failed: ${await res.text()}`)
  return ((await res.json()) as { access_token: string }).access_token
}

async function requestVerificationToken(accessToken: string): Promise<string> {
  const res = await fetch('https://www.googleapis.com/siteVerification/v1/token', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      verificationMethod: 'FILE',
      site: { type: 'SITE', identifier: SITE_URL },
    }),
  })

  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${await res.text()}`)
  const data = (await res.json()) as { token: string }
  return data.token
}

async function verifyOwnership(accessToken: string): Promise<void> {
  const encoded = encodeURIComponent(SITE_URL)
  const res = await fetch(
    `https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=FILE&id=${encoded}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ site: { type: 'SITE', identifier: SITE_URL } }),
    },
  )

  console.log(`POST /webResource → ${res.status}`)
  console.log(await res.text())
}

async function main() {
  const mode = process.argv[2]

  const account = await loadServiceAccount()
  const accessToken = await getToken(account, 'https://www.googleapis.com/auth/siteverification')

  if (mode === 'token') {
    const filename = await requestVerificationToken(accessToken)
    const filePath = join(PUBLIC_DIR, filename)
    const content = `google-site-verification: ${filename}\n`
    await writeFile(filePath, content)
    console.log(`Wrote verification file: public/${filename}`)
    console.log(`Content: ${content.trim()}`)
    console.log('\nNext: commit, push, wait for Vercel deploy, then run: npm run gsc:verify')
    return
  }

  if (mode === 'verify') {
    await verifyOwnership(accessToken)
    return
  }

  console.error('Usage: tsx scripts/verify-gsc-ownership.ts token|verify')
  process.exit(1)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
