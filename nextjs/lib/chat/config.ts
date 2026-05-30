/**
 * Configuration for the lead-attendance assistant.
 *
 * The model id lives here alone so it can be swapped without touching the
 * route or the tools. `gemini-2.5-flash` is fast, strong in Portuguese and
 * available on the Google AI Studio free tier.
 */
export const CHAT_MODEL = 'gemini-2.5-flash'

/** Upper bound on tool-call rounds per turn (search → estimate → register). */
export const CHAT_MAX_STEPS = 6
