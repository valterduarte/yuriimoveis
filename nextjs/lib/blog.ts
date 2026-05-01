import { unstable_cache } from 'next/cache'
import { getDb } from './db'
import { logDbError } from './logger'
import {
  CACHE_TAG_BLOG,
  LISTING_REVALIDATE_SECONDS,
  STATIC_DATA_REVALIDATE_SECONDS,
} from './cacheTags'
import type { BlogPost, BlogPostRow } from '../types'

function parseBlogPost(row: BlogPostRow): BlogPost {
  return { ...row, tags: JSON.parse(row.tags || '[]') }
}

const fetchPublishedBlogPostsCached = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const result = await getDb().query(
      'SELECT * FROM blog_posts WHERE publicado = true ORDER BY created_at DESC'
    )
    return result.rows.map(parseBlogPost)
  },
  ['fetchPublishedBlogPosts'],
  { tags: [CACHE_TAG_BLOG], revalidate: LISTING_REVALIDATE_SECONDS }
)

const fetchBlogPostBySlugCached = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const result = await getDb().query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND publicado = true',
      [slug]
    )
    if (!result.rows[0]) return null
    return parseBlogPost(result.rows[0])
  },
  ['fetchBlogPostBySlug'],
  { tags: [CACHE_TAG_BLOG], revalidate: LISTING_REVALIDATE_SECONDS }
)

const fetchAllBlogSlugsCached = unstable_cache(
  async (): Promise<Pick<BlogPost, 'slug' | 'updated_at'>[]> => {
    const result = await getDb().query(
      'SELECT slug, updated_at FROM blog_posts WHERE publicado = true ORDER BY created_at DESC'
    )
    return result.rows
  },
  ['fetchAllBlogSlugs'],
  { tags: [CACHE_TAG_BLOG], revalidate: STATIC_DATA_REVALIDATE_SECONDS }
)

export async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    return await fetchPublishedBlogPostsCached()
  } catch (err) {
    logDbError('fetchPublishedBlogPosts', err)
    return []
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await fetchBlogPostBySlugCached(slug)
  } catch (err) {
    logDbError('fetchBlogPostBySlug', err, { slug })
    return null
  }
}

export async function fetchAllBlogSlugs(): Promise<Pick<BlogPost, 'slug' | 'updated_at'>[]> {
  try {
    return await fetchAllBlogSlugsCached()
  } catch (err) {
    logDbError('fetchAllBlogSlugs', err)
    return []
  }
}

export async function fetchRelatedBlogPosts(
  currentSlug: string,
  tags: string[],
  limit = 3,
): Promise<BlogPost[]> {
  try {
    const result = await getDb().query(
      `SELECT *,
         (SELECT COUNT(*) FROM jsonb_array_elements_text(tags::jsonb) tag
          WHERE tag = ANY($2::text[])) AS tag_matches
       FROM blog_posts
       WHERE publicado = true AND slug != $1
       ORDER BY tag_matches DESC, created_at DESC
       LIMIT $3`,
      [currentSlug, tags, limit],
    )
    return result.rows.map(parseBlogPost)
  } catch (err) {
    logDbError('fetchRelatedBlogPosts', err, { currentSlug })
    return []
  }
}
