/**
 * Single source of truth for SERVER-side environment variables.
 *
 * SECURITY: never import this module from a Client Component. It centralises
 * access to secrets (DATABASE_URL, JWT_SECRET, admin credentials, the Gemini
 * API key) that must never reach the browser bundle. Public values stay in
 * lib/config.ts behind the NEXT_PUBLIC_ prefix.
 *
 * Use `requireServerEnv` when a missing value is a misconfiguration that should
 * fail loudly (it throws, which surfaces as a 500 inside withErrorHandler-wrapped
 * routes). Use `optionalServerEnv` when a graceful fallback exists. Boot-time
 * validation runs once via instrumentation.ts -> validateServerEnv().
 */
import { z } from 'zod'

const serverEnvSchema = z.object({
  // Required at runtime — the app cannot function correctly without these.
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  ADMIN_USER: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
  // Optional — graceful fallbacks exist (in-memory rate limiting / file-based
  // service account), so their absence must not crash the app.
  UPSTASH_REDIS_REST_URL: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  GOOGLE_SERVICE_ACCOUNT_JSON: z.string().min(1).optional(),
  // Email (password recovery). Without RESEND_API_KEY the forgot-password flow
  // degrades gracefully — no email is sent (see lib/email.ts). EMAIL_FROM falls
  // back to Resend's onboarding sender; ADMIN_RECOVERY_EMAIL seeds the recovery
  // address for the admin account on first boot.
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).optional(),
  ADMIN_RECOVERY_EMAIL: z.string().min(1).optional(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
type ServerEnvKey = keyof ServerEnv

/** Keys whose absence should fail the build/boot, not just a single request. */
const REQUIRED_KEYS: readonly ServerEnvKey[] = [
  'DATABASE_URL',
  'JWT_SECRET',
  'ADMIN_USER',
  'ADMIN_PASSWORD',
  'GOOGLE_GENERATIVE_AI_API_KEY',
]

function assertServer(caller: string): void {
  if (typeof window !== 'undefined') {
    throw new Error(`${caller}() must not be called in the browser`)
  }
}

/**
 * Read a required server variable, validated against its schema field.
 * Throws a clear error when missing or invalid.
 */
export function requireServerEnv<K extends ServerEnvKey>(key: K): string {
  assertServer('requireServerEnv')
  // Trim before validating so this matches optionalServerEnv exactly. A secret
  // pasted into the Vercel dashboard often carries surrounding whitespace; if
  // requireServerEnv (which signs JWTs and compares admin credentials) kept it
  // while optionalServerEnv (which verifies JWTs) stripped it, every
  // authenticated request would 401 and the admin would silently bounce back to
  // the login screen.
  const result = serverEnvSchema.shape[key].safeParse(process.env[key]?.trim())
  if (!result.success || result.data == null) {
    throw new Error(`Missing or invalid environment variable: ${key}`)
  }
  return result.data
}

/** Read an optional server variable. Returns undefined when unset/blank. */
export function optionalServerEnv<K extends ServerEnvKey>(key: K): string | undefined {
  assertServer('optionalServerEnv')
  const value = process.env[key]?.trim()
  return value ? value : undefined
}

let validated = false

/**
 * Validate all required server variables at once. Called from instrumentation.ts
 * on server bootstrap so a missing variable fails fast (at deploy/boot) instead
 * of surfacing as a cryptic runtime error later. Set SKIP_ENV_VALIDATION to skip
 * it in environments that intentionally run without secrets (e.g. a secretless CI
 * build or lint step).
 */
export function validateServerEnv(): void {
  if (process.env.SKIP_ENV_VALIDATION) return
  if (validated) return
  assertServer('validateServerEnv')

  const missing = REQUIRED_KEYS.filter((key) => {
    const result = serverEnvSchema.shape[key].safeParse(process.env[key]?.trim())
    return !result.success || result.data == null
  })

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Set them in .env.local (local dev) or the Vercel project settings (production).',
    )
  }

  validated = true
}
