import { describe, it, expect, vi, beforeEach } from 'vitest'

const query = vi.fn()
vi.mock('../db', () => ({ getDb: () => ({ query }) }))

const updatePassword = vi.fn()
vi.mock('./adminAccount', () => ({ updatePassword: (...args: unknown[]) => updatePassword(...args) }))

import { createResetToken, resetPasswordWithToken } from './passwordReset'

beforeEach(() => {
  query.mockReset()
  updatePassword.mockReset()
})

describe('createResetToken', () => {
  it('returns a raw token but stores only its hash', async () => {
    query.mockResolvedValue({ rows: [] })
    const token = await createResetToken(1)

    expect(token).toMatch(/^[a-f0-9]{64}$/) // 32 random bytes, hex
    const [, params] = query.mock.calls[0]
    const storedHash = (params as unknown[])[1] as string
    // The raw token is never persisted — only its SHA-256 hash.
    expect(storedHash).not.toBe(token)
    expect(storedHash).toMatch(/^[a-f0-9]{64}$/)
  })
})

describe('resetPasswordWithToken', () => {
  it('returns false for an unknown/expired/used token', async () => {
    query.mockResolvedValue({ rows: [] })
    expect(await resetPasswordWithToken('inexistente', 'nova-senha-123')).toBe(false)
    expect(updatePassword).not.toHaveBeenCalled()
  })

  it('updates the password and consumes the token when valid', async () => {
    query.mockImplementation((sql: string) => {
      if (sql.includes('SELECT id, user_id')) return { rows: [{ id: 9, user_id: 1 }] }
      return { rows: [] }
    })

    expect(await resetPasswordWithToken('valido', 'nova-senha-123')).toBe(true)
    expect(updatePassword).toHaveBeenCalledWith(1, 'nova-senha-123')
    // The token row is marked used so it cannot be replayed.
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('SET used_at = now()'),
      [9],
    )
  })
})
