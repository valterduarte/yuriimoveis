/**
 * Configuration for the lead-attendance assistant.
 *
 * The model id lives here alone so it can be swapped without touching the
 * route or the tools. `gemini-2.5-flash-lite` is fast, strong in Portuguese
 * and has the most generous Google AI Studio free-tier limits — the safest
 * choice for a public, always-on assistant. Bump to `gemini-2.5-flash` (or
 * enable billing) if you want a smarter model and can absorb tighter quotas.
 */
export const CHAT_MODEL = 'gemini-2.5-flash-lite'

/** Upper bound on tool-call rounds per turn (search → estimate → register). */
export const CHAT_MAX_STEPS = 6
