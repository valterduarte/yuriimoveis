import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from 'ai'
import { requireServerEnv } from '../../../lib/env'
import { rateLimit } from '../../../lib/rateLimit'
import { logHandlerError } from '../../../lib/logger'
import { CHAT_MODEL, CHAT_MAX_STEPS } from '../../../lib/chat/config'
import { CORRETOR_SYSTEM_PROMPT } from '../../../lib/chat/systemPrompt'
import { chatTools } from '../../../lib/chat/tools'
import { shouldForcePropertySearch } from '../../../lib/chat/incomeRanges'

// Must be a static literal — Next.js analyses route segment config at build time.
export const maxDuration = 30

const isRateLimited = rateLimit({ name: 'chat', maxAttempts: 40, windowMs: 10 * 60 * 1000 })

export async function POST(request: Request): Promise<Response> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (await isRateLimited(ip)) {
    return new Response('Muitas mensagens. Tente novamente em alguns minutos.', { status: 429 })
  }

  try {
    const { messages }: { messages: UIMessage[] } = await request.json()

    const google = createGoogleGenerativeAI({ apiKey: requireServerEnv('GOOGLE_GENERATIVE_AI_API_KEY') })

    const result = streamText({
      model: google(CHAT_MODEL),
      system: CORRETOR_SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools: chatTools,
      stopWhen: stepCountIs(CHAT_MAX_STEPS),
      // Right after the income tap the model often narrates ("achei opções, dá
      // uma olhada acima") or re-asks the property type instead of searching, so
      // the buyer never sees a single listing. Force the search on that step;
      // later steps stay on auto so the model presents the results next.
      prepareStep: ({ stepNumber, messages: stepMessages }) =>
        shouldForcePropertySearch(stepMessages, stepNumber)
          ? { toolChoice: { type: 'tool', toolName: 'buscarImoveis' } }
          : {},
      // Fail fast on quota/rate-limit errors instead of amplifying them 3x.
      maxRetries: 1,
      onError: ({ error }) => logHandlerError('POST /api/chat stream', error),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    logHandlerError('POST /api/chat', error)
    return new Response('Não foi possível processar a mensagem agora.', { status: 500 })
  }
}
