/**
 * Broker presentation helpers — formatting for the corretor trust card shown
 * at the moment of decision (property sidebar / contact). Pure functions so the
 * UI stays thin and testable.
 */

/** Initials for the avatar fallback when no photo is set ("Yuri Duarte" -> "YD"). */
export function brokerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Brazilian-style rating, one decimal with a comma (4.9 -> "4,9"). */
export function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',')
}

/** Pluralized review count label in Portuguese. */
export function reviewCountLabel(count: number): string {
  return count === 1 ? '1 avaliação' : `${count} avaliações`
}

/**
 * Returns the rating pair only when we have real, positive review data — otherwise
 * null, so the UI hides the stars instead of publishing fabricated numbers.
 */
export function resolveRating(
  rating: number | null,
  reviewCount: number | null,
): { rating: number; reviewCount: number } | null {
  if (rating == null || reviewCount == null || reviewCount <= 0) return null
  return { rating, reviewCount }
}
