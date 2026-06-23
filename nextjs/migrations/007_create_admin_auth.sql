-- Move admin credentials out of read-only environment variables and into the
-- database so they can be managed from the admin UI (change username/password,
-- self-service password recovery). The very first login seeds this table from
-- ADMIN_USER / ADMIN_PASSWORD (see lib/auth/adminAccount.ts), so the existing
-- login keeps working with no interruption.
--
-- Passwords are NEVER stored in plain text: password_hash holds a bcrypt hash.
CREATE TABLE IF NOT EXISTS admin_users (
  id             SERIAL PRIMARY KEY,
  username       TEXT        NOT NULL UNIQUE,
  password_hash  TEXT        NOT NULL,
  recovery_email TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Single-use, short-lived tokens for the "forgot password" flow. Only the
-- SHA-256 hash of the token is stored, so a database leak cannot be replayed to
-- reset a password. A row is consumed (used_at set) the moment it is redeemed.
CREATE TABLE IF NOT EXISTS admin_password_resets (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER     NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash  TEXT        NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_password_resets_token_hash
  ON admin_password_resets (token_hash);
