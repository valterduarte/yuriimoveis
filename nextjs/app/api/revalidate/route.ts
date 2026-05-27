import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { CACHE_TAG_BLOG, CACHE_TAG_IMOVEIS, CACHE_TAG_SITE_CONFIG } from '../../../lib/cacheTags'
import { parseSchema, requireUser, withErrorHandler } from '../../../lib/apiHandler'

const VALID_TAGS = [CACHE_TAG_IMOVEIS, CACHE_TAG_BLOG, CACHE_TAG_SITE_CONFIG] as const

const revalidateSchema = z.object({
  tag: z.enum(VALID_TAGS).optional(),
  tags: z.array(z.enum(VALID_TAGS)).optional(),
}).refine(data => data.tag || (data.tags && data.tags.length > 0), {
  message: 'Informe "tag" ou "tags"',
})

export const POST = withErrorHandler('POST /api/revalidate', async (request: NextRequest) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const body = await request.json().catch(() => ({}))
  const data = parseSchema(revalidateSchema, body)
  if (data instanceof NextResponse) return data

  const tagsToRevalidate = data.tags ?? [data.tag!]
  for (const tag of tagsToRevalidate) revalidateTag(tag)

  return NextResponse.json({
    message: 'Cache invalidado',
    tags: tagsToRevalidate,
    validTags: VALID_TAGS,
  })
})

export const GET = withErrorHandler('GET /api/revalidate', async (request: NextRequest) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user
  return NextResponse.json({ validTags: VALID_TAGS })
})
