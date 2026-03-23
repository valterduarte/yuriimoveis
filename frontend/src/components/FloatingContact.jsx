import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { FiPhone } from 'react-icons/fi'

const contacts = [
  {
    icon: FaWhatsapp,
    label: 'WhatsApp',
    href: 'https://wa.me/5511967147840',
    bg: 'bg-dark hover:bg-primary',
  },
  {
    icon: FiPhone,
    label: 'Ligar',
    href: 'tel:5511967147840',
    bg: 'bg-dark hover:bg-primary',
  },
  {
    icon: FaInstagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/valterrduarte/',
    bg: 'bg-dark hover:bg-primary',
  },
]

export default function FloatingContact() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="grid grid-cols-3">
        {contacts.map(c => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className={`${c.bg} text-white flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-200`}
          >
            <c.icon size={18} />
            <span className="text-[9px] uppercase tracking-wider">{c.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
