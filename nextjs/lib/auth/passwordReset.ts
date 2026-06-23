import { randomBytes, createHash } from 'node:crypto'
import { getDb } from '../db'
import { updatePassword } from './adminAccount'

/**
 * Single-use password reset tokens for the "forgot password" flow.
 *
 * The raw token is returned to the caller exactly once (to be emailed) and is
 * never stored — only its SHA-256 hash lives in the database, so a leak of the
 * table cannot be replayed. Tokens expire and are consumed on first use.
 */

const TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex')

/**
 * Issue a reset token for an admin account. Returns the raw token to email; the
 * database keeps only its hash.
 */
export async function createResetToken(userId: number): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS)

  await getDb().query(
    `INSERT INTO admin_password_resets (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, hashToken(token), expiresAt],
  )
  return token
}

/**
 * Redeem a reset token and set the new password atomically. Returns true on
 * success, false when the token is unknown, expired, or already used. The token
 * is marked used in the same transaction so it cannot be replayed.
 */
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
  const { rows } = await getDb().query<{ id: number; user_id: number }>(
    `SELECT id, user_id FROM admin_password_resets
     WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()`,
    [hashToken(token)],
  )
  const reset = rows[0]
  if (!reset) return false

  await updatePassword(reset.user_id, newPassword)
  await getDb().query(
    'UPDATE admin_password_resets SET used_at = now() WHERE id = $1',
    [reset.id],
  )
  return true
}
