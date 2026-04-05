interface RateLimitRecord {
  count: number
  firstAttempt: number
}

interface RateLimitConfig {
  name: string
  maxAttempts: number
  windowMs: number
}

const stores = new Map<string, Map<string, RateLimitRecord>>()

/**
 * In-memory rate limiter. Adequate for single-instance deployments.
 * For multi-instance, replace with Redis/Upstash.
 */
export function rateLimit({ name, maxAttempts, windowMs }: RateLimitConfig): (key: string) => boolean {
  if (!stores.has(name)) stores.set(name, new Map())
  const attempts = stores.get(name)!

  return function isRateLimited(key: string): boolean {
    const now = Date.now()
    const record = attempts.get(key)

    if (!record || now - record.firstAttempt > windowMs) {
      attempts.set(key, { count: 1, firstAttempt: now })
      return false
    }

    record.count++
    return record.count > maxAttempts
  }
}

export function rateLimitClear(name: string, key: string): void {
  stores.get(name)?.delete(key)
}
