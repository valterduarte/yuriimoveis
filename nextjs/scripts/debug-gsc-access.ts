import jwt from 'jsonwebtoken'
import { loadServiceAccount, type ServiceAccount } from './lib/serviceAccount'

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

async function listSites(token: string): Promise<void> {
  const res = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${token}` },
  })
  console.log(`GET /sites → ${res.status}`)
  console.log(await res.text())
  console.log()
}

async function claimSite(token: string, siteUrl: string): Promise<void> {
  const encoded = encodeURIComponent(siteUrl)
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encoded}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })
  console.log(`PUT /sites/${siteUrl} → ${res.status}`)
  if (res.status !== 204) console.log(await res.text())
  console.log()
}

async function main() {
  const account = await loadServiceAccount()

  console.log(`Service account: ${account.client_email}\n`)

  const token = await getToken(account, 'https://www.googleapis.com/auth/webmasters')

  console.log('--- Before claim ---')
  await listSites(token)

  console.log('--- Claiming sc-domain:corretoryuri.com.br ---')
  await claimSite(token, 'sc-domain:corretoryuri.com.br')

  console.log('--- Claiming https://corretoryuri.com.br/ ---')
  await claimSite(token, 'https://corretoryuri.com.br/')

  console.log('--- After claim ---')
  await listSites(token)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
