import { API_URL } from '../../../lib/config'

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/imoveis?limit=1`, {
      signal: AbortSignal.timeout(10000),
    })
    return Response.json({ ok: res.ok, status: res.status, ts: new Date().toISOString() })
  } catch (err) {
    return Response.json({ ok: false, error: err.message, ts: new Date().toISOString() }, { status: 500 })
  }
}
