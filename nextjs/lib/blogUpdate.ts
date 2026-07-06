// Columns a blog post PUT is allowed to change. `imagem_capa` is intentionally
// guarded below so a blank value can never wipe an existing cover.
export const UPDATABLE_BLOG_COLUMNS = [
  'titulo', 'slug', 'resumo', 'conteudo', 'imagem_capa',
  'meta_titulo', 'meta_descricao', 'tags', 'publicado',
] as const

export type UpdatableBlogColumn = typeof UPDATABLE_BLOG_COLUMNS[number]

type BlogUpdate = Partial<Record<UpdatableBlogColumn, unknown>>

/**
 * Builds the parameterized SET assignments for a blog post update.
 *
 * Fields the caller omitted (undefined) are skipped. A blank `imagem_capa` is
 * also skipped: the cover can be replaced but never cleared through this
 * endpoint, so an empty submission (upload not finished, script sending the
 * full object with an empty cover, etc.) can never wipe a saved cover.
 *
 * Placeholders are 1-based to match `$1, $2, ...`; callers append any trailing
 * params (e.g. the WHERE id) at index `values.length + 1`.
 */
export function buildBlogUpdateAssignments(updates: BlogUpdate): { fields: string[]; values: unknown[] } {
  const fields: string[] = []
  const values: unknown[] = []

  for (const column of UPDATABLE_BLOG_COLUMNS) {
    const value = updates[column]
    if (value === undefined) continue
    if (column === 'imagem_capa' && typeof value === 'string' && value.trim() === '') continue
    fields.push(`${column} = $${values.length + 1}`)
    values.push(column === 'tags' ? JSON.stringify(value) : value)
  }

  return { fields, values }
}
