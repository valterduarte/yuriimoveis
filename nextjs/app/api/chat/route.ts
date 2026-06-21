import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from 'ai'
import { requireServerEnv } from '../../../lib/env'
import { rateLimit } from '../../../lib/rateLimit'
import { logHandlerError } from '../../../lib/logger'
import { CHAT_MODEL, CHAT_MAX_STEPS } from '../../../lib/chat/config'
import { CORRETOR_SYSTEM_PROMPT } from '../../../lib/chat/systemPrompt'
import { chatTools } from '../../../lib/chat/tools'

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
