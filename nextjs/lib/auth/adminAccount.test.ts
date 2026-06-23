import { describe, it, expect, vi, beforeEach } from 'vitest'

// A programmable query mock standing in for the Neon pool. Each test sets its
// behaviour via `query.mockImplementation`.
const query = vi.fn()
vi.mock('../db', () => ({ getDb: () => ({ query }) }))

import { hashPassword } from './password'
import {
  verifyCredentials,
  updateUsername,
  UsernameTakenError,
} from './adminAccount'

const accountRow = (passwordHash: string) => ({
  rows: [{ id: 1, username: 'yuri', password_hash: passwordHash, recovery_email: null }],
})

beforeEach(() => {
  query.mockReset()
})

describe('verifyCredentials', () => {
  it('returns the account when the password is correct', async () => {
    const hash = await hashPassword('s3nha-correta')
    query.mockImplementation((sql: string) => {
      if (sql.includes('LIMIT 1')) return { rows: [{ exists: 1 }] } // already seeded
      if (sql.includes('WHERE username')) return accountRow(hash)
      return { rows: [] }
    })

    const account = await verifyCredentials('yuri', 's3nha-correta')
    expect(account?.username).toBe('yuri')
  })

  it('returns null when the password is wrong', async () => {
    const hash = await hashPassword('s3nha-correta')
    query.mockImplementation((sql: string) => {
      if (sql.includes('LIMIT 1')) return { rows: [{ exists: 1 }] }
      if (sql.includes('WHERE username')) return accountRow(hash)
      return { rows: [] }
    })

    expect(await verifyCredentials('yuri', 's3nha-errada')).toBeNull()
  })

  it('returns null for an unknown user', async () => {
    query.mockImplementation((sql: string) => {
      if (sql.includes('LIMIT 1')) return { rows: [{ exists: 1 }] }
      return { rows: [] } // no matching user
    })

    expect(await verifyCredentials('fantasma', 'qualquer-senha')).toBeNull()
  })
})

describe('updateUsername', () => {
  it('throws UsernameTakenError when the new name is in use', async () => {
    query.mockImplementation((sql: string) => {
      if (sql.includes('AND id <>')) return { rows: [{ exists: 1 }] } // taken
      return { rows: [] }
    })

    await expect(updateUsername(1, 'duplicado')).rejects.toBeInstanceOf(UsernameTakenError)
  })

  it('updates when the new name is free', async () => {
    query.mockImplementation((sql: string) => {
      if (sql.includes('AND id <>')) return { rows: [] } // free
      return { rows: [] }
    })

    await expect(updateUsername(1, 'novo-nome')).resolves.toBeUndefined()
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE admin_users SET username'),
      ['novo-nome', 1],
    )
  })
})
