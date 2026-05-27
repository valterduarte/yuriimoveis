import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface ServiceAccount {
  client_email: string
  private_key: string
}

const SERVICE_ACCOUNT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'service-account.json',
)

/**
 * Loads the Google service account credentials.
 *
 * Order of precedence:
 *   1. GOOGLE_SERVICE_ACCOUNT_JSON env var (recommended for CI/CD and Vercel)
 *   2. service-account.json file at nextjs/ root (legacy local fallback)
 *
 * The file fallback is intentionally kept so local dev keeps working until
 * everyone migrates to the env var. Remove it once the env var is mandatory.
 */
export async function loadServiceAccount(): Promise<ServiceAccount> {
  const fromEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (fromEnv) {
    try {
      return JSON.parse(fromEnv) as ServiceAccount
    } catch (err) {
      throw new Error(
        `GOOGLE_SERVICE_ACCOUNT_JSON is set but not valid JSON: ${(err as Error).message}`,
      )
    }
  }

  if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    throw new Error(
      `No Google service account credentials found. ` +
        `Set GOOGLE_SERVICE_ACCOUNT_JSON env var (preferred) ` +
        `or place service-account.json at ${SERVICE_ACCOUNT_PATH}`,
    )
  }
  return JSON.parse(await readFile(SERVICE_ACCOUNT_PATH, 'utf-8')) as ServiceAccount
}
