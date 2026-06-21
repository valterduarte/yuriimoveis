import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { requireServerEnv, optionalServerEnv, validateServerEnv } from './env'

const REQUIRED = ['DATABASE_URL', 'JWT_SECRET', 'ADMIN_USER', 'ADMIN_PASSWORD', 'GOOGLE_GENERATIVE_AI_API_KEY'] as const

describe('lib/env', () => {
  let snapshot: Record<string, string | undefined>

  beforeEach(() => {
    snapshot = {}
    for (const key of [...REQUIRED, 'UPSTASH_REDIS_REST_URL', 'SKIP_ENV_VALIDATION']) {
      snapshot[key] = process.env[key]
    }
  })

  afterEach(() => {
    for (const [key, value] of Object.entries(snapshot)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  })

  describe('requireServerEnv', () => {
    it('returns the value when set', () => {
      process.env.ADMIN_USER = 'admin'
      expect(requireServerEnv('ADMIN_USER')).toBe('admin')
    })

    it('throws when the variable is missing', () => {
      delete process.env.ADMIN_USER
      expect(() => requireServerEnv('ADMIN_USER')).toThrow(/ADMIN_USER/)
    })

    it('throws when the variable is blank', () => {
      process.env.ADMIN_PASSWORD = ''
      expect(() => requireServerEnv('ADMIN_PASSWORD')).toThrow(/ADMIN_PASSWORD/)
    })
  })

  describe('optionalServerEnv', () => {
    it('returns the trimmed value when set', () => {
      process.env.UPSTASH_REDIS_REST_URL = '  https://example.upstash.io  '
      expect(optionalServerEnv('UPSTASH_REDIS_REST_URL')).toBe('https://example.upstash.io')
    })

    it('returns undefined when unset or blank', () => {
      delete process.env.UPSTASH_REDIS_REST_URL
      expect(optionalServerEnv('UPSTASH_REDIS_REST_URL')).toBeUndefined()
      process.env.UPSTASH_REDIS_REST_URL = '   '
      expect(optionalServerEnv('UPSTASH_REDIS_REST_URL')).toBeUndefined()
    })
  })

  describe('validateServerEnv', () => {
    it('throws listing every missing required variable', () => {
      delete process.env.SKIP_ENV_VALIDATION
      for (const key of REQUIRED) delete process.env[key]
      expect(() => validateServerEnv()).toThrow(/DATABASE_URL.*JWT_SECRET.*ADMIN_USER.*ADMIN_PASSWORD.*GOOGLE_GENERATIVE_AI_API_KEY/)
    })

    it('skips validation when SKIP_ENV_VALIDATION is set', () => {
      process.env.SKIP_ENV_VALIDATION = '1'
      for (const key of REQUIRED) delete process.env[key]
      expect(() => validateServerEnv()).not.toThrow()
    })
  })
})
