import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../../lib/db'
import { requireUser, withErrorHandler } from '../../../../../lib/apiHandler'

type RouteContext = { params: Promise<{ id: string }> }

export const PATCH = withErrorHandler('PATCH /api/contato/[id]/lido', async (request: NextRequest, { params }: RouteContext) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const { id } = await params
  await getDb().query('UPDATE contatos SET lido = true WHERE id = $1', [id])
  return NextResponse.json({ message: 'Marcado como lido' })
})
