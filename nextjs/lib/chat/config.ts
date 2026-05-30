/**
 * Configuration for the lead-attendance assistant.
 *
 * The model id lives here alone so it can be swapped without touching the
 * route or the tools. `gemini-2.5-flash` follows the persona and tool rules
 * far better than flash-lite (which mangled the persona and invented data);
 * its tighter free-tier quota (~20 req/min) is fine for real, spread-out
 * traffic. Enable billing or swap providers if quota ever becomes a problem.
 */
export const CHAT_MODEL = 'gemini-2.5-flash'

/** Upper bound on tool-call rounds per turn (search → estimate → register). */
export const CHAT_MAX_STEPS = 6
