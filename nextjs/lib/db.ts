import { Pool } from '@neondatabase/serverless'
import { optionalServerEnv } from './env'

let _pool: Pool | null = null

export function getDb(): Pool {
  if (!_pool) _pool = new Pool({ connectionString: optionalServerEnv('DATABASE_URL') })
  return _pool
}
