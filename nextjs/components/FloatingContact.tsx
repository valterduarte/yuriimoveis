'use client'

import { usePathname } from 'next/navigation'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { FiPhone } from 'react-icons/fi'
import { PHONE_WA, PHONE_TEL, INSTAGRAM_URL } from '../lib/config'
import WhatsAppLink from './WhatsAppLink'

export default function FloatingContact() {
  const pathname = usePathname()
  const isPropertyDetail = /^\/imoveis\/.+-\d+$/.test(pathname)

  if (isPropertyDetail) return null

  const secondaryClass = 'bg-dark hover:bg-dark/80 text-white flex flex-col items-center justify-center gap-0.5 py-3 transition-colors duration-200'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        <WhatsAppLink
          href={PHONE_WA}
          source="floating-bar"
          target="_blank"
          rel="noreferrer"
          className="col-span-2 bg-[#25D366] hover:bg-[#1ebe57] text-white flex items-center justify-center gap-2 py-3 font-bold uppercase tracking-wider text-xs transition-colors duration-200"
        >
          <FaWhatsapp size={18} />
          Falar agora
        </WhatsAppLink>
        <a href={PHONE_TEL} className={secondaryClass}>
          <FiPhone size={16} />
          <span className="text-[10px] uppercase tracking-wider">Ligar</span>
        </a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={secondaryClass}>
          <FaInstagram size={16} />
          <span className="text-[10px] uppercase tracking-wider">Instagram</span>
        </a>
      </div>
    </div>
  )
}
