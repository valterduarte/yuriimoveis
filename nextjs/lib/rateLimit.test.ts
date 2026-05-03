import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { rateLimit, rateLimitClear } from './rateLimit'

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows requests up to maxAttempts within the window', () => {
    const isLimited = rateLimit({ name: 't1', maxAttempts: 3, windowMs: 60_000 })
    expect(isLimited('1.2.3.4')).toBe(false) // 1
    expect(isLimited('1.2.3.4')).toBe(false) // 2
    expect(isLimited('1.2.3.4')).toBe(false) // 3
    expect(isLimited('1.2.3.4')).toBe(true)  // 4 — over the limit
  })

  it('isolates limits per key', () => {
    const isLimited = rateLimit({ name: 't2', maxAttempts: 1, windowMs: 60_000 })
    expect(isLimited('alice')).toBe(false)
    expect(isLimited('alice')).toBe(true)
    expect(isLimited('bob')).toBe(false) // bob still has fresh quota
  })

  it('resets after the window elapses', () => {
    const isLimited = rateLimit({ name: 't3', maxAttempts: 1, windowMs: 60_000 })
    expect(isLimited('1.2.3.4')).toBe(false)
    expect(isLimited('1.2.3.4')).toBe(true)

    vi.advanceTimersByTime(61_000)
    expect(isLimited('1.2.3.4')).toBe(false)
  })

  it('isolates limits per name (multiple buckets)', () => {
    const limitedA = rateLimit({ name: 'login',  maxAttempts: 1, windowMs: 60_000 })
    const limitedB = rateLimit({ name: 'signup', maxAttempts: 1, windowMs: 60_000 })

    expect(limitedA('1.2.3.4')).toBe(false)
    expect(limitedA('1.2.3.4')).toBe(true)
    expect(limitedB('1.2.3.4')).toBe(false) // different name, fresh quota
  })

  it('rateLimitClear lets a key try again immediately', () => {
    const isLimited = rateLimit({ name: 't4', maxAttempts: 1, windowMs: 60_000 })
    expect(isLimited('1.2.3.4')).toBe(false)
    expect(isLimited('1.2.3.4')).toBe(true)

    rateLimitClear('t4', '1.2.3.4')
    expect(isLimited('1.2.3.4')).toBe(false)
  })

  it('rateLimitClear is a no-op for unknown name/key', () => {
    expect(() => rateLimitClear('does-not-exist', 'x')).not.toThrow()
  })
})
