/**
 * Single source of truth for admin UI styling.
 *
 * Every input, label, card and section heading in the admin panel pulls its
 * Tailwind classes from here so the surface stays visually consistent and a
 * design tweak happens in one place instead of a dozen inline strings.
 */

/** White content card — the building block every section sits in. */
export const card = 'bg-white rounded-md border border-gray-300 p-6'

/** Text input / number input / input with datalist. */
export const fieldInput =
  'w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-dark ' +
  'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40'

/** Multiline input; same look as fieldInput but vertically resizable. */
export const fieldTextarea = `${fieldInput} resize-y`

/** Uppercase label that sits above a field. */
export const fieldLabel =
  'block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1.5'

/** Helper text shown under a field. */
export const fieldHint = 'mt-1 text-xs text-gray-500 leading-relaxed'

/** Section heading inside a card (e.g. "Informações Básicas"). */
export const sectionHeading = 'text-xs font-bold uppercase tracking-widest text-dark'
