import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

interface RateLimitConfig {
  name: string
  maxAttempts: number
  windowMs: number
}

interface RateLimitRecord {
  count: number
  firstAttempt: number
}

type Duration = `${number} ms`

const memoryStores = new Map<string, Map<string, RateLimitRecord>>()
const upstashLimiters = new Map<string, Ratelimit>()

let cachedRedis: Redis | null = null
let redisLookupDone = false

function getRedis(): Redis | null {
  if (redisLookupDone) return cachedRedis
  redisLookupDone = true
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    cachedRedis = Redis.fromEnv()
  }
  return cachedRedis
}

function getUpstashLimiter(config: RateLimitConfig): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null

  const existing = upstashLimiters.get(config.name)
  if (existing) return existing

  const window: Duration = `${config.windowMs} ms`
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.maxAttempts, window),
    analytics: false,
    prefix: `rl:${config.name}`,
  })
  upstashLimiters.set(config.name, limiter)
  return limiter
}

function memoryIsLimited(config: RateLimitConfig, key: string): boolean {
  let bucket = memoryStores.get(config.name)
  if (!bucket) {
    bucket = new Map()
    memoryStores.set(config.name, bucket)
  }

  const now = Date.now()
  const record = bucket.get(key)
  if (!record || now - record.firstAttempt > config.windowMs) {
    bucket.set(key, { count: 1, firstAttempt: now })
    return false
  }

  record.count++
  return record.count > config.maxAttempts
}

/**
 * Per-name rate limiter. Returns an async predicate keyed by an arbitrary
 * string (typically IP). Resolves true when the caller is over the limit.
 *
 * Backed by Upstash Redis when UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are set (durable across serverless instances).
 * Falls back to an in-process Map otherwise — adequate only for local dev
 * and single-instance deployments.
 */
export function rateLimit(config: RateLimitConfig): (key: string) => Promise<boolean> {
  return async (key: string): Promise<boolean> => {
    const upstash = getUpstashLimiter(config)
    if (upstash) {
      const { success } = await upstash.limit(key)
      return !success
    }
    return memoryIsLimited(config, key)
  }
}

export async function rateLimitClear(name: string, key: string): Promise<void> {
  const redis = getRedis()
  if (redis) {
    await redis.del(`rl:${name}:${key}`)
    return
  }
  memoryStores.get(name)?.delete(key)
}
