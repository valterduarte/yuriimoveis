import bcrypt from 'bcryptjs'

/**
 * Password hashing for admin credentials. Centralised here so the cost factor
 * and algorithm live in one place — never hash or compare with bcrypt directly
 * from a route or domain module.
 */

// 12 rounds is the common 2020s default: strong enough that an offline crack is
// expensive, fast enough to stay well under a serverless request budget.
const SALT_ROUNDS = 12

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}
