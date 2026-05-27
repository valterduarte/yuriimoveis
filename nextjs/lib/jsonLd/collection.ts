interface CollectionPageInput {
  name: string
  url: string
  description?: string
  numberOfItems?: number
  itemNames?: string[]
  items?: Record<string, unknown>[]
}

export function buildCollectionPage({
  name,
  url,
  description,
  numberOfItems,
  itemNames,
  items,
}: CollectionPageInput): Record<string, unknown> {
  let itemListElement: Record<string, unknown>[] | undefined
  if (items && items.length) {
    itemListElement = items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, item: it }))
  } else if (itemNames && itemNames.length) {
    itemListElement = itemNames.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n }))
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url,
    ...(description ? { description } : {}),
    ...(numberOfItems !== undefined ? { numberOfItems } : {}),
    ...(itemListElement ? { itemListElement } : {}),
  }
}
