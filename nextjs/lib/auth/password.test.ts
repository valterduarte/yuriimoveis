import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from './password'

describe('lib/auth/password', () => {
  it('verifies a password against its own hash', async () => {
    const hash = await hashPassword('s3nha-correta')
    expect(await verifyPassword('s3nha-correta', hash)).toBe(true)
  })

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('s3nha-correta')
    expect(await verifyPassword('s3nha-errada', hash)).toBe(false)
  })

  it('produces a different hash each time (salted)', async () => {
    const a = await hashPassword('mesma-senha')
    const b = await hashPassword('mesma-senha')
    expect(a).not.toBe(b)
    // ...yet both still verify against the original input.
    expect(await verifyPassword('mesma-senha', a)).toBe(true)
    expect(await verifyPassword('mesma-senha', b)).toBe(true)
  })
})
