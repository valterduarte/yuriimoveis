import { getDb } from '../db'
import { requireServerEnv, optionalServerEnv } from '../env'
import { hashPassword, verifyPassword } from './password'

/**
 * Domain + data access for the single admin account.
 *
 * Credentials used to live in ADMIN_USER / ADMIN_PASSWORD env vars, which are
 * read-only at runtime and therefore impossible to manage from the UI. They now
 * live in the admin_users table; the env vars survive only as the seed source so
 * the existing login never breaks on the first request after this ships.
 */

export interface AdminAccount {
  id: number
  username: string
  passwordHash: string
  recoveryEmail: string | null
}

interface AdminRow {
  id: number
  username: string
  password_hash: string
  recovery_email: string | null
}

const toAccount = (row: AdminRow): AdminAccount => ({
  id: row.id,
  username: row.username,
  passwordHash: row.password_hash,
  recoveryEmail: row.recovery_email,
})

// A valid-but-non-matching hash. Comparing against it when no account is found
// keeps login response time uniform whether or not the username exists, so an
// attacker cannot enumerate the username via timing. The value is irrelevant —
// it only needs to be a well-formed bcrypt hash that nothing matches.
const DUMMY_HASH = '$2b$12$0000000000000000000000000000000000000000000000000000a'

let seeded = false

/**
 * Create the admin account from ADMIN_USER / ADMIN_PASSWORD the first time it is
 * needed. Idempotent and race-safe (UNIQUE username + ON CONFLICT DO NOTHING),
 * so concurrent first logins cannot create duplicates.
 */
export async function ensureAdminSeeded(): Promise<void> {
  if (seeded) return

  const db = getDb()
  const existing = await db.query('SELECT 1 FROM admin_users LIMIT 1')
  if (existing.rows.length > 0) {
    seeded = true
    return
  }

  const username = requireServerEnv('ADMIN_USER')
  const passwordHash = await hashPassword(requireServerEnv('ADMIN_PASSWORD'))
  const recoveryEmail = optionalServerEnv('ADMIN_RECOVERY_EMAIL') ?? null

  await db.query(
    `INSERT INTO admin_users (username, password_hash, recovery_email)
     VALUES ($1, $2, $3)
     ON CONFLICT (username) DO NOTHING`,
    [username, passwordHash, recoveryEmail],
  )
  seeded = true
}

export async function getAdminByUsername(username: string): Promise<AdminAccount | null> {
  const { rows } = await getDb().query<AdminRow>(
    'SELECT id, username, password_hash, recovery_email FROM admin_users WHERE username = $1',
    [username],
  )
  return rows[0] ? toAccount(rows[0]) : null
}

export async function getAdminByRecoveryEmail(email: string): Promise<AdminAccount | null> {
  const { rows } = await getDb().query<AdminRow>(
    'SELECT id, username, password_hash, recovery_email FROM admin_users WHERE lower(recovery_email) = lower($1)',
    [email],
  )
  return rows[0] ? toAccount(rows[0]) : null
}

/**
 * Verify a username/password pair against the stored hash. Always runs a bcrypt
 * comparison (against a dummy hash when the user is unknown) to avoid leaking
 * which usernames exist through response timing.
 */
export async function verifyCredentials(username: string, password: string): Promise<AdminAccount | null> {
  await ensureAdminSeeded()
  const account = await getAdminByUsername(username)
  const matches = await verifyPassword(password, account?.passwordHash ?? DUMMY_HASH)
  return account && matches ? account : null
}

export async function updatePassword(userId: number, newPassword: string): Promise<void> {
  const passwordHash = await hashPassword(newPassword)
  await getDb().query(
    'UPDATE admin_users SET password_hash = $1, updated_at = now() WHERE id = $2',
    [passwordHash, userId],
  )
}

/** Rename the admin account. Throws when the new username is already taken. */
export async function updateUsername(userId: number, newUsername: string): Promise<void> {
  const taken = await getDb().query(
    'SELECT 1 FROM admin_users WHERE username = $1 AND id <> $2',
    [newUsername, userId],
  )
  if (taken.rows.length > 0) {
    throw new UsernameTakenError(newUsername)
  }
  await getDb().query(
    'UPDATE admin_users SET username = $1, updated_at = now() WHERE id = $2',
    [newUsername, userId],
  )
}

export async function updateRecoveryEmail(userId: number, email: string | null): Promise<void> {
  await getDb().query(
    'UPDATE admin_users SET recovery_email = $1, updated_at = now() WHERE id = $2',
    [email, userId],
  )
}

/** Raised when a rename collides with an existing username (surfaced as a 409). */
export class UsernameTakenError extends Error {
  constructor(username: string) {
    super(`Username already taken: ${username}`)
    this.name = 'UsernameTakenError'
  }
}
