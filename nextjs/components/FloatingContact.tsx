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

  const linkClass = 'bg-dark hover:bg-primary text-white flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-200'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-3">
        <WhatsAppLink href={PHONE_WA} source="floating-bar" target="_blank" rel="noreferrer" className={linkClass}>
          <FaWhatsapp size={18} />
          <span className="text-[10px] uppercase tracking-wider">WhatsApp</span>
        </WhatsAppLink>
        <a href={PHONE_TEL} className={linkClass}>
          <FiPhone size={18} />
          <span className="text-[10px] uppercase tracking-wider">Ligar</span>
        </a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={linkClass}>
          <FaInstagram size={18} />
          <span className="text-[10px] uppercase tracking-wider">Instagram</span>
        </a>
      </div>
    </div>
  )
}
