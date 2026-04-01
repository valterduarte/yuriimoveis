import { Pool } from '@neondatabase/serverless'

let _pool = null

export function getDb() {
  if (!_pool) _pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return _pool
}
