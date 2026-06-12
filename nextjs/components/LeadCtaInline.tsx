import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { PHONE_WA_BASE } from '../lib/config'
import WhatsAppLink from './WhatsAppLink'

interface LeadCtaInlineProps {
  /** Pre-filled WhatsApp message (raw text — encoded internally). */
  message: string
  /** Analytics source tag passed to WhatsAppLink. */
  source: string
  heading?: string
  body?: string
  /** Where the "browse listings" link points — the buyable inventory that
   *  closes the loop for research-stage readers. */
  listingsHref?: string
  listingsLabel?: string
}

/**
 * Inline lead-capture block for content pages (guides, blog posts).
 * Drops into the middle of an article where the reader is most engaged,
 * turning research-stage traffic into a WhatsApp conversation with Yuri.
 *
 * Besides the WhatsApp CTA it offers the two next steps a research-stage
 * reader actually wants: browsing real listings and running the financing
 * simulator. The listings link doubles as an internal link into the
 * commercial pages that need ranking help.
 */
export default function LeadCtaInline({
  message,
  source,
  heading,
  body,
  listingsHref = '/comprar/osasco/apartamento',
  listingsLabel = 'ou veja apartamentos em Osasco →',
}: LeadCtaInlineProps) {
  const href = `${PHONE_WA_BASE}?text=${encodeURIComponent(message)}`

  return (
    <aside className="my-10 border-l-4 border-primary bg-primary/5 p-6 md:p-7 not-prose">
      <p className="text-base md:text-lg font-bold text-dark mb-2">
        {heading ?? 'Quer comprar com segurança em Osasco?'}
      </p>
      <p className="text-gray-700 text-sm leading-relaxed mb-5">
        {body ??
          'O Corretor Yuri te ajuda do orçamento à escritura: encontra o imóvel certo, simula o financiamento e cuida da papelada — sem compromisso e sem custo.'}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <WhatsAppLink
          href={href}
          source={source}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm uppercase tracking-wider px-6 py-3.5 transition-colors"
          aria-label="Falar com o Corretor Yuri pelo WhatsApp (abre em nova aba)"
        >
          <FaWhatsapp size={18} /> Falar com o Yuri
        </WhatsAppLink>
        <div className="flex flex-col sm:flex-row sm:items-center gap-x-5 gap-y-1.5">
          <Link href={listingsHref} className="text-sm font-semibold text-primary hover:underline">
            {listingsLabel}
          </Link>
          <Link href="/simulador" className="text-sm font-semibold text-primary hover:underline">
            ou simule seu financiamento →
          </Link>
        </div>
      </div>
    </aside>
  )
}
