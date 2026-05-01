/**
 * Backwards-compatible barrel re-exporting the data layer.
 *
 * The data access used to live in this single file. It now lives in
 * domain modules (properties, blog, navigationMatrix, siteConfig) and
 * the shared cache tags in cacheTags. New code should import from the
 * domain module directly; this barrel exists so existing consumers do
 * not have to change in lockstep.
 */

export {
  CACHE_TAG_IMOVEIS,
  CACHE_TAG_SITE_CONFIG,
  CACHE_TAG_BLOG,
} from './cacheTags'

export {
  parseImovel,
  fetchFeaturedProperties,
  fetchImovel,
  fetchPropertiesByBairro,
  fetchProperties,
  fetchDistinctBairros,
  fetchCidadesByTipo,
  fetchDistinctCidades,
  fetchSimilarProperties,
  fetchPropertiesByTypeCategory,
  fetchAllPropertySlugs,
  fetchPropertiesForMap,
  type MapImovel,
} from './properties'

export {
  fetchNavigationMatrix,
  fetchPriceBedroomMatrix,
  type NavigationMatrixRow,
  type PriceBedroomMatrixRow,
} from './navigationMatrix'

export { fetchSiteConfig } from './siteConfig'

export {
  fetchPublishedBlogPosts,
  fetchBlogPostBySlug,
  fetchAllBlogSlugs,
  fetchRelatedBlogPosts,
} from './blog'
