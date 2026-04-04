const stores = new Map()

/**
 * In-memory rate limiter. Adequate for single-instance deployments.
 * For multi-instance, replace with Redis/Upstash.
 */
export function rateLimit({ name, maxAttempts, windowMs }) {
  if (!stores.has(name)) stores.set(name, new Map())
  const attempts = stores.get(name)

  return function isRateLimited(key) {
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

export function rateLimitClear(name, key) {
  stores.get(name)?.delete(key)
}
