import { unstable_cache } from 'next/cache'
import { getDb } from './db'
import { logDbError } from './logger'
import { CACHE_TAG_SITE_CONFIG, SITE_CONFIG_REVALIDATE_SECONDS } from './cacheTags'

const fetchSiteConfigCached = unstable_cache(
  async (key: string): Promise<string | null> => {
    const result = await getDb().query('SELECT value FROM site_config WHERE key = $1', [key])
    return result.rows[0]?.value ?? null
  },
  ['fetchSiteConfig'],
  { tags: [CACHE_TAG_SITE_CONFIG], revalidate: SITE_CONFIG_REVALIDATE_SECONDS }
)

export async function fetchSiteConfig(key: string): Promise<string | null> {
  try {
    return await fetchSiteConfigCached(key)
  } catch (err) {
    logDbError('fetchSiteConfig', err, { key })
    return null
  }
}
