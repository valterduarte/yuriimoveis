import { getDb } from '../../../lib/db'

export async function GET() {
  try {
    const result = await getDb().query('SELECT 1')
    return Response.json({ ok: true, ts: new Date().toISOString() })
  } catch (err) {
    return Response.json({ ok: false, error: err.message, ts: new Date().toISOString() }, { status: 500 })
  }
}
