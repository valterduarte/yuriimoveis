import { NextResponse } from 'next/server'
import { getDb } from '../../../../../lib/db'
import { requireAuth } from '../../../../../lib/requireAuth'

export async function PATCH(request, { params }) {
  const user = requireAuth(request)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  try {
    await getDb().query('UPDATE contatos SET lido = true WHERE id = $1', [id])
    return NextResponse.json({ message: 'Marcado como lido' })
  } catch (err) {
    console.error('PATCH /api/contato/[id]/lido error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
