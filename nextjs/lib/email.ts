import { Resend } from 'resend'
import { optionalServerEnv } from './env'
import { logHandlerError } from './logger'

/**
 * Transactional email via Resend.
 *
 * Email is optional infrastructure: when RESEND_API_KEY is unset (e.g. local
 * dev, or before the account is provisioned) sending is a no-op that returns
 * false instead of throwing, so flows that depend on it degrade gracefully
 * rather than 500-ing. Callers decide what a false return means for them.
 */

const DEFAULT_FROM = 'Corretor Yuri <onboarding@resend.dev>'

interface EmailMessage {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailMessage): Promise<boolean> {
  const apiKey = optionalServerEnv('RESEND_API_KEY')
  if (!apiKey) {
    logHandlerError('email.send', new Error('RESEND_API_KEY is not configured; email not sent'))
    return false
  }

  const from = optionalServerEnv('EMAIL_FROM') ?? DEFAULT_FROM
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({ from, to, subject, html })
  if (error) {
    logHandlerError('email.send', error)
    return false
  }
  return true
}

export function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: 'Redefinição de senha — Admin Corretor Yuri',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="font-size: 18px;">Redefinição de senha</h2>
        <p>Recebemos um pedido para redefinir a senha do painel administrativo.</p>
        <p>Clique no botão abaixo para criar uma nova senha. O link expira em 1 hora.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #1a1a1a; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
            Redefinir senha
          </a>
        </p>
        <p style="font-size: 13px; color: #666;">Se você não pediu isso, ignore este e-mail — sua senha continua a mesma.</p>
      </div>
    `,
  })
}
