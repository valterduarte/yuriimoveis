import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { PHONE_WA } from '../../lib/config'
import WhatsAppLink from '../WhatsAppLink'

export default function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-6 text-center reveal">
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-4">
          Pronto para encontrar<br />seu imóvel?
        </h2>
        <p className="text-white/90 text-sm mb-10 max-w-lg mx-auto">
          Fale com nossa equipe agora mesmo e dê o primeiro passo para realizar o sonho do imóvel perfeito.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <WhatsAppLink href={PHONE_WA} source="home-cta" target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold uppercase tracking-widest text-xs py-4 px-8 hover:bg-gray-100 transition-colors">
            <FaWhatsapp size={16} /> Falar pelo WhatsApp
          </WhatsAppLink>
          <Link href="/imoveis"
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold uppercase tracking-widest text-xs py-4 px-8 hover:bg-white/10 transition-colors">
            Ver imóveis <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
