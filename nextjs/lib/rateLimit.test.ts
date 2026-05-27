import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { rateLimit, rateLimitClear } from './rateLimit'

describe('rateLimit (in-memory fallback)', () => {
  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows requests up to maxAttempts within the window', async () => {
    const isLimited = rateLimit({ name: 't1', maxAttempts: 3, windowMs: 60_000 })
    expect(await isLimited('1.2.3.4')).toBe(false) // 1
    expect(await isLimited('1.2.3.4')).toBe(false) // 2
    expect(await isLimited('1.2.3.4')).toBe(false) // 3
    expect(await isLimited('1.2.3.4')).toBe(true)  // 4 — over the limit
  })

  it('isolates limits per key', async () => {
    const isLimited = rateLimit({ name: 't2', maxAttempts: 1, windowMs: 60_000 })
    expect(await isLimited('alice')).toBe(false)
    expect(await isLimited('alice')).toBe(true)
    expect(await isLimited('bob')).toBe(false)
  })

  it('resets after the window elapses', async () => {
    const isLimited = rateLimit({ name: 't3', maxAttempts: 1, windowMs: 60_000 })
    expect(await isLimited('1.2.3.4')).toBe(false)
    expect(await isLimited('1.2.3.4')).toBe(true)

    vi.advanceTimersByTime(61_000)
    expect(await isLimited('1.2.3.4')).toBe(false)
  })

  it('isolates limits per name (multiple buckets)', async () => {
    const limitedA = rateLimit({ name: 'login',  maxAttempts: 1, windowMs: 60_000 })
    const limitedB = rateLimit({ name: 'signup', maxAttempts: 1, windowMs: 60_000 })

    expect(await limitedA('1.2.3.4')).toBe(false)
    expect(await limitedA('1.2.3.4')).toBe(true)
    expect(await limitedB('1.2.3.4')).toBe(false)
  })

  it('rateLimitClear lets a key try again immediately', async () => {
    const isLimited = rateLimit({ name: 't4', maxAttempts: 1, windowMs: 60_000 })
    expect(await isLimited('1.2.3.4')).toBe(false)
    expect(await isLimited('1.2.3.4')).toBe(true)

    await rateLimitClear('t4', '1.2.3.4')
    expect(await isLimited('1.2.3.4')).toBe(false)
  })

  it('rateLimitClear is a no-op for unknown name/key', async () => {
    await expect(rateLimitClear('does-not-exist', 'x')).resolves.toBeUndefined()
  })
})
