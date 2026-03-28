import { FiPhone, FiMapPin, FiClock } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import SEOHead from '../components/SEOHead'
import { PHONE_WA, PHONE_TEL, PHONE_DISPLAY, INSTAGRAM_URL } from '../config'

export default function Contato() {

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <SEOHead
        title="Contato"
        description="Entre em contato com o Corretor Yuri Imóveis. Atendimento via WhatsApp, telefone e e-mail para imóveis em Osasco e região."
        url="/contato"
      />

      {/* Hero */}
      <section className="py-24 bg-dark text-white">
        <div className="container mx-auto px-6">
          <span className="section-label">Fale Conosco</span>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-none">Contato</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Info */}
            <div className="space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-6">Informações</h2>

              {[
                { icon: FiMapPin, title: 'Endereço', content: 'Osasco - SP' },
                { icon: FiPhone, title: 'Telefone', content: PHONE_DISPLAY },
{ icon: FiClock, title: 'Horário', content: 'Seg - Sex: 08h às 18h\nSábado: 08h às 12h' },
              ].map(info => (
                <div key={info.title} className="flex gap-4 p-5 border border-gray-200">
                  <div className="w-8 h-8 bg-primary flex items-center justify-center flex-shrink-0">
                    <info.icon className="text-white" size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{info.title}</p>
                    <p className="text-sm text-dark whitespace-pre-line leading-relaxed">{info.content}</p>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="flex gap-2 pt-2">
                <a href={PHONE_WA} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-2.5 transition-colors">
                  <FaWhatsapp size={14} /> WhatsApp
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"
                  className="w-9 h-9 border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <FaInstagram size={14} />
                </a>
              </div>
            </div>

            {/* Contato direto */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 p-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-dark mb-3">Fale Agora</h2>
                <p className="text-sm text-gray-500 mb-8">Entre em contato diretamente pelo WhatsApp ou telefone. Atendemos de seg a sáb.</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={`${PHONE_WA}?text=${encodeURIComponent('Olá! Gostaria de mais informações sobre imóveis.')}`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-[0.15em] text-sm py-6 transition-colors">
                    <FaWhatsapp size={22} /> WhatsApp
                  </a>
                  <a href={PHONE_TEL}
                    className="flex-1 flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#af1e23] text-white font-bold uppercase tracking-[0.15em] text-sm py-6 transition-colors">
                    <FiPhone size={20} /> {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
