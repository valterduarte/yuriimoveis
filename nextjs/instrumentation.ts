import { validateServerEnv } from './lib/env'

/**
 * Next.js runs this once when a server instance bootstraps. Validating here
 * fails fast on a missing required variable at deploy/boot time instead of
 * letting it surface as a cryptic runtime error on the first request.
 *
 * Only runs on the Node.js runtime — the Edge runtime (middleware) does not
 * use these secrets.
 */
export function register(): void {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    validateServerEnv()
  }
}
